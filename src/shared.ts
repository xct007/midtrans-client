import MidtransClient from "./index";

export class Shared {
	protected _client: MidtransClient;

	constructor(client: MidtransClient) {
		this._client = client;
	}
}
