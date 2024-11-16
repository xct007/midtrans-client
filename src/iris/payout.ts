import MidtransClient from "../index";

export class Payout {
	protected _client: MidtransClient;

	constructor(_client: MidtransClient) {
		this._client = _client;
	}
	/**
	 * Create a payouts.
	 *
	 * It can be used for single payout and also multiple payouts.
	 *
	 * Ref: https://docs.midtrans.com/reference/create-payout
	 */
	create(body: { payouts: IPayout[] }): Promise<{
		payouts: {
			/**
			 * Payment status.
			 */
			status: PayoutStatus;
			/**
			 * Unique ID to identify the payout.
			 */
			reference_no: string;
		}[];
	}> {
		return this._client._iris.post(
			`/iris/api/${this._client.Iris.apiVersion}/payouts`,
			body
		);
	}
	/**
	 * Approve payouts request.
	 *
	 * Ref: https://docs.midtrans.com/reference/accept-payout
	 */
	approve(body: {
		/**
		 * Unique IDs to identify the payouts
		 */
		reference_nos: string[];
		/**
		 * Google auth OTP (QR Code will be sent to approver's email during partner registration)
		 *
		 * `optional` `(based on config)`
		 */
		otp?: string;
	}): Promise<{ status: string | "ok" }> {
		return this._client._iris.patch(
			`/iris/api/${this._client.Iris.apiVersion}/payouts/approve`,
			body
		);
	}
	/**
	 * Reject payouts request.
	 *
	 * Ref: https://docs.midtrans.com/reference/reject-payout
	 */
	reject(body: {
		/**
		 * Unique IDs to identify the payouts
		 */
		reference_nos: string[];
		/**
		 * Reason to reject the payouts
		 */
		reject_reason: string;
	}): Promise<{ status: string | "ok" }> {
		return this._client._iris.patch(
			`/iris/api/${this._client.Iris.apiVersion}/payouts/reject`,
			body
		);
	}
	/**
	 * Get payout details by reference number.
	 *
	 * Ref: https://docs.midtrans.com/reference/get-payout-details
	 */
	get(reference_no: string): Promise<IPayoutRsp> {
		return this._client._iris.get(
			`/iris/api/${this._client.Iris.apiVersion}/payouts/${reference_no}`
		);
	}
}

export type PayoutStatus = "queued" | "processed" | "completed" | "failed";

export interface IPayout {
	/**
	 * Name of the Beneficiary
	 */
	beneficiary_name: string;
	/**
	 * Account number of the Beneficiary,
	 * could be **bank account number** (for bank payout)
	 * or **mobile phone number** (starting with `62` or `08` without any special characters)
	 * for `e-wallet` payout.
	 */
	beneficiary_account: string;
	/**
	 * Bank name used by the Beneficiary,
	 * including `gopay` and `ovo` for payout to `e-wallet`.
	 */
	beneficiary_bank: string;
	/**
	 * Valid Email address for Beneficiary
	 */
	beneficiary_email?: string;
	/**
	 * (numeric) Payout amount.
	 *
	 * **Note:** This is a Monetary Value, the decimal-fraction value must be equal to _`.0`_.
	 *
	 * *Example*: `10000`, `10000.0`, `10000.00`
	 */
	amount: string;
	/**
	 * Add a note to the payout , max 100 characters (unique is encouraged)
	 */
	notes: string;
	/**
	 * Bank account ID registered in Payouts for facilitator model,
	 * can be accessed in [Midtrans Dashboard](https://dashboard.midtrans.com/)
	 * in Bank Accounts menu.
	 *
	 * If not specified, then it will be picked based on
	 * `beneficiary_bank == facilitator_bank` OR if `facilitator_bank` supports **SKN**
	 */
	bank_account_id?: string;
}

export interface IPayoutRsp {
	/**
	 * Amount of the processed payout
	 */
	amount: string;
	/**
	 * Name of the Beneficiary
	 */
	beneficiary_name: string;
	/**
	 * Account number of the Beneficiary
	 */
	beneficiary_account: string;
	/**
	 * Bank name used by the Beneficiary
	 */
	bank: string;
	/**
	 * Unique ID to identify the payout
	 */
	reference_no: string;
	/**
	 * Payout notes
	 */
	notes: string;
	/**
	 * Beneficiary email
	 */
	beneficiary_email: string;
	/**
	 * Payout status
	 */
	status: PayoutStatus;
	/**
	 * Payout created by the maker
	 */
	created_by: string;
	/**
	 * Payout creation date
	 *
	 * `ISO8601 format`
	 */
	created_at: string;
	/**
	 * Payout updated date
	 *
	 * `ISO8601 format`
	 */
	updated_at: string;
}
