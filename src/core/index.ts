import type {
	ActionRsp,
	CaptureReq,
	ChargeReq,
	ChargeRsp,
	MidtransRspBase,
	RegisterCardReq,
	RegisterCardRsp,
} from "../resource";
import { Shared } from "../shared";
import { Invoice } from "./invoice";
import { PaymentLink } from "./payment-link";
import { Subscription } from "./subscription";

export const BASEURL = "https://api.midtrans.com";
export const BASEURL_SANDBOX = "https://api.sandbox.midtrans.com";

/**
 * Representing Core API
 */
export class Api extends Shared {
	/**
	 * API version
	 *
	 * TODO: Do something with this
	 */
	private readonly _apiVersion = "/v2";

	private _buildUrl(url: string, path = this._apiVersion) {
		return `${path}${url}`;
	}
	/**
	 * Tokenize payment card information before being charged.
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
		return this._client._core.get(
			this._buildUrl(`/${order_id}/status/b2b`),
			{
				page: opts.page.toString(),
				per_page: opts.per_page.toString(),
			}
		);
	}
	/**
	 * Register customer's card information (card number and expiry) to be used for One Click and Two Click transactions.
	 */
	registerCard(opts: RegisterCardReq): Promise<RegisterCardRsp> {
		return this._client._core.get(this._buildUrl("/card/register"), {
			...opts,
			client_key: this._client._core.clientKey,
		} as unknown as Record<string, string>);
	}
	/**
	 * Point Inquiry (Card Payments)
	 *
	 * Get balance information on customer's card points.
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
			this._buildUrl(`/point_inquiry/${token_id}`),
			{
				gross_amount,
			}
		);
	}
	/**
	 * Used to link the customer's account to create payment for certain channel.
	 */
	createGoPayAccount(
		opts: CreateGoPayAccountReq
	): Promise<CreateGoPayAccountRsp> {
		return this._client._core.post(this._buildUrl("/pay/account"), opts);
	}
	/**
	 * Get customer payment account details.
	 *
	 * [Get Pay Account API](https://docs.midtrans.com/reference/get-pay-account)
	 * is called to retrieve GoPay Token, needed for GoPay subscriptions.
	 */
	getGoPayAccount(account_id: string): Promise<GetGoPayAccountRsp> {
		return this._client._core.get(
			this._buildUrl(`/pay/account/${account_id}`)
		);
	}
	/**
	 * Unbind a linked customer account.
	 */
	unbindGoPayAccount(
		account_id: string
	): Promise<Required<GoPayAccountBaseRsp>> {
		return this._client._core.post(
			this._buildUrl(`/pay/account/${account_id}/unbind`)
		);
	}
	/**
	 * Get bin metadata.
	 *
	 * Get BIN API (Card Payment).
	 *
	 * @param {string} bin
	 * @returns {Promise<{ data: Record<string, unknown> }>}
	 */
	getBinMetadata(bin: string): Promise<{
		data: BinMetadataRsp;
	}> {
		return this._client._core.get(`/v1/bins/${bin}`);
	}
	/**
	 * Subscription API Methods
	 *
	 * Ref: https://docs.midtrans.com/reference/api-methods-1
	 */
	subscription: Subscription = new Subscription(this._client);
	/**
	 * Payment Link API Methods
	 *
	 * Ref: https://docs.midtrans.com/reference/overview-12
	 */
	paymentLink: PaymentLink = new PaymentLink(this._client);
	/**
	 * Invoice API Methods
	 *
	 * Ref: https://docs.midtrans.com/reference/overview-2
	 */
	invoice: Invoice = new Invoice(this._client);
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

export interface BinMetadataRsp {
	/**
	 * Indicates whether the card requires registration.
	 * If the value is `true`, the card requires registration.
	 */
	registration_required?: boolean | null;
	/**
	 * Name of the country from which the card is issued.
	 */
	country_name: string;
	/**
	 * The country code.
	 */
	country_code: string;
	/**
	 * The channel.
	 *
	 * e.g. `online_offline`
	 */
	channel: string;
	/**
	 * The card network provider.
	 */
	brand: string;
	/**
	 * The BIN type.
	 */
	bin_type: string;
	/**
	 * The BIN class.
	 */
	bin_class: string;
	/**
	 * The BIN number.
	 */
	bin: string;
	/**
	 * The bank code.
	 */
	bank_code: string;
	/**
	 * The bank name.
	 */
	bank: string;
}

export type GoPayAccountStatus = "PENDING" | "EXPIRED" | "ENABLED" | "DISABLED";

export type GoPayAccountBaseRsp = Omit<CoreBaseRsp, "status_message"> & {
	/**
	 * Payment channel associated with the account.
	 */
	payment_type: "gopay" | string;
	/**
	 * The account ID.
	 */
	account_id: string;
	/**
	 * The status of the account.
	 */
	account_status: GoPayAccountStatus;
	/**
	 * The channel response code.
	 */
	channel_response_code?: string;
	/**
	 * The channel response message.
	 */
	channel_response_message?: string;
};

export type CreateGoPayAccountReq = Pick<
	GoPayAccountBaseRsp,
	"payment_type"
> & {
	payment_type: "gopay";
	/**
	 * GoPay linking specific parameters.
	 */
	gopay_partner: {
		/**
		 * Phone number linked to the customer's account.
		 */
		phone_number: string;
		/**
		 * The country code.
		 */
		country_code: string;
		/**
		 * URL where user is redirected to after finishing the confirmation on Gojek app.
		 */
		redirect_url?: string;
	};
};

export type CreateGoPayAccountRsp = GoPayAccountBaseRsp & {
	actions?: ActionRsp[];
};

export type GetGoPayAccountRsp = GoPayAccountBaseRsp & {
	payment_type: "gopay";
	metadata: {
		name: string;
		active: boolean;
		balance: {
			value: number;
			currency: string;
		};
		metadata: Record<string, unknown>;
		token: string;
	};
};

export type {
	SubsReq,
	SubsPaymentType,
	SubsReqBase,
	SubsReqRetrySchedule,
	SubsReqSchedule,
	SubsRsp,
} from "./subscription";

export type {
	PaymentLinkCreateReq,
	PaymentLinkCreateRsp,
	PaymentLinkCreditCard,
	PaymentLinkCustomField,
	PaymentLinkGetRsp,
} from "./payment-link";

export type {
	InvoiceBaseReq,
	InvoicePaymentLinkBase,
	InvoicePaymentLink,
	InvoicePaymentType,
	InvoiceReq,
	InvoiceRsp,
	InvoiceStatus,
	InvoiceVirtualAccount,
} from "./invoice";
