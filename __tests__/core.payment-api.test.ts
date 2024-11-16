import MidtransClient from "../src/index";

describe("Core API (Payment API)", () => {
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
		order_id = "test-transaction-" + Date.now();
	});

	it("should be able to charge.", async () => {
		const response = await midtransClient.Core.charge({
			transaction_details: {
				order_id,
				gross_amount: 10000,
			},
			payment_type: "gopay",
			customer_details: {
				email: "test@example.com",
				first_name: "John",
				last_name: "Doe",
				phone: "+6281234567890",
			},
			item_details: [
				{
					id: "ITEM1",
					price: 10000,
					quantity: 1,
					name: "Some item",
				},
			],
		});
		expect(response.status_code).toBe("201");
		expect(response.actions.length).toBeGreaterThan(0);
	});

	it("should be able to check transaction status.", async () => {
		const response = await midtransClient.Core.status(order_id);
		expect(response.status_code).toBe("201");
		expect(response.transaction_status).toBe("pending");
	});

	it("should be able to cancel transaction.", async () => {
		const response = await midtransClient.Core.cancel(order_id);
		expect(response.transaction_status).toBe("cancel");
	});

	it("should be able to register card.", async () => {
		const response = await midtransClient.Core.registerCard({
			card_number: "4811111111111114",
			card_exp_month: "12",
			card_exp_year: "2025",
		});
		expect(response.status_code).toBe("200");
		expect(response.saved_token_id).toBeDefined();
		expect(response.transaction_id).toBeDefined();
		expect(response.masked_card).toBeDefined();
	});

	it("should be able to create pay account (GoPay).", async () => {
		const response = await midtransClient.Core.createGoPayAccount({
			payment_type: "gopay",
			gopay_partner: {
				phone_number: "81212345678",
				country_code: "62",
			},
		});
		// because we are using sandbox and fake phone number
		// the response will be failed
		expect(response.status_code).toBe("202");
		expect(response.payment_type).toBe("gopay");
	});

	it("should be able to get BIN API (Card Payment).", async () => {
		const bin = "45563300";
		const response = await midtransClient.Core.getBinMetadata(bin);
		expect(response.data).toBeDefined();
		const { data } = response;
		expect(data.registration_required).toBeNull();
		expect(data.country_name).toBeDefined();
		expect(data.country_code).toBeDefined();
		expect(data.channel).toBeDefined();
		expect(data.brand).toBeDefined();
		expect(data.bin_type).toBeDefined();
		expect(data.bin_class).toBeDefined();
		expect(data.bin).toBe(bin);
		expect(data.bank_code).toBeDefined();
		expect(data.bank).toBeDefined();
	});
});
