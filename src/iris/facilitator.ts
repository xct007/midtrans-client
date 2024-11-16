import MidtransClient from "../index";

export class Facilitator {
	protected _client: MidtransClient;

	constructor(_client: MidtransClient) {
		this._client = _client;
	}
	/**
	 * Get current balance information of registered bank account.
	 *
	 * Ref: https://docs.midtrans.com/reference/check-balance-facilitator
	 */
	balance(
		/**
		 * Bank account ID to be used when creating payouts
		 */
		bank_account_id: string
	): Promise<{ balance: string }> {
		return this._client._iris.get(
			`/iris/api/${this._client.Iris.apiVersion}/bank_accounts/${bank_account_id}/balance`
		);
	}
	/**
	 * Get list of registered bank accounts for facilitator partner.
	 *
	 * Ref: https://docs.midtrans.com/reference/bank-account-facilitator
	 */
	lists(): Promise<IFacilitator[]> {
		return this._client._iris.get(
			`/iris/api/${this._client.Iris.apiVersion}/beneficiaries`
		);
	}
}

export interface IFacilitator {
	/**
	 * Bank account ID to be used when creating payouts
	 */
	bank_account_id: string;
	/**
	 * Bank name of partner's bank account
	 */
	bank_name: string;
	/**
	 * Account name of partner's bank account
	 */
	account_name: string;
	/**
	 * Account number of partner's bank account
	 */
	account_number: string;
	/**
	 * Registration process of bank account
	 */
	status: "in_progress" | "live";
}
