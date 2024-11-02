import * as Core from "../src/core";
import MidtransClient, { MidtransClientOptions } from "../src/index";
import * as Snap from "../src/snap";

describe("MidtransClient", () => {
	const mockEnv = (sandbox: boolean, serverKey: string) => {
		process.env.MIDTRANS_SANDBOX = sandbox.toString();

		process.env.MIDTRANS_SANDBOX_KEY = sandbox ? serverKey : "";
		process.env.MIDTRANS_SERVER_KEY = sandbox ? undefined : serverKey;

		process.env.MIDTRANS_SANDBOX_CLIENT_KEY = sandbox
			? undefined
			: serverKey;
		process.env.MIDTRANS_CLIENT_KEY = sandbox ? undefined : serverKey;
	};

	afterEach(() => {
		jest.resetModules();
		delete process.env.MIDTRANS_SANDBOX;
		delete process.env.MIDTRANS_SANDBOX_KEY;
		delete process.env.MIDTRANS_SERVER_KEY;
		delete process.env.MIDTRANS_SANDBOX_CLIENT_KEY;
		delete process.env.MIDTRANS_CLIENT_KEY;
	});

	it("should initialize with sandbox mode", () => {
		mockEnv(true, "sandbox-server-key");

		const options: MidtransClientOptions = { sandbox: true };
		const client = new MidtransClient(options);

		expect(client.Core).toBeInstanceOf(Core.Api);
		expect(client.Snap).toBeInstanceOf(Snap.Api);
	});

	it("should initialize with production mode", () => {
		mockEnv(false, "production-server-key");

		const options: MidtransClientOptions = { sandbox: false };
		const client = new MidtransClient(options);

		expect(client.Core).toBeInstanceOf(Core.Api);
		expect(client.Snap).toBeInstanceOf(Snap.Api);
	});

	it("should throw an error if server key is missing", () => {
		mockEnv(true, "");

		const options: MidtransClientOptions = { sandbox: true };

		expect(() => new MidtransClient(options)).toThrow(
			"Midtrans server and client key is required"
		);
	});
});
