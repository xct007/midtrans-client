import { Shared } from "../shared";
import { Aggregator } from "./aggregator";
import { Beneficiary } from "./beneficiary";
import { Facilitator } from "./facilitator";
import { Payout } from "./payout";

export const BASEURL = "https://app.midtrans.com";
export const BASEURL_SANDBOX = "https://app.sandbox.midtrans.com";

/**
 * Representing Payouts API
 */
export class Api extends Shared {
	public apiVersion = "v1";

	ping(): Promise<"pong" | string> {
		return this._client._iris.get("/iris/ping");
	}
	/**
	 * Check if an account is valid, if valid return account information.
	 *
	 * **Ensure that your user account has certain permissions, otherwise request will be rejected.**
	 */
	accountValidation(body: {
		account_no: string;
		bank_code: string;
	}): Promise<IValidationBankAccount> {
		return this._client._iris.get(
			`/iris/api/${this.apiVersion}/account_validation`,
			{
				params: body,
			}
		);
	}
	/**
	 * Get list of [supported banks](https://docs.midtrans.com/reference/list-of-supported-banks) in Payouts.
	 *
	 * **Ensure that your user account has certain permissions, otherwise request will be rejected.**
	 */
	supportedBanks(): Promise<{ banks: string[] }> {
		return this._client._iris.get(
			`/iris/api/${this.apiVersion}/beneficiary_banks`
		);
	}
	/**
	 * Representing Payout API
	 *
	 * **Ensure that your user account has _Creator_ role, otherwise request will be rejected.**
	 *
	 * Ref:
	 * [create](https://docs.midtrans.com/reference/create-payout) |
	 * [approve](https://docs.midtrans.com/reference/accept-payout) |
	 * [reject](https://docs.midtrans.com/reference/reject-payout) |
	 * [get](https://docs.midtrans.com/reference/get-payout-details)
	 */
	payout: Payout = new Payout(this._client);
	/**
	 * Representing Beneficiary API
	 *
	 * **Ensure that your user account has certain permissions, otherwise request will be rejected.**
	 *
	 * Ref:
	 * [create](https://docs.midtrans.com/reference/create-beneficiaries) |
	 * [update](https://docs.midtrans.com/reference/update-beneficiaries) |
	 * [lists](https://docs.midtrans.com/reference/list-of-beneficiaries)
	 */
	beneficiary: Beneficiary = new Beneficiary(this._client);
	/**
	 * Representing Facilitator API
	 *
	 * For Facilitator Partner.
	 *
	 * **Ensure that your user account has certain permissions, otherwise request will be rejected.**
	 *
	 * Ref:
	 * [lists](https://docs.midtrans.com/reference/bank-account-facilitator) |
	 * [balance](https://docs.midtrans.com/reference/check-balance-facilitator)
	 */
	facilitator: Facilitator = new Facilitator(this._client);
	/**
	 * Representing Aggregator API
	 *
	 * For Aggregator Partner.
	 *
	 * **Ensure that your user account has certain permissions, otherwise request will be rejected.**
	 *
	 * Ref:
	 * [balance](https://docs.midtrans.com/reference/check-balance-agregator)
	 */
	aggregator: Aggregator = new Aggregator(this._client);
}

export interface IValidationBankAccount {
	/**
	 * Unique ID of the Account Validation
	 */
	id: string;
	/**
	 * Account name of partner's bank account
	 */
	account_name: string;
	/**
	 * Account number of partner's bank account
	 */
	account_no: string;
	/**
	 * Bank name of partner's bank account
	 */
	bank_name: string;
}
