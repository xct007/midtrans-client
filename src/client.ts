import { randomBytes } from "crypto";
import { fetch, setGlobalOrigin } from "undici";
import { MidtransError } from "./error";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type RequestHeaders = {
	Authorization?: string;
	"Idempotency-Key"?: string;
	"X-Payment-Locale"?: "en-EN" | "id-ID";
} & Record<string, string>;

interface RequestOptions {
	method: HttpMethod;
	headers: RequestHeaders;
	body?: string;
}

interface HttpOptions {
	baseUrl: string;
	clientKey?: string;
	serverKey?: string;
	throwHttpErrors?: boolean;
	useIdempotencyKey?: boolean;
}

export class Http {
	private readonly baseUrl: string;
	private readonly throwHttpErrors: boolean | undefined;
	protected readonly _authHeader: string | undefined;
	protected readonly fetch: typeof fetch;

	private useIdempotencyKey: boolean | undefined;

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
		useIdempotencyKey,
	}: HttpOptions) {
		this.baseUrl = baseUrl;
		this.throwHttpErrors = throwHttpErrors ?? false;

		if (serverKey) {
			this._authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;
		}
		this.clientKey = clientKey || "";
		this.useIdempotencyKey = useIdempotencyKey ?? false;
		this.fetch = fetch;
	}

	private buildIdempotencyKey(): string {
		const timestamp = Date.now().toString();
		const randomString = randomBytes(64).toString("hex");
		const uniqueKey = `${timestamp}-${randomString}`;
		return uniqueKey.length > 100 ? uniqueKey.substring(0, 100) : uniqueKey;
	}

	buildHeaders(headers?: RequestHeaders): RequestHeaders {
		const defaultHeaders: RequestHeaders = {
			"Content-Type": "application/json",
			Accept: "application/json",
			"User-Agent":
				"Midtrans-Client/1.1 +https://github.com/xct007/midtrans-client",
			...(this.useIdempotencyKey
				? { "Idempotency-Key": this.buildIdempotencyKey() }
				: {}),
		};

		if (this._authHeader) {
			defaultHeaders.Authorization = this._authHeader;
		}

		return { ...defaultHeaders, ...headers };
	}

	sanitizePath(path: string): string {
		// explicitly set global origin
		setGlobalOrigin(new URL(this.baseUrl).origin);
		return path.startsWith("/") ? path : `/${path}`;
	}

	async makeRequest<T>(
		method: HttpMethod,
		url: string,
		data?: unknown,
		headers?: RequestHeaders
	): Promise<T> {
		const options: RequestOptions = {
			method,
			headers: this.buildHeaders(headers),
		};

		if (data) {
			const dataString = JSON.stringify(data);
			if (Buffer.byteLength(dataString) > this.MAX_REQUEST_SIZE) {
				throw new MidtransError("Request size exceeds 16KB limit");
			}
			options.body = dataString;
		}

		try {
			const response = await this.fetch(this.sanitizePath(url), options);
			const rawData = await response.text();
			const contentType = response.headers.get("content-type") as
				| string
				| undefined;
			return this._handleResponse<T>(
				response.status,
				rawData,
				contentType
			);
		} catch (error) {
			this._handleError(error);
		}
	}

	private _handleResponse<T>(
		statusCode: number,
		rawData: string,
		contentType?: string
	): T {
		if (statusCode >= 400 && this.throwHttpErrors) {
			throw new MidtransError(
				`HTTP Error: ${statusCode}`,
				rawData,
				statusCode
			);
		}

		try {
			return this._parseResponse<T>(rawData, contentType);
		} catch {
			// force to return rawData if failed to parse
			if (statusCode === 200) {
				return rawData as unknown as T;
			}
			throw new MidtransError(
				"Failed to parse response",
				rawData,
				statusCode
			);
		}
	}

	private _parseResponse<T>(rawData: string, contentType?: string): T {
		if (!rawData.trim()) {
			throw new MidtransError("Empty response received");
		}

		if (contentType && contentType.includes("application/json")) {
			try {
				return JSON.parse(rawData) as T;
			} catch {
				throw new MidtransError("Invalid JSON response");
			}
		}

		return rawData as unknown as T;
	}

	private _handleError(error: unknown): never {
		throw new MidtransError("An error occurred in HttpClient", error);
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
		headers?: RequestHeaders
	): Promise<T> {
		const queryString = params ? `?${this._buildParams(params)}` : "";
		return this.makeRequest(
			"GET",
			`${url}${queryString}`,
			undefined,
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
	irisApiBaseUrl: string;
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
	/**
	 * Representing iris api client
	 */
	_iris: Http;

	constructor({
		coreApiBaseUrl,
		snapApiBaseUrl,
		irisApiBaseUrl,
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
		this._iris = new Http({
			baseUrl: irisApiBaseUrl,
			...options,
			useIdempotencyKey: true,
		});
	}
}
