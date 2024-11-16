import {
	Banks,
	CustomField,
	ExpiryUnit,
	GoPayReq,
	PaymentChannelName,
	ReqBase,
	ShopeePayReq,
} from "../resource";
import { Shared } from "../shared";

export const BASEURL = "https://app.midtrans.com";
export const BASEURL_SANDBOX = "https://app.sandbox.midtrans.com";

/**
 * Representing Snap API
 */
export class Api extends Shared {
	/**
	 * Retrieve your current Snap Preference settings.
	 */
	getPreferences(): Promise<PreferenceRsp> {
		return this._client._snap.get("/snap/v3/merchant-preferences");
	}
	/**
	 * Create new snap transaction.
	 */
	create(body: SnapReq): Promise<SnapRsp> {
		return this._client._snap.post("/snap/v1/transactions", body);
	}
}

export interface SnapReqBase
	extends Omit<ReqBase & CustomField, "custom_expiry" | "payment_type"> {
	credit_card?: Partial<SnapCreditCardReq>;
	enabled_payments?: PaymentChannelName[];
	expiry?: {
		start_time?: string;
		unit: ExpiryUnit;
		duration: number;
	};
}

type SnapReqField = {
	[P in PaymentChannelName]: Partial<
		P extends "permata_va"
			? SnapBank & {
					recipient_name?: string;
				}
			: P extends "uob_ezpay"
				? {
						callback_url?: string;
					}
				: P extends "gopay"
					? GoPayReq["gopay"]
					: P extends "shopeepay"
						? ShopeePayReq["shopeepay"]
						: P extends "gopay"
							? GoPayReq["gopay"]
							: Record<string, unknown>
	>;
};
export type SnapReq = SnapReqBase & Partial<SnapReqField>;

export interface SnapBank {
	va_number: string;
}

export interface SnapCreditCardReq {
	secure: boolean;
	channel: string;
	bank: string;
	installment: {
		required: boolean;
		terms: Partial<Record<Exclude<Banks | "offline", "permata">, number[]>>;
	};
	whitelist_bins: string[];
	dynamic_descriptor: {
		merchant_name?: string;
		city_name?: string;
		country_code?: string;
	};
}

export interface SnapRsp {
	/**
	 * Snap token for opening the [Snap popup](https://docs.midtrans.com/reference/snap-js)
	 */
	token: string;
	/**
	 * URL for [redirection](https://docs.midtrans.com/reference/window-redirection).
	 */
	redirect_url: string;
}

// Ref: https://docs.midtrans.com/reference/snap-checkout-preference-api
export interface PreferenceRsp {
	merchant_id: string;
	/**
	 * The name of the merchant or store that will be displayed on the checkout page
	 */
	display_name: string;
	/**
	 * The URL to which the user will be redirected after successfully completing a payment.
	 */
	finish_payment_return_url: string;
	/**
	 * The URL for redirecting the user in case an error occurs during the payment process
	 */
	error_payment_return_url: string;
	/**
	 * Specifies the language and regional settings for the checkout page
	 */
	locale: string;
	/**
	 * Alternative virtual account processor that the merchant can use for transactions.
	 */
	other_va_processor: string;
	/**
	 * A boolean value that, when true, allows users to retry payments if their initial attempt fails
	 */
	allow_retry: boolean | null;
	/**
	 * Brand information
	 */
	brand: PreferenceBrand;
	/**
	 * Representing a payment method available on the checkout page.
	 */
	payment_channels: PaymentChannel[];
}

export interface PreferenceBrand {
	/**
	 * Specifies the font family to be used on the checkout page.
	 */
	typography: string;
	/**
	 * Hex code of header color of the checkout page
	 */
	header_color: string;
	/**
	 * Hex code of the color of buttons on the checkout page.
	 */
	button_color: string;
	/**
	 * These fields define the border radius (in pixels) for input fields, affecting their rounded corners.
	 */
	input_border_radius: number;
	/**
	 * These fields define the border radius (in pixels) for buttons, affecting their rounded corners.
	 */
	button_border_radius: number;
	/**
	 * When set to false, shows the header on the checkout page.
	 */
	hide_header: boolean;
}

export interface PaymentChannel {
	/**
	 * The identifier for the payment method
	 */
	name: PaymentChannelName;
	/**
	 * Is method enabled.
	 */
	enabled: boolean;
}
