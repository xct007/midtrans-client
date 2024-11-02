/* eslint-disable no-unused-vars */
export interface IMidtransHttpError {
	status_code?: string;
	status_message?: string;
	id?: string;
	error_messages?: string[];
}

export class HttpClientError extends Error {
	constructor(
		message: string,
		public readonly error?: unknown
	) {
		super(message);
		this.name = "HttpClientError";
	}
}

export class HttpStatusError extends HttpClientError {
	constructor(
		message: string,
		public readonly statusCode: number,
		error?: IMidtransHttpError
	) {
		super(message, error);
		this.name = "HttpStatusError";
	}
}

export class MidtransError extends Error {
	constructor(
		message: string,
		public readonly _error?: unknown
	) {
		super(message);
		this.name = "MidtransError";
	}
}
