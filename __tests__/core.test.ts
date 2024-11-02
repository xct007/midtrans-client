import MidtransClient, { MidtransClientOptions } from "../src/index";

describe("Core API", () => {
	const ENV = process.env;
	const clientKey = process.env.MIDTRANS_SANDBOX_CLIENT_KEY;
	const serverKey = process.env.MIDTRANS_SANDBOX_KEY;

	beforeEach(() => {
		jest.resetModules();
		process.env = { ...ENV };
	});

	afterEach(() => {
		process.env = ENV;
	});

	const midtransClient = new MidtransClient({
		sandbox: true,
		clientKey,
		serverKey,
	});

	it("Core.getToken Tokenize", async () => {
		const response = await midtransClient.Core.getToken({
			card_number: "4811111111111114",
			card_cvv: "123",
			card_exp_month: "12",
			card_exp_year: "2025",
			bank_one_time_token: "12345678",
			token_id: "12345678",
		});
		expect(response.status_code).toBe("400");
	});

	it("Core.charge Transaction", async () => {
		const response = await midtransClient.Core.charge({
			payment_type: "bank_transfer",
			transaction_details: {
				order_id: "order-id-123",
				gross_amount: 20000,
			},
			bank_transfer: {
				bank: "permata",
			},
		});
		expect(response.status_code).toBe("201");
		expect(response.payment_type).toBe("permata");
	});

	it("Core.status Check Transaction Status", async () => {
		const response = await midtransClient.Core.status("order-id-123");
		expect(response.status_code).toBe("201");
	});

	it("Core.subscription.create Create Subscription", async () => {
		const response = await midtransClient.Core.subscription.create({
			name: "MONTHLY_2019",
			amount: "14000",
			currency: "IDR",
			payment_type: "credit_card",
			token: "48111111sHfSakAvHvFQFEjTivUV1114",
			schedule: {
				interval: 1,
				interval_unit: "month",
				max_interval: 12,
				start_time: "2020-07-22 07:25:01 +0700",
			},
			retry_schedule: {
				interval: 1,
				interval_unit: "day",
				max_interval: 3,
			},
			metadata: {
				description: "Recurring payment for A",
			},
			customer_details: {
				first_name: "John",
				last_name: "Doe",
				email: "johndoe@email.com",
				phone: "+62812345678",
			},
		});
		expect(response.name).toEqual("MONTHLY_2019");
		expect(response.payment_type).toEqual("credit_card");
		expect(response.status).toEqual("active");
	});
});
