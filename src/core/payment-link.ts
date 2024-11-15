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
	Omit<PaymentLinkCreateReq, "expiry" | "title">
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
		id: number;
		snap_token: string;
		order_id: string;
		payment_status: string;
		payment_method: string;
		created_at: string;
		updated_at: string;
		payment_link_id: number;
	}[];
};
