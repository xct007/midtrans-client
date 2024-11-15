import MidtransClient from "../src/index";

describe("Snap API", () => {
	let midtransClient: MidtransClient;
	let order_id: string;

	beforeAll(() => {
		const serverKey = process.env.MIDTRANS_SANDBOX_SERVER_KEY;
		const clientKey = process.env.MIDTRANS_SANDBOX_CLIENT_KEY;

		midtransClient = new MidtransClient({
			sandbox: true,
			clientKey,
			serverKey,
			throwHttpErrors: true,
		});
	});

	beforeEach(() => {
		order_id = "test-transaction-" + Date.now();
	});

	it("should be able to get Snap Preferences.", async () => {
		const response = await midtransClient.Snap.getPreferences();
		expect(response.brand).toBeDefined();
		expect(response.display_name).toBeDefined();
	});

	it("should be able to create Snap transaction.", async () => {
		const response = await midtransClient.Snap.create({
			transaction_details: {
				order_id,
				gross_amount: 10000,
			},
		});
		expect(response.token).toBeDefined();
		expect(response.redirect_url).toBeDefined();
	});
});
