import MidtransClient from "../index";

export class Aggregator {
	protected _client: MidtransClient;

	constructor(_client: MidtransClient) {
		this._client = _client;
	}
	/**
	 * Get current balance information.
	 *
	 * Ref: https://docs.midtrans.com/reference/check-balance-agregator
	 */
	balance(): Promise<{
		/**
		 * Balance information for partner
		 */
		balance: string;
	}> {
		return this._client._iris.get(
			`/iris/api/${this._client.Iris.apiVersion}/balance`
		);
	}
	/**
	 * List top up information channels for Aggregator Partner.
	 *
	 * Ref: https://docs.midtrans.com/reference/top-up-channel-information-for-aggregator
	 */
	channels(): Promise<IAggregatorChannel[]> {
		return this._client._iris.get(
			`/iris/api/${this._client.Iris.apiVersion}/channels`
		);
	}
}

export interface IAggregatorChannel {
	/**
	 * Channel ID
	 */
	id: number;
	/**
	 * Virtual Account Type
	 */
	virtual_account_type: string;
	/**
	 * Virtual Account Number
	 */
	virtual_account_number: string;
}
