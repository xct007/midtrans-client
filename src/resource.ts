export type Banks = "permata" | "bca" | "bni" | "bri" | "cimb";
export type EWallet = "qris" | "gopay" | "shopeepay";
export type Otc = "alfamart" | "indomaret";
export type Cardless = "akulaku" | "kredivo";
export type Payments = Banks | EWallet | Otc | Cardless;

export type PaymentType =
	| "bank_transfer"
	| "credit_card"
	| "cstore"
	| EWallet
	| Cardless;

export type BankTransferChannel =
	| "bca_klikpay"
	| "bri_epay"
	| "cimb_clicks"
	| "danamon_online"
	| "bca_va"
	| "permata_va"
	| "other_va"
	| "bni_va"
	| "bri_va"
	| "uob_ezpay"
	| "echannel";

export type PaymentChannelName =
	| "credit_card"
	| BankTransferChannel
	| Otc
	| EWallet
	| Cardless;

export type TransactionStatus =
	| "pending"
	| "capture"
	| "settlement"
	| "deny"
	| "cancel"
	| "expire"
	| "failure"
	| "refund"
	| "chargeback"
	| "partial_refund"
	| "partial_chargeback"
	| "authorize";

export type FraudStatus = "accept" | "deny" | "challenge";

export type ExpiryUnit =
	| "second"
	| "minute"
	| "hour"
	| "day"
	| `${"second" | "minute" | "hour" | "day"}s`;

export interface MidtransRspBase {
	status_code: string;
	status_message: string;
	transaction_id: string;
	order_id: string;
	merchant_id?: string;
	gross_amount: string;
	currency: string;
	payment_type: PaymentType;
	transaction_time: string;
	transaction_status: TransactionStatus;
	fraud_status?: FraudStatus;
	approval_code?: string;
}

interface Action {
	name: string;
	method: "GET" | "POST" | "DELETE";
	url: string;
}

interface EWalletBaseRsp {
	acquirer: "gopay" | string;
}

export interface QrisRsp extends EWalletBaseRsp {
	currency: string;
	fraud_status: FraudStatus;
	actions: Action[];
	expiry_time: string;
}

export interface ShopeePayRsp extends EWalletBaseRsp {
	shopeepay_reference_number: string;
	reference_id: string;
}

export interface OtcIndoMartRsp {
	payment_code: string;
	expiry_time: string;
}
export interface OtcAlfaMartRsp extends OtcIndoMartRsp {
	store: string;
}

export interface CardlessRsp {
	redirect_url: string;
	channel_response_code: string;
	channel_response_message: string;
}

export interface BankBaseRsp {
	va_numbers: { bank: Banks | string; va_number: string }[];
}

export type BankTransferRsp<B extends Banks | undefined = undefined> =
	B extends "mandiri"
		? { bill_key: string; biller_code: string; expiry_time: string }
		: B extends "permata"
			? {
					permata_va_number: string;
					expiry_time: string;
				}
			: BankBaseRsp;

export type ChargeRsp<
	T extends PaymentType,
	B extends Banks | undefined = undefined,
> = MidtransRspBase &
	(T extends "bank_transfer"
		? BankTransferRsp<B>
		: T extends "qris" | "gopay"
			? QrisRsp
			: T extends "shopeepay"
				? ShopeePayRsp
				: T extends "cstore"
					? OtcAlfaMartRsp | OtcIndoMartRsp
					: unknown);

export interface CaptureReq {
	/**
	 * Transaction ID.
	 */
	transaction_id: string;
	/**
	 * Gross Amount.
	 */
	gross_amount: number;
}
export interface RegisterCardReq {
	/**
	 * Credit card number
	 */
	card_number: string;
	/**
	 * Credit card expiry month
	 */
	card_exp_month: string;
	/**
	 * Credit card expiry year
	 */
	card_exp_year: string;
	/**
	 * Function name used for JSONP callback
	 */
	callback?: string;
}
export interface RegisterCardRsp {
	/**
	 * Status code.
	 */
	status_code: string;
	/**
	 * Saved token id.
	 */
	saved_token_id: string;
	/**
	 * Transaction id
	 */
	transaction_id: string;
	/**
	 * Masked Card
	 */
	masked_card: string;
}

