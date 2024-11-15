import * as Http from "./client";
import * as Core from "./core";
import * as Errors from "./error";
import * as Snap from "./snap";

export interface MidtransClientOptions {
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
}

export class MidtransClient extends Http.Client {
	constructor({
		sandbox = true,
		clientKey: _clientKey,
		serverKey: _serverKey,
		throwHttpErrors,
	}: MidtransClientOptions) {
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

		const coreApiBaseUrl = sandbox
			? Core.COREAPI_BASEURL_SANDBOX
			: Core.COREAPI_BASEURL;
		const snapApiBaseUrl = sandbox
			? Snap.SNAP_BASEURL_SANDBOX
			: Snap.SNAP_BASEURL;

		super({
			coreApiBaseUrl,
			snapApiBaseUrl,
			serverKey,
			clientKey,
			throwHttpErrors,
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
}

const readEnv = (key: string): string | undefined => {
	return process.env[key] ?? undefined;
};

export {
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
export {
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
export {
	SnapReqBase,
	SnapBank,
	SnapCreditCardReq,
	SnapReq,
	SnapRsp,
} from "./snap";

export default MidtransClient;
