import * as Http from "./client";
import * as Core from "./core";
import * as Errors from "./error";
import * as Iris from "./iris";
import * as Snap from "./snap";

export interface MidtransClientOptions extends Partial<Http.ClientOptions> {
	/**
	 * Sandbox mode. Midtrans sandbox API
	 *
	 * Set to `false` to use production
	 *
	 * default: `true` || `env['MIDTRANS_SANDBOX'] = 'true'`
	 */
	sandbox?: boolean;
	/**
	 * Midtrans Client Key
	 *
	 * By default it using server key for all transaction API
	 *
	 * Get
	 * [Production](https://dashboard.midtrans.com/settings/access-keys)
	 * Or
	 * [Sandbox](https://dashboard.sandbox.midtrans.com/settings/access-keys)
	 * key
	 *
	 * default: `env['MIDTRANS_CLIENT_KEY']` || `env['MIDTRANS_SANDBOX_CLIENT_KEY']`
	 */
	clientKey?: string;
	/**
	 * Midtrans server key
	 *
	 * Get
	 * [Production](https://dashboard.midtrans.com/settings/access-keys)
	 * Or
	 * [Sandbox](https://dashboard.sandbox.midtrans.com/settings/access-keys)
	 * key
	 *
	 * default: `env['MIDTRANS_SERVER_KEY']` || `env['MIDTRANS_SANDBOX_SERVER_KEY']`
	 */
	serverKey?: string;
	/**
	 * Throw `Midtrans` HTTP code 4xx/5xx
	 *
	 * status code is read from `Midtrans JSON` response `status_code`
	 * or `HTTP` status code
	 *
	 * default: `false`
	 */
	throwHttpErrors?: boolean;
	/**
	 * Additional headers to be sent with each request
	 */
	headers?: Http.RequestHeaders;
}

export class MidtransClient extends Http.Client {
	constructor(options: MidtransClientOptions) {
		const {
			sandbox = true,
			clientKey: _clientKey,
			serverKey: _serverKey,
			throwHttpErrors,
			...rest
		} = options;
		const isSandbox = readEnv("MIDTRANS_SANDBOX") === "true" || sandbox;

		const clientKey =
			(isSandbox
				? readEnv("MIDTRANS_SANDBOX_CLIENT_KEY")
				: readEnv("MIDTRANS_CLIENT_KEY")) || _clientKey;

		const serverKey =
			(isSandbox
				? readEnv("MIDTRANS_SANDBOX_SERVER_KEY")
				: readEnv("MIDTRANS_SERVER_KEY")) || _serverKey;

		if (!serverKey || !clientKey) {
			throw new Errors.MidtransError(
				"Midtrans server and client key is required"
			);
		}

		const coreApiBaseUrl = sandbox ? Core.BASEURL_SANDBOX : Core.BASEURL;
		const snapApiBaseUrl = sandbox ? Snap.BASEURL_SANDBOX : Snap.BASEURL;
		const irisApiBaseUrl = sandbox ? Iris.BASEURL_SANDBOX : Iris.BASEURL;

		super({
			coreApiBaseUrl,
			snapApiBaseUrl,
			irisApiBaseUrl,
			serverKey,
			clientKey,
			throwHttpErrors,
			...rest,
		});
	}
	/**
	 * Midtrans Core API
	 *
	 * More information see Core Api [Overview](https://docs.midtrans.com/en/core-api/core-api-overview)
	 */
	readonly Core = new Core.Api(this);
	/**
	 * Midtrans Snap API
	 *
	 * More infromation see Snap [Backend Integration](https://docs.midtrans.com/reference/backend-integration)
	 */
	readonly Snap = new Snap.Api(this);
	/**
	 * Midtrans Payout API
	 *
	 * More information see Payout [Overview](https://docs.midtrans.com/reference/payout-api-overview)
	 */
	readonly Iris = new Iris.Api(this);
}

const readEnv = (key: string): string | undefined => {
	return process.env[key] ?? undefined;
};

export type {
	BankTransferChannel,
	PaymentChannelName,
	CustomerDetails,
	CaptureReq,
	ChargeReq,
	ChargeRsp,
	MidtransRspBase,
	PaymentType,
	RegisterCardReq,
	RegisterCardRsp,
} from "./resource";
export type {
	CoreBaseRsp,
	TokenizeReq,
	DirectRefundReq,
	DirectRefundRsp,
	SubsReq,
	SubsPaymentType,
	SubsReqBase,
	SubsReqRetrySchedule,
	SubsReqSchedule,
	SubsRsp,
	PaymentLinkCreateReq,
	PaymentLinkCreateRsp,
	PaymentLinkCreditCard,
	PaymentLinkCustomField,
	PaymentLinkGetRsp,
	InvoiceBaseReq,
	InvoicePaymentLink,
	InvoicePaymentType,
	InvoiceReq,
	InvoiceRsp,
	InvoiceStatus,
	InvoiceVirtualAccount,
} from "./core";
export type {
	SnapReqBase,
	SnapBank,
	SnapCreditCardReq,
	SnapReq,
	SnapRsp,
} from "./snap";
export type {
	IAggregatorChannel,
	IBeneficiary,
	IFacilitator,
	IPayout,
	IPayoutRsp,
	IValidationBankAccount,
} from "./iris";

export default MidtransClient;
