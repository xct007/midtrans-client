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
});