export interface ReqBase {
	/**
	 * Payment type.
	 *
	 * More information: [Midtrans Dashboard](https://dashboard.midtrans.com/new_payment_method)
	 */
	payment_type: PaymentType;
	/**
	 * Transaction details.
	 */
	transaction_details: {
		/**
		 * Unique order id
		 */
		order_id: string;
		/**
		 * Charge amount.
		 */
		gross_amount: number;
	};
	/**
	 * Item details.
	 */
	item_details?: ItemDetail[];
	/**
	 * Customer details.
	 */
	customer_details?: CustomerDetail;
	/**
	 * Seller details.
	 */
	seller_details?: SellerDetail;
	/**
	 * Item details.
	 */
	custom_expiry?: {
		/**
		 * Timestamp at which the order is created on your website, in ISO 8601 format.
		 *
		 * Time Zone: GMT+7.
		 *
		 * *Note*: If not defined, expiry time starts from transaction time.
		 */
		order_time?: string;
		/**
		 * Time duration for which the payment remains valid.
		 */
		expiry_duration?: number;
		/**
		 * Unit for `expiry_duration`.
		 */
		unit?: ExpiryUnit;
	};
}

interface AddressBase {
	/**
	 * Customer's first name.
	 */
	first_name?: string;
	/**
	 * Customer's last name.
	 */
	last_name?: string;
	/**
	 * Customer's email address.
	 */
	email?: string;
	/**
	 * Customer's phone number.
	 */
	phone?: string;
}
export interface CustomerDetail extends AddressBase {
	/**
	 * Customer's billing address.
	 */
	billing_address?: Address;
	/**
	 * Customer's shipping address.
	 */
	shipping_address?: Address;
}

export interface SellerDetail {
	/**
	 * Seller's ID.
	 */
	id?: string;
	/**
	 * Seller's name.
	 */
	name?: string;
	/**
	 * Seller's email.
	 */
	email?: string;
	/**
	 * Seller's HTTP URL.
	 */
	url?: string;
	/**
	 * Seller's address.
	 */
	address?: Address;
}

// https://docs.midtrans.com/reference/item-details-object
export interface ItemDetail {
	/**
	 * Item id.
	 */
	id?: string;
	/**
	 * Item price, must valid with gross amount
	 */
	price: number;
	/**
	 * Item quantity
	 */
	quantity: number;
	/**
	 * The item name.
	 */
	name: string;
	/**
	 * Brand name of the item.
	 */
	brand?: string;
	/**
	 * Category of the item.
	 */
	category?: string;
	/**
	 * Name of the merchant selling the item.
	 */
	merchant_name?: string;
	/**
	 * Installment term, use two digits numeric.
	 *
	 * *Note*: This is a BCA KlikPay exclusive field.
	 */
	tenor?: string;
	/**
	 * The item name.
	 *
	 * Installment code, use `000` for default.
	 *
	 * *Note*: This is a BCA KlikPay exclusive field.
	 */
	code_plan?: string;
	/**
	 * Installment Merchant ID.
	 *
	 * *Note*: This is a BCA KlikPay exclusive field.
	 */
	mid?: string;
	/**
	 * HTTP URL of the item in the merchant site
	 */
	url?: string;
}

export interface Address extends AddressBase {
	/**
	 * Postal code of the billing address.
	 *
	 * *Note*: Allowed characters are alphabets, numbers, dash (-), and space ( ).
	 */
	postal_code: string;
	/**
	 * Country ID of the billing address.
	 *
	 * Value: `IDN`. [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3).
	 *
	 * *Note*: Currently only `IDN` is supported.
	 */
	country_code: string;
}

export interface CreditCard {
	/**
	 * Token id represents customer credit card information.
	 */
	token_id: string;
	/**
	 * Name of the acquiring bank.
	 *
	 * Valid values are: mandiri, bni, cimb, bca, maybank, and bri.
	 */
	bank?: Banks;
	/**
	 * Installment tenure in terms of months.
	 */
	installment_term?: number;
	/**
	 * List of credit card's BIN (Bank Identification Number) that is allowed for transaction.
	 */
	bins?: string[];
	/**
	 * Used as preauthorization feature.
	 *
	 * Valid value: authorize.
	 */
	type?: string;
	/**
	 * Used on `One Click` or `Two Clicks` feature.
	 *
	 * Enabling it will return a `saved_token_id`
	 */
	save_token_id?: boolean;
	/**
	 * Used to route transaction to specific channel.
	 */
	channel?: "dragon" | "mti" | "cybersource" | "braintree" | "mpgs";
}

export type CustomField = {
	/**
	 * The label and value of the custom fields can be checked using the Order ID of a transaction.
	 */
	custom_field1?: string;
	/**
	 * The label and value of the custom fields can be checked using the Order ID of a transaction.
	 */
	custom_field2?: string;
	/**
	 * The label and value of the custom fields can be checked using the Order ID of a transaction.
	 */
	custom_field3?: string;
};

