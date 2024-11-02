import MidtransClient from "..";
import {
	CaptureReq,
	ChargeReq,
	ChargeRsp,
	MidtransRspBase,
	RegisterCardReq,
	RegisterCardRsp,
} from "../resource";
import { Shared } from "../shared";

/**
 * Representing Subscription API
 */
class Subscription {
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

/**
 * Representing Payment API
 */
export class Api extends Shared {
	private readonly _apiVersion = "/v2";

	private _buildUrl(url: string, path = this._apiVersion) {
		return `${path}${url}`;
	}
	/**
	 * Tokenize payment card information before being charged.
	 *
	 * @param params
	 */
	getToken<T extends CoreBaseRsp = CoreBaseRsp>(
		params: TokenizeReq
	): Promise<
		(T extends {
			status_code: "200" | "201";
		}
			? {
					token_id: string;
					hash: string;
				}
			: T) & {
			validation_messages: string[];
			id: string;
		}
	> {
		return this._client._core.get(this._buildUrl("/token"), {
			// Idk
			client_key: this._client._core.clientKey,
			...params,
		});
	}
	/**
	 * Perform a transaction with various available payment methods and features.
	 */
	charge<T extends ChargeReq = ChargeReq>(
		body: T
	): Promise<
		ChargeRsp<
			T["payment_type"],
			T extends { payment_type: "bank_transfer" }
				? T["bank_transfer"]["bank"]
				: undefined
		>
	> {
		return this._client._core.post(this._buildUrl("/charge"), body);
	}
	/**
	 * Capture an authorized transaction for card payment.
	 */
	capture<T>(body: CaptureReq): Promise<T & MidtransRspBase> {
		return this._client._core.post(this._buildUrl("/capture"), body);
	}
	/**
	 * Approve a transaction with certain `order_id` which gets challenge status from Fraud Detection System.
	 */
	approve<T>(order_id: string): Promise<T & MidtransRspBase> {
		return this._client._core.post(this._buildUrl(`/${order_id}/approve`));
	}
	/**
	 * Deny a transaction with a specific `order_id`, flagged as challenge by Fraud Detection System.
	 */
	deny<T>(order_id: string): Promise<T & MidtransRspBase> {
		return this._client._core.post(this._buildUrl(`/${order_id}/deny`));
	}
	/**
	 * Cancel a transaction with a specific `order_id`.
	 *
	 * Note: Cancelation can only be done before settlement process.
	 */
	cancel<T>(order_id: string): Promise<T & MidtransRspBase> {
		return this._client._core.post(this._buildUrl(`/${order_id}/cancel`));
	}
	/**
	 * Update the transaction status of a specific `order_id`, from pending to expired.
	 */
	expire<T>(order_id: string): Promise<T & MidtransRspBase> {
		return this._client._core.post(this._buildUrl(`/${order_id}/expire`));
	}
	/**
	 * Update the transaction status of a specific `order_id`, from settlement to refund.
	 *
	 * Refund transaction is supported only for
	 * `credit_card`, `gopay`, `shopeepay`, `QRIS`, `kredivo` and `akulaku` payment methods.
	 */
	refund<T>(order_id: string): Promise<T & MidtransRspBase> {
		return this._client._core.post(this._buildUrl(`/${order_id}/refund`));
	}
	/**
	 * Send refund to the customer's bank or the payment provider and update the transaction status to refund.
	 */
	directRefund(
		order_id: string,
		body: DirectRefundReq
	): Promise<DirectRefundRsp> {
		return this._client._core.post(
			this._buildUrl(`/${order_id}/refund/online/direct`),
			body
		);
	}
	/**
	 * Get the transaction status of a specific `order_id`.
	 *
	 * *Note*: If using BI SNAP and DANA payment methods, please only use Transaction ID to get status.
	 */
	status<T>(order_id: string): Promise<T & MidtransRspBase> {
		return this._client._core.get(this._buildUrl(`/${order_id}/status`));
	}
	/**
	 * Get the transaction status multiple B2B transactions related to certain order_id.
	 */
	statusB2B<T>(
		order_id: string,
		opts: { page: number; per_page: number } = {
			page: 0,
			per_page: 10,
		}
	): Promise<
		CoreBaseRsp & {
			transactions: (T & MidtransRspBase)[];
		}
	> {
		return this._client._core.get(this._buildUrl(`/${order_id}/status`), {
			page: opts.page.toString(),
			per_page: opts.per_page.toString(),
		});
	}
	/**
	 * Register customer's card information (card number and expiry) to be used for One Click and Two Click transactions.
	 */
	registerCard(opts: RegisterCardReq): Promise<RegisterCardRsp> {
		return this._client._core.get(
			this._buildUrl("/card/register"),
			opts as unknown as Record<string, string>
		);
	}
	/**
	 * Get the point balance of the card in denomination amount.
	 */
	pointInquiry(
		token_id: string,
		gross_amount?: string
	): Promise<
		CoreBaseRsp & {
			transaction_time: string;
			point_balance_amount: string;
		}
	> {
		return this._client._core.get(
			this._buildUrl(`/card/register/${token_id}`),
			{
				gross_amount,
			}
		);
	}
	/**
	 * Used to link the customer's account to create payment for certain channel.
	 */
	createGoPayAccount(opts: {
		payment_type: string;
		gopay_partner: {
			phone_number: string;
			country_code: string;
			redirect_url: string;
		};
	}): Promise<
		Omit<CoreBaseRsp, "status_message"> & {
			payment_type: string;
			account_id: string;
			account_status: string;
			actions: {
				name: string;
				method: string;
				url: string;
			}[];
		}
	> {
		return this._client._core.post(this._buildUrl("/pay/account"), opts);
	}
	/**
	 * Get customer payment account details.
	 *
	 * [Get Pay Account API](https://docs.midtrans.com/reference/get-pay-account)
	 * is called to retrieve GoPay Token, needed for GoPay subscriptions.
	 */
	getGoPayAccount(account_id: string): Promise<
		Omit<CoreBaseRsp, "status_message"> & {
			payment_type: string;
			account_id: string;
			account_status: string;
			metadata: {
				payment_options: {
					name: string;
					active: boolean;
					balance: {
						value: number;
						currency: string;
					};
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					metadata: Record<string, any>;
					token: string;
				}[];
			};
		}
	> {
		return this._client._core.get(
			this._buildUrl(`/pay/account/${account_id}`)
		);
	}
	/**
	 * Unbind a linked customer account.
	 */
	unbindGoPayAccount(account_id: string): Promise<
		Omit<CoreBaseRsp, "status_message"> & {
			payment_type: string;
			account_id: string;
			account_status: string;
			channel_response_code: string;
			channel_response_message: string;
		}
	> {
		return this._client._core.post(
			this._buildUrl(`/pay/account/${account_id}/unbind`)
		);
	}
	/**
	 * Get bin metadata.
	 */
	getBinMetadata(bin: string): Promise<{ data: Record<string, unknown> }> {
		return this._client._core.get(this._buildUrl(`/pay/account/${bin}`));
	}

