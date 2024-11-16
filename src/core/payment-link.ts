import MidtransClient from "../index";
import {
	BankTransferBase,
	Banks,
	CustomField,
	ExpiryUnit,
	PaymentChannelName,
	ReqBase,
} from "../resource";

/**
 * Representing Payment-link API
 */
export class PaymentLink {
	protected _client: MidtransClient;
	constructor(_client: MidtransClient) {
		this._client = _client;
	}
	/**
	 * Create Payment Link
	 *
	 * Ref: https://docs.midtrans.com/reference/create-payment-link
	 */
	create(
		body: PaymentLinkCreateReq & PaymentLinkCustomField
	): Promise<PaymentLinkCreateRsp> {
		return this._client._core.post("/v1/payment-links", body);
	}
	/**
	 * Get Payment Link
	 *
	 * Ref: https://docs.midtrans.com/reference/get-payment-link-details
	 */
	get(order_id: string): Promise<PaymentLinkGetRsp> {
		return this._client._core.get(`/v1/payment-links/${order_id}`);
	}
	/**
	 * Delete Payment Link
	 *
	 * Ref: https://docs.midtrans.com/reference/delete-payment-link
	 */
	delete(order_id: string): Promise<{ message: string }> {
		return this._client._core.delete(`/v1/payment-links/${order_id}`);
	}
}

export interface PaymentLinkCreditCard {
	secure: boolean;
	bank?: string | null;
	installment: {
		required: boolean;
		terms: Partial<Record<Banks | "offline" | "mandiri", number[]>>;
	};
	type?: "authorize_capture";
	whitelist_bins?: string[];
}

export type PaymentLinkCustomField<T = Omit<BankTransferBase, "bank">> = {
	/**
	 * Credit card payment options.
	 */
	credit_card?: PaymentLinkCreditCard;
} & {
	/**
	 * Customizable Virtual Account number & options.
	 */
	[k in Banks as `${k}_va`]?: k extends "permata"
		? T & {
				recipient_name?: string;
			}
		: k extends "bca_va" | "bca"
			? T & {
					free_text?: {
						inquiry?: { id: string; en: string }[];
						payment?: { id: string; en: string }[];
					};
				}
			: T;
};

export type PaymentLinkCreateReq = Omit<
	ReqBase & CustomField,
	"seller_details" | "custom_expiry" | "payment_type"
> & {
	transaction_details: {
		/**
		 * Custom link ID that will be used to identify the payment link.
		 */
		payment_link_id?: string;
	};
	customer_details?: {
		/**
		 * Notes for customer.
		 */
		notes?: string;

		customer_details_required_fields?: (
			| "first_name"
			| "last_name"
			| "email"
			| "phone"
		)[];
	};
	/**
	 * If set as True, Payment Link will prompt user to fill in customer details (name, phone and email)
	 * before customer can proceed to pay - which field set as mandatory can be specified in customer_details.
	 * If set as false, Payment Link will still show the customer details input form
	 * but it's not mandatory (customer can continue to the next page without filling any)
	 */
	customer_required?: boolean;
	/**
	 * Maximum number of allowed successful/paid transactions.
	 *
	 * Max accepted value is `1000000` (1 million usage).
	 */
	usage_limit?: number;
	/**
	 * Customizable transaction lifetime.
	 *
	 * Once the duration exceeded, the link will no longer be available.
	 */
	expiry?: {
		start_time?: string;
		duration: number;
		unit: ExpiryUnit;
	};
	/**
	 * 	Customizable list of payment methods that will be shown during payment.
	 *
	 * If not specified, by default all active payment methods are shown.
	 */
	enabled_payments?: PaymentChannelName[];
	/**
	 * Title to show in your payment link page that will be seen by your customer.
	 */
	title?: string;
	/**
	 * Pass the value DYNAMIC_AMOUNT if you want to use dynamic amount feature.
	 *
	 * **Note:** that `item_details` and `gross_amount` will be ignored if the type passed is **`DYNAMIC_AMOUNT`**.
	 *
	 * If `payment_link_type` is not passed, by _default_ Payment Link will create a **`FIXED_AMOUNT`** payment link.
	 */
	payment_link_type?: "FIXED_AMOUNT" | "DYNAMIC_AMOUNT";
	/**
	 * **Optional** object if you're creating a payment link with dynamic amount features.
	 *
	 * You can set max/min amount and preset amount within this object.
	 */
	dynamic_amount?: {
		/**
		 * Min amount that customer can input in payment link page.
		 */
		max_amount: number;
		/**
		 * Max amount that customer can input in payment link page.
		 */
		min_amount: number;
		/**
		 * **Prefilled** `amount`
		 *
		 * customer will see this amount upon opening payment link page,
		 * but they can still edit it.
		 */
		preset_amount: number;
	};
	/**
	 * Callback `finish` URL where user will be redirected after finishing a transaction.
	 */
	callbacks?: {
		finish: string;
	};
};

export type PaymentLinkCreateRsp = {
	/**
	 * Order id, can be used to track the payment status.
	 */
	order_id: string;
	/**
	 * Payment link URL.
	 */
	payment_url: string;
};

export type PaymentLinkGetRsp = Required<
	Omit<
		PaymentLinkCreateReq,
		"transaction_details" | "expiry" | "title" | "callbacks"
	>
