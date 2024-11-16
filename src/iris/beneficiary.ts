import MidtransClient from "../index";

export class Beneficiary {
	protected _client: MidtransClient;

	constructor(_client: MidtransClient) {
		this._client = _client;
	}
	/**
	 * Create a new beneficiary information.
	 *
	 * Ref: https://docs.midtrans.com/reference/create-beneficiaries
	 */
	create(data: IBeneficiary): Promise<{ status: string | "created" }> {
		return this._client._iris.post(
			`/iris/api/${this._client.Iris.apiVersion}/beneficiaries`,
			data
		);
	}
	/**
	 * Update an existing beneficiary identified by its alias_name
	 *
	 * Ref: https://docs.midtrans.com/reference/update-beneficiaries
	 */
	update(
		/**
		 * Alias name used by the Beneficiary
		 */
		alias_name: string,
		/**
		 * Updated beneficiary data
		 */
		updated: IBeneficiary
	): Promise<{ status: string | "updated" }> {
		return this._client._iris.patch(
			`/iris/api/${this._client.Iris.apiVersion}/beneficiaries/${alias_name}`,
			updated
		);
	}
	/**
	 * Get list of beneficiaries
	 *
	 * Ref: https://docs.midtrans.com/reference/list-of-beneficiaries
	 */
	lists(): Promise<Required<IBeneficiary>[]> {
		return this._client._iris.get(
			`/iris/api/${this._client.Iris.apiVersion}/beneficiaries`
		);
	}
}

export interface IBeneficiary {
	/**
	 * Name of the Beneficiary
	 */
	name: string;
	/**
	 * Bank name used by the Beneficiary for payout to bank,
	 * or `gopay` and `ovo` for payout to e-wallet.
	 */
	bank: string;
	/**
	 * Bank account number of the Beneficiary (for payout to bank account)
	 * or phone number beginning with `62` or `08` (for payout to e-wallet)
	 */
	account: number | string;
	/**
	 * Alias name used by the Beneficiary
	 */
	alias_name: string;
	/**
	 * Beneficiary email
	 */
	email?: string;
}
