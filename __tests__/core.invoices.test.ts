import MidtransClient from "../src/index";

describe("Core API (Invoices)", () => {
	let midtransClient: MidtransClient;
	let order_id: string;
	let invoice_id: string;
	let invoice_number: string;

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
		invoice_number = "invoice-" + Date.now();
	});

	it("should be able to create invoice.", async () => {
		const response = await midtransClient.Core.invoice.create({
			order_id,
			invoice_number,
			// 5 days from now.
			due_date: new Date(
				Date.now() + 5 * 24 * 60 * 60 * 1000
			).toISOString(),
			// today
			invoice_date: new Date(Date.now()).toISOString(),
			customer_details: {
				id: "customer_id",
				name: "merchant A",
				email: "merchant@midtrans.com",
				phone: "82313123123",
			},
			payment_type: "payment_link",
			reference: "reference",
			item_details: [
				{
					item_id: "SKU1111",
					description: "midtrans pillow",
					quantity: 1,
					price: 2000,
				},
			],
			notes: "just a notes",
			payment_link: {
				credit_card: {
					bank: null,
					installment: {
						required: false,
						terms: {},
					},
					secure: false,
				},
				enabled_payments: ["credit_card", "bca_va", "echannel"],
				is_custom_expiry: false,
				expiry: {
					duration: 5,
					unit: "day",
				},
			},
		});
		expect(response.id).toBeDefined();
		invoice_id = response.id;
		expect(invoice_id).toBeDefined();
		expect(response.virtual_accounts).toBeDefined();
	});

	it("should be able to get invoice details.", async () => {
		expect(invoice_id).toBeDefined();
		const response = await midtransClient.Core.invoice.get(invoice_id);
		expect(response.id).toBeDefined();
		expect(response.order_id).toBe(order_id);
	});

	it("should be able to void invoice.", async () => {
		expect(invoice_id).toBeDefined();
		const response = await midtransClient.Core.invoice.void(invoice_id);
		expect(response.success).toBe(true);
	});
});
