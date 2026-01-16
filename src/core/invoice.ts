import MidtransClient from "../index";
import type {
	BankTransferChannel,
	ExpiryUnit,
	PaymentChannelName,
} from "../resource";
import type {
	PaymentLinkCreateReq,
	PaymentLinkCustomField,
} from "./payment-link";

/**
 * Representing Invoices API
 *
 * Ref: https://docs.midtrans.com/reference/overview-2
 */
export class Invoice {
	protected _client: MidtransClient;
	constructor(_client: MidtransClient) {
		this._client = _client;
	}
	/**
	 * Create Invoice
	 *
	 * Ref: https://docs.midtrans.com/reference/create-invoice
	 */
	create<T = InvoiceReq>(
		body: InvoiceReq
	): Promise<
		InvoiceRsp &
			(T extends { payment_type: "payment_link" }
				? { payment_link_url: string }
				: { virtual_accounts: InvoiceVirtualAccount[] })
	> {
		return this._client._core.post("/v1/invoices", body);
	}
	/**
	 * Get Invoice
	 *
	 * Ref: https://docs.midtrans.com/reference/get-invoice
	 */
	get(
		invoice_id: string
	): Promise<
		InvoiceRsp &
			Partial<Pick<InvoiceRsp, "payment_link_url" | "virtual_accounts">>
	> {
		return this._client._core.get(`/v1/invoices/${invoice_id}`);
	}
	/**
	 * Void Invoice
	 *
	 * **Only invoice with PENDING and OVERDUE that can be voided**
	 *
	 * Ref: https://docs.midtrans.com/reference/void-invoice
	 */
	void(invoice_id: string): Promise<{ success: boolean }> {
		return this._client._core.patch(`/v1/invoices/${invoice_id}/void`);
	}
}

export type InvoicePaymentType = "payment_link" | "virtual_account";
export type InvoiceStatus =
	| "draft"
	| "pending"
	| "expired"
	| "overdue"
	| "paid"
	| "voided";

export type InvoiceBaseReq = {
	/**
	 * Id for the order, must be unique for each invoice
	 *
	 * **NOTE:** only consist of alphanumeric characters [a-z, 0-9], hyphens [-], underscores [_], tilde [~] and dot [.]
	 */
	order_id: string;
	/**
	 * Number of the invoice
	 */
	invoice_number: string;
	/**
	 * Due date of transaction in ISO 8601 format.
	 *
	 * **Default time zone: GMT+7 and has to be after `invoice_date`.**
	 *
	 * **For example: 2025-08-06 20:03:04 +0700**
	 */
	due_date: string;
	/**
	 * Date of Invoice and will be used in email and PDF created in ISO 8601 format.
	 *
	 * **Default time zone: GMT+7 and has to be after `invoice_date`.**
	 * **For example: 2025-08-06 20:03:04 +0700**
	 */
	invoice_date: string;
	/**
	 * Refer to [Customer Details object](https://docs.midtrans.com/reference/json-objects-1#customer-details) section.
	 */
	customer_details: {
		/**
		 * Id of the customer
		 */
		id?: string;
		/**
		 * Name of the customer
		 */
		name: string;
		/**
		 * Email of the customer
		 */
		email?: string;
		/**
		 * Phone number of the customer and not start with “0”
		 */
		phone?: string;
	};
	/**
	 * Reference of the invoice
	 */
	reference?: string;
	/**
	 * Refer to [Item Detail object](https://docs.midtrans.com/reference/json-objects-1#item-detail) section
	 */
	item_details: {
		/**
		 * Id of the item
		 */
		item_id?: string;
		/**
		 * Name or description of the item
		 */
		description: string;
		/**
		 * Number of items (max: 99999999)
		 */
		quantity: number;
		/**
		 * Price of items (max: 99999999)
		 */
		price: number;
	}[];
	/**
	 * Notes of the invoice
	 */
	notes?: string;
	/**
	 * Either `payment_link` or `virtual_account`
	 */
	payment_type: InvoicePaymentType;
	/**
	 * Refer to [Amount object](https://docs.midtrans.com/reference/json-objects-1#amount) section
	 */
	amount?: {
		/**
		 * Tax amount
		 */
		vat: string;
		/**
		 * Discount amount in positive integer
		 */
		discount: string;
		/**
		 * Shipping amount
		 */
		shipping: string;
	};
};

export type Expiry = {
	/**
	 * Expiry unit for payment link.
	 */
	unit: ExpiryUnit;
	/**
	 * Expiry duration for payment link.
	 */
	duration: number | null;
	/**
	 * Expiry start time for payment link.
	 */
	start_time?: string | null;
};

export type InvoicePaymentLinkBase =
	| {
			is_custom_expiry?: boolean;
	  }
	| {
			is_custom_expiry: true;
			/**
			 * Custom expiry for payment link.
			 */
			expiry: Expiry;
	  };
export type InvoicePaymentLink = InvoicePaymentLinkBase & {
	/**
	 * Payment methods that will be used in payment link.
	 *
	 * Ref: https://docs.midtrans.com/reference/json-objects-1#payment-link
	 */
	enabled_payments: (PaymentChannelName | "other_qris" | "bank_transfer")[];
} & PaymentLinkCustomField<{ number: string }>;

export type InvoiceVirtualAccount = {
	/**
	 * Bank provider name for virtual account payment.
	 *
	 * Ref: https://docs.midtrans.com/reference/json-objects-1#virtual-account
	 */
	name: // In case midtrans add more bank transfer channel BankTransferChannel will be updated
		| Extract<
				BankTransferChannel,
				"bca_va" | "bni_va" | "bri_va" | "cimb_va" | "permata_va"
		  >
		| "mandiri_bill";
	/**
	 * Custom va number with different min and max length for each bank provider
	 *
	 * Ref: https://docs.midtrans.com/reference/json-objects-1#virtual-account
	 */
	number?: string;
};

export type InvoiceReq = InvoiceBaseReq &
	(
		| {
				payment_type: Extract<InvoicePaymentType, "payment_link">;
				payment_link: InvoicePaymentLink;
		  }
		| {
				payment_type: Extract<InvoicePaymentType, "virtual_account">;
				virtual_accounts: InvoiceVirtualAccount[];
		  }
	) &
	Pick<PaymentLinkCreateReq, "expiry" | "enabled_payments" | "callbacks">;

export type InvoiceRsp = {
	/**
	 * Id of the invoice
	 */
	id: string;
	/**
	 * Date of invoice is published/created in ISO 8601 format.
	 *
	 * Default time zone: GMT+7.
	 */
	published_date: string;
	/**
	 * Status of the invoice
	 */
	status: InvoiceStatus;
	/**
	 * Total amount of the invoice
	 */
	gross_amount: number;
	/**
	 * `pdf_url` of the invoice
	 */
	pdf_url: string;
	/**
	 * Invoice virtual account and only filled when `payment_type` is `virtual_account`.
	 */
	virtual_accounts: InvoiceVirtualAccount[] | [];
	/**
	 * URL for payment link and only filled when `payment_type` is `payment_link`
	 */
	payment_link_url: string;
} & Omit<InvoiceBaseReq, "amount" | "notes">;
