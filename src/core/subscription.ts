import MidtransClient, { CustomerDetails } from "../index";

/**
 * Representing Subscription API
 */
export class Subscription {
	protected _client: MidtransClient;
	constructor(_client: MidtransClient) {
		this._client = _client;
	}
	/**
	 * Create a subscription that contains all the details for creating transaction.
	 *
	 * @param {SubsReq} body
	 */
	create<T extends SubsReq = SubsReq>(
		body: T
	): Promise<
		(T extends { metadata: infer M }
			? { metadata: Required<M> }
			: T extends { customer_details: infer C }
				? { customer_details: Required<C> }
				: T) &
			T & {
				schedule: SubsRspSchedule;
			} & SubsRsp
	> {
		return this._client._core.post("/v1/subscriptions", body);
	}
	/**
	 * Retrieve the subscription details of a customer using the `subscription_id`.
	 *
	 * @param {string} subscription_id
	 */
	get<T extends SubsReqBase = SubsReqBase>(
		subscription_id: string
	): Promise<
		Omit<T, "metadata" | "customer_details"> & {
			metadata: Record<string, unknown>;
			schedule: Required<T["schedule"]> & SubsRspSchedule;
			retry_schedule: SubsReqRetrySchedule;
			customer_details: Required<T["customer_details"]>;
		} & SubsRsp
	> {
		return this._client._core.get(`/v1/subscriptions/${subscription_id}`);
	}
	/**
	 * Disable a customer's subscription account with aspecific `subscription_id`
	 * so that the customer is not charged for the subscription in the future.
	 *
	 * @param {string} subscription_id
	 */
	disable(subscription_id: string): Promise<{ status_message: string }> {
		return this._client._core.post(
			`/v1/subscriptions/${subscription_id}/disable`
		);
	}
	/**
	 * Activate a customer's subscription account with a specific `subscription_id`,
	 * so that the customer can start paying for the subscription immediately.
	 *
	 * @param {string} subscription_id
	 */
	enable(subscription_id: string): Promise<{ status_message: string }> {
		return this._client._core.post(
			`/v1/subscriptions/${subscription_id}/enable`
		);
	}
	/**
	 * Cancel a customer's subscription account with a specific `subscription_id`
	 * so that the customer is not charged for the subscription in the future.
	 *
	 * @param {string} subscription_id
	 */
	cancel(subscription_id: string): Promise<{ status_message: string }> {
		return this._client._core.post(
			`/v1/subscriptions/${subscription_id}/cancel`
		);
	}
	/**
	 * Activate a customer's subscription account with a specific `subscription_id`,
	 * so that the customer can start paying for the subscription immediately.
	 *
	 * @param {string} subscription_id
	 */
	update(
		subscription_id: string,
		body: Omit<
			SubsReqBase,
			"payment_type" | "metadata" | "customer_details" | "schedule"
		> & {
			schedule?: Partial<SubsReqSchedule>;
			retry_schedule?: Partial<SubsReqRetrySchedule>;
			gopay?: { account_id: string };
		}
	): Promise<{ status_message: string }> {
		return this._client._core.patch(
			`/v1/subscriptions/${subscription_id}`,
			body
		);
	}
}

export type SubsPaymentType = "credit_card" | "gopay";
export interface SubsReqBase {
	/**
	 * Name of the subscription. It is used to generate order ID for the transaction.
	 *
	 * Generated order ID will contain subscription name and 32 digits of unique number.
	 */
	name: string;
	/**
	 * The amount to be charged to the customer.
	 */
	amount: string;
	/**
	 * ISO-4217 representation of three-letter alphabetic currency code.
	 *
	 * *Note*: Currently only `IDR` is supported.
	 */
	currency: "IDR";
	/**
	 * The payment method used by the customer.
	 *
	 * Note: Currently only `credit_card` and `gopay` are supported.
	 */
	payment_type: SubsPaymentType;
	/**
	 * The `saved_token_id` for Card Payment.
	 *
	 * The `token` for Gopay Tokenization.
	 */
	token: string;
	/**
	 * Details of the subscription schedule.
	 */
	schedule: SubsReqSchedule;
	/**
	 * Metadata of subscription specified by you.
	 *
	 * *Note*: Limit the size to less than 1KB.
	 */
	metadata?: Record<string, unknown>;
	/**
	 * Details of the customer.
	 */
	customer_details?: Partial<CustomerDetails>;
}

export type SubsReq<T extends SubsPaymentType = SubsPaymentType> =
	T extends "credit_card"
		? {
				/**
				 * Details of the retry schedule
				 */
				retry_schedule?: Partial<SubsReqRetrySchedule>;
			} & SubsReqBase
		: {
				/**
				 * GoPay subscription information
				 */
				gopay: {
					/**
					 * Gopay Account id.
					 */
					account_id: string;
				};
			} & SubsReqBase;

export interface SubsReqSchedule {
	/**
	 * Subscription's interval given by merchant.
	 */
	interval: number;
	/**
	 * Interval temporal unit.
	 */
	interval_unit: "day" | "week" | "month";
	/**
	 * Maximum interval of subscription.
	 * Subscription will end after maximum interval is reached.
	 */
	max_interval?: number;
	/**
	 * Timestamp of subscription in `yyyy-MM-dd HH:mm:ss Z`.
	 *
	 * The value must be after the current time.
	 *
	 * If specified, first payment will happen on start_time.
	 *
	 * If start_time is not specified, the default value for `start_time`
	 * will be the date after the first interval after current time.
	 */
	start_time?: string;
}

export interface SubsReqRetrySchedule {
	/**
	 * Subscription's retry interval given by merchant.
	 */
	interval: number;
	/**
	 * Retry interval temporal unit.
	 */
	interval_unit: "minute" | "hour" | "day";
	/**
	 * Maximum retry interval of subscription (up to 3 times).
	 */
	max_interval: number;
}

type SubsRspSchedule = {
	current_interval: number;
	previous_execution_at: string;
	next_execution_at: string;
};
export type SubsRsp = {
	/**
	 * Subscription ID.
	 */
	id: string;
	/**
	 * Current subscription status.
	 *
	 * i.e: `active`
	 */
	status: "active" | "inactive";
	/**
	 * Subscription schedule creation timestamp in ISO 8601 format.
	 */
	created_at: string;
	/**
	 * List of transactions id
	 */
	transaction_ids: (string | never)[];
};
