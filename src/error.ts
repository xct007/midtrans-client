/* eslint-disable no-unused-vars */
export class MidtransError extends Error {
	constructor(
		message: string,
		public readonly error?: unknown,
		public readonly statusCode?: number
	) {
		super(message);
		this.name = "MidtransError";
	}
}