	/**
	 * Subscription API Methods
	 *
	 * Ref: https://docs.midtrans.com/reference/api-methods-1
	 */
	subscription: Subscription = new Subscription(this._client);
}

export interface TokenizeReq {
	/**
	 * The token ID of credit card saved previously.
	 */
	token_id: string;
	/**
	 * The 16 digits Credit Card number.
	 */
	card_number: string;
	/**
	 * The CVV number printed on the card.
	 */
	card_cvv?: string;
	/**
	 * The card expiry month in MM format.
	 */
	card_exp_month: string;
	/**
	 * The card expiry year in YYYY format.
	 */
	card_exp_year: string;
	/**
	 * The one-time token is shown on the customer's phone mobile banking.
	 */
	bank_one_time_token?: string;
}

export interface CoreBaseRsp {
	/**
	 * Status code of transaction charge result.
	 */
	status_code: string;
	/**
	 * Status message describing the result of the API request.
	 */
	status_message: string;
}

export interface DirectRefundReq {
	/**
	 * Refund key.
	 */
	refund_key: string;
	/**
	 * Total refund amount.
	 */
	amount: number;
	/**
	 * The reason.
	 */
	reason: string;
}

export interface DirectRefundRsp extends MidtransRspBase {
	/**
	 * Total charge back id.
	 */
	refund_chargeback_id: number;
	/**
	 * Total amount.
	 */
	refund_amount: string;
	/**
	 * Refund key.
	 */
	refund_key: string;
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

export interface CustomerDetails {
	/**
	 * Customer first name
	 */
	first_name: string;
	/**
	 * Customer last name
	 */
	last_name: string;
	/**
	 * Customer last Email
	 */
	email: string;
	/**
	 * Customer last Phone number
	 */
	phone: string;
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
	transaction_ids: (string | never)[];
};