> & {
	/**
	 * ID of payment link
	 */
	id: number;
	/**
	 * Order ID of payment link or Transactions.
	 *
	 * _Order ID returned under `purchases` refer to transaction's order ID_
	 */
	order_id: string;
	/**
	 * Merchant's Midtrans account ID
	 */
	merchant_id: string;
	/**
	 * Payment link ID, refers to last part of payment link URL.
	 *
	 * E.g. if payment link URL is https://app.midtrans.com/payment-links/abc,
	 * payment link ID refers to `abc`
	 */
	payment_link_id: string;
	/**
	 * Payment link URL.
	 */
	payment_link_url: string;
	/**
	 * Current count of payment link usage (counted by # of successful payment that have been made)
	 */
	usage: number;
	/**
	 * Transaction amount in the payment link.
	 */
	gross_amount: number;
	/**
	 * Credit card 3D secure is enabled or not.
	 */
	credit_card_3d_secure?: boolean;
	/**
	 * List of whitelisted BINs for credit card payment.
	 */
	whitelist_bins?: string[];
	/**
	 * Payment link's expiry start time
	 */
	expiry_start: string;
	/**
	 * Payment link's expiry duration
	 */
	expiry_duration: number;
	/**
	 * Payment link's expiry unit
	 */
	expiry_unit: ExpiryUnit;
	/**
	 * List of transactions made using the specified payment link
	 */
	purchases: {
		/**
		 * Transaction ID
		 */
		id: number;
		/**
		 * Snap token.
		 */
		snap_token: string;
		/**
		 * Order ID
		 */
		order_id: string;
		/**
		 * Payment status
		 */
		payment_status: string;
		/**
		 * Payment method used
		 */
		payment_method: string;
		/**
		 * Created at
		 */
		created_at: string;
		/**
		 * Updated at
		 */
		updated_at: string;
		/**
		 * Payment link ID
		 */
		payment_link_id: number;
	}[];
} & Partial<PaymentLinkExtraRsp & PaymentLinkCustomField>;

// Bellow is response from API based on my observation
// don't know why, some of the field is not documented
// but it's exist in the response
export type PaymentLinkExtraRsp = {
	/**
	 * Locale amount
	 */
	locale_amount: number;
	/**
	 * Locale currency. E.g. `Rp.`
	 */
	currency_sign: string;
	/**
	 * Locale amount with currency sign. E.g. `Rp 0`
	 */
	locale_amount_with_prefix: string;
	/**
	 * List of card installment terms.
	 */
	credit_card_installment_terms: Record<
		Banks | "offline" | "mandiri" | string,
		number[]
	>;
	/**
	 * Transaction expiry date.
	 */
	expires_at: string;
	/**
	 * JSON string of enabled payment methods.
	 */
	enabled_payments_raw: string;
	/**
	 * Credit card type.
	 */
	credit_card_type: string;
	/**
	 * Credit card bank.
	 */
	credit_card_bank: string;
	/**
	 * Credit card installment required.
	 */
	credit_card_installment_required: boolean;
	/**
	 * Priority card feature.
	 */
	priority_card_feature: unknown | null;
	/**
	 * JSON string of credit card installment terms.
	 */
	credit_card_installment_terms_raw: string;
	/**
	 * JSON string of credit card whitelist BINs.
	 */
	whitelist_bins_raw: string | null;
	/**
	 * Customer details required fields.
	 */
	customer_required: boolean;
	/**
	 * Customer details required fields.
	 */
	customer_address_required: boolean;
	/**
	 * Specific customer.
	 */
	specific_customer: boolean;
	/**
	 * Customer details required fields.
	 */
	first_name_required: boolean;
	/**
	 * Customer details required fields.
	 */
	email_required: boolean;
	/**
	 * Customer details required fields.
	 */
	phone_required: boolean;
	/**
	 * Customer details required fields.
	 */
	require_customer_detail_settings: "required" | string;
	/**
	 * API Source.
	 */
	source: "nexus-api" | string;
	/**
	 * API Service.
	 */
	service: "snap" | string;
	/**
	 * Source version.
	 */
	source_version: string;
	/**
	 * Finish callback URL.
	 */
	finish_callback_url: string;
	/**
	 * Unfinish callback URL.
	 */
	unfinish_callback_url: string | null;
	/**
	 * Error callback URL.
	 */
	error_callback_url: string | null;
	/**
	 * Close callback URL.
	 */
	close_callback_url: string | null;
	/**
	 * Transaction created at.
	 */
	created_at: string;
	/**
	 * Transaction created at.
	 */
	createdAt: string;
	/**
	 * Transaction updated at.
	 */
	update_at: string;
	/**
	 * Transaction updated at.
	 */
	updatedAt: string;
	/**
	 * Transaction deleted at.
	 */
	delete_at: string | null;
	/**
	 * Transaction deleted at.
	 */
	deletedAt: string | null;
	/**
	 * Transaction canceled at.
	 */
	canceled_at: string | null;
	/**
	 * Transaction epoch deleted at.
	 */
	epoch_deleted_at: number;
	/**
	 * Any additional payment settings.
	 */
	payment_settings: Record<string, unknown> | null;
};