export type BankTransferBase = {
	bank: Banks;
	va_number?: string;
};
export type BankTransfer =
	| {
			bank: "bca";
			/**
			 * Bank bca fields
			 */
			free_text?: {
				inquiry?: { id: string; en: string }[];
				payment?: { id: string; en: string }[];
			};
			/**
			 * Bank bca fields
			 */
			bca?: {
				sub_company_code: string;
			};
	  }
	| {
			bank: "permata";
			permata?: {
				recipient_name: string;
			};
	  }
	| BankTransferBase;

export interface BankTransferReq {
	/**
	 * Memek
	 */
	payment_type: "bank_transfer";
	/**
	 * Bank transfer field
	 */
	bank_transfer: BankTransfer;
}

export interface GoPayReq {
	payment_type: "gopay";
	item_details: ItemDetail[];
	customer_details: CustomerDetail;
	/**
	 * Charge details using GoPay.
	 */
	gopay?: {
		/**
		 * Required for GoPay deeplink/QRIS.
		 */
		enable_callback?: boolean;
		/**
		 * The HTTP or Deeplink URL to which the customer is redirected from Gojek app after successful payment.
		 *
		 * Default value: callback_url in dashboard settings.
		 *
		 * For GoPay Tokenization, please make sure callback_url is the same URL submitted on onboarding process.
		 */
		callback_url?: string;
		/**
		 * Required for GoPay Tokenization.
		 * The customer account ID linked during [Create Pay Account API](https://docs.midtrans.com/reference/create-pay-account).
		 */
		account_id?: string;
		/**
		 * Required for GoPay Tokenization.
		 * Token to specify the payment option made by
		 * the customer from [Get Pay Account API](https://docs.midtrans.com/reference/get-pay-account) metadata.
		 */
		payment_option_token?: string;
		/**
		 * Set the value to true to reserve the specified amount from the customer balance.
		 */
		pre_auth?: boolean;
		/**
		 * Set the value to true to mark as a recurring transaction (no PIN challenge will be triggered to the user),
		 * only allowed for authorized merchants.
		 *
		 * Default value: `false`
		 */
		recurring?: boolean;
		/**
		 * Only applicable for GoPay Tokenization. GoPay promotion ID to be used for payment.
		 */
		promotion_ids?: string[];
	};
}
export interface ShopeePayReq {
	payment_type: "shopeepay";
	/**
	 * Charge details using ShopeePay.
	 */
	shopeepay?: {
		/**
		 * The URL to redirect the customer back from the ShopeePay app.
		 */
		callback_url?: string;
	};
}
export interface QrisReq {
	payment_type: "qris";
	/**
	 * Charge details using QRIS.
	 */
	qris?: {
		/**
		 * The acquirer for QRIS.
		 *
		 * Possible values are `airpay shopee`, `gopay`.
		 *
		 * Default value: `gopay`.
		 */
		acquirer?: "gopay" | "airpay shopee";
	};
}
export interface OtcReq {
	payment_type: "cstore";
	cstore: {
		store: Otc;
		message: string;
		alfamart_free_text_1?: string;
		alfamart_free_text_2?: string;
		alfamart_free_text_3?: string;
	};
	item_details: Required<ItemDetail>[];
	customer_details: Required<CustomerDetail>;
}

export interface EchannelReq {
	payment_type: "echannel";
	echannel?: {
		bill_info1?: string;
		bill_info2?: string;
	};
}
export interface AkulakuReq {
	payment_type: "akulaku";
	item_details: Required<ItemDetail>[];
	customer_details: Required<CustomerDetail>;
}
export interface KredivoReq {
	payment_type: "kredivo";
	item_details: Required<ItemDetail>[];
	customer_details: Required<CustomerDetail>;
	seller_details: Required<SellerDetail>;
}

export interface CreditCardReq {
	payment_type: "credit_card";
	credit_card: {
		token_id: string;
		bank?: string;
		installment_term?: number;
		bins?: string[];
		type?: string;
		save_token_id?: boolean;
		authentication?: boolean;
		callback_type: "js_event" | "form";
		channel?: "dragon" | "mti" | "cybersource" | "braintree" | "mpgs";
	};
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

export type ChargeReq = ReqBase &
	(
		| BankTransferReq
		| GoPayReq
		| ShopeePayReq
		| QrisReq
		| OtcReq
		| EchannelReq
		| AkulakuReq
		| KredivoReq
		| CreditCardReq
	) &
	CustomField;

type HTTPMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT" | "OPTIONS";
export type ActionRsp = {
	name: string;
	method: HTTPMethod;
	url: string;
} & {
	method: "GET";
	/**
	 * Parameters which can be sent for the action.
	 *
	 * Only for HTTP methods other than `GET`.
	 */
	fields: string[];
};
