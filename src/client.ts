import https from "https";
import { HttpClientError, HttpStatusError } from "./error";
import { VERSION } from "./version";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
// TODO: headers for payouts/BI-SNAP API
// https://docs.midtrans.com/reference/https-header
// https://docs.midtrans.com/reference/core-api-snap-open-api-overview
type RequestHeaders = {
	Authorization?: string;
	"Idempotency-Key"?: string;
	"X-Payment-Locale"?: "en-EN" | "id-ID";
} & Record<string, string>;

interface RequestOptions {
	method: HttpMethod;
	headers: RequestHeaders;
}

interface HttpOptions {
	baseUrl: string;
	clientKey?: string;
	serverKey?: string;
	throwHttpErrors?: boolean;
}

export class Http {
	private readonly baseUrl: string;
	protected readonly _authHeader: string | undefined;
	private readonly throwHttpErrors: boolean | undefined;

	/**
	 * Some of API endpoints require client key
	 * so we need to store it here
	 *
	 * Ref: https://docs.midtrans.com/reference/get-token
	 */
	clientKey: string | undefined;

	/**
	 * Maximum allowed size of HTTP(S) request is 16KB.
	 *
	 *
	 * Ref: https://docs.midtrans.com/reference/https-request-1
	 */
	private readonly MAX_REQUEST_SIZE = 16 * 1024;

	constructor({
		baseUrl,
		clientKey,
		serverKey,
		throwHttpErrors,
	}: HttpOptions) {
		this.baseUrl = baseUrl;
		this.throwHttpErrors = throwHttpErrors ?? false;

		// Bypass password because midtrans authentication doesn't require password
		if (serverKey) {
			this._authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;
		}

		this.clientKey = clientKey || "";
	}

	/**
	 * Build headers, add custom headers here
	 * @param {RequestHeaders} headers
	 * @returns {RequestHeaders}
	 */
	buildHeaders(headers?: RequestHeaders): RequestHeaders {
		const defaultHeaders: RequestHeaders = {
			"Content-Type": "application/json",
			Accept: "application/json",
			"User-Agent": `Midtrans-Client/${VERSION} (https://github.com/xct007/midtrans-client)`,
		};

		if (this._authHeader) {
			defaultHeaders.Authorization = this._authHeader;
		}

		return { ...defaultHeaders, ...headers };
	}

	/**
	 * Sanitize URL
	 * @param {string} url
	 * @returns {string}
	 */
	buildUrl(url: string): string {
		if (!url.startsWith("/")) {
			url = `/${url}`;
		}
		return `${this.baseUrl}${url}`;
	}

	async makeRequest<T>(
		method: HttpMethod,
		url: string,
		data?: unknown,
		headers?: RequestHeaders
	): Promise<T> {
		// const headers = this.buildHeaders();
		const options: RequestOptions = {
			method,
			headers: this.buildHeaders(headers),
		};

		return new Promise<T>((resolve, reject) => {
			const req = https.request(this.buildUrl(url), options, (res) => {
				const statusCode = res.statusCode || 0;
				if (statusCode >= 400 && this.throwHttpErrors) {
					res.emit("error", `HTTP status code ${statusCode}`);
				}
				let rawData = "";
				res.on("data", (chunk) => (rawData += chunk));
				res.on("end", () => this._then<T>(rawData, resolve, reject));
			});

			req.on("error", (e) => this._catch(e, reject));

			if (data) {
				const dataString = JSON.stringify(data);
				if (Buffer.byteLength(dataString) > this.MAX_REQUEST_SIZE) {
					req.emit("error", "Request size exceeds 16KB limit");
				}
				req.write(dataString);
			}

			req.end();
		});
	}

	private _then<T>(
		rawData: string,
		resolve: (_value: T) => void,
		reject: (_reason?: unknown) => void
	) {
		try {
			const parsedData = JSON.parse(rawData);
			const midStatusCode = parsedData.status_code;

			if (
				midStatusCode &&
				Number(midStatusCode) >= 400 &&
				this.throwHttpErrors
			) {
				return reject(
					new HttpStatusError(
						parsedData.status_message,
						midStatusCode,
						parsedData
					)
				);
			}
			resolve(parsedData);
		} catch (e) {
			this._catch(e, reject);
		}
	}

	private _catch(error: unknown, reject: (_reason?: unknown) => void) {
		reject(new HttpClientError("An error occurred in HttpClient", error));
	}

	private _buildParams(params?: unknown): string {
		const searchParams = new URLSearchParams();

		if (typeof params === "object" && params !== null) {
			for (const [key, value] of Object.entries(params)) {
				if (value !== undefined && value !== null) {
					searchParams.append(key, String(value));
				}
			}
		}
		return searchParams.toString();
	}

	public async get<T>(
		url: string,
		params?: unknown,
		headers?: Headers
	): Promise<T> {
		return this.makeRequest(
			"GET",
			`${url}${params ? "?" + this._buildParams(params) : ""}`,
			headers
		);
	}

	public async post<T>(
		url: string,
		data?: unknown,
		headers?: RequestHeaders
	): Promise<T> {
		return this.makeRequest("POST", url, data, headers);
	}

	public async patch<T>(
		url: string,
		data?: unknown,
		headers?: RequestHeaders
	): Promise<T> {
		return this.makeRequest("PATCH", url, data, headers);
	}

	public async delete<T>(
		url: string,
		data?: unknown,
		headers?: RequestHeaders
	): Promise<T> {
		return this.makeRequest("DELETE", url, data, headers);
	}
}

export interface ClientOptions {
	coreApiBaseUrl: string;
	snapApiBaseUrl: string;
	clientKey: string;
	serverKey: string;
	throwHttpErrors?: boolean;
}

export class Client {
	/**
	 * Representing core api client
	 */
	_core: Http;
	/**
	 * Representing snap api client
	 */
	_snap: Http;

	constructor({
		coreApiBaseUrl,
		snapApiBaseUrl,
		clientKey,
		serverKey,
		throwHttpErrors,
	}: ClientOptions) {
		const options: Partial<HttpOptions> = {
			clientKey,
			serverKey,
			throwHttpErrors,
		};
		this._core = new Http({
			baseUrl: coreApiBaseUrl,
			...options,
		});
		this._snap = new Http({
			baseUrl: snapApiBaseUrl,
			...options,
		});
	}
}
