import MidtransClient from "../src/index";

describe("Core API (Payment Link API)", () => {
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

	it("should be able to create payment link.", async () => {
		const response = await midtransClient.Core.paymentLink.create({
			transaction_details: {
				order_id,
				gross_amount: 10000,
				payment_link_id: order_id,
			},
			customer_required: true,
			credit_card: {
				secure: true,
				bank: "bca",
				installment: {
					required: false,
					terms: {
						bni: [3, 6, 12],
						mandiri: [3, 6, 12],
						cimb: [3],
						bca: [3, 6, 12],
						offline: [6, 12],
					},
				},
			},
			usage_limit: 1,
			expiry: {
				duration: 5,
				unit: "minutes",
			},
			enabled_payments: ["credit_card", "bca_va", "indomaret"],
			item_details: [
				{
					id: "pil-001",
					name: "Pillow",
					price: 95000,
					quantity: 2,
					brand: "Midtrans",
					category: "Furniture",
					merchant_name: "PT. Midtrans",
				},
			],
			customer_details: {
				first_name: "John",
				last_name: "Doe",
				email: "john.doe@midtrans.com",
				phone: "+62181000000000",
				notes: "Thank you for your purchase. Please follow the instructions to pay.",
				customer_details_required_fields: [
					"first_name",
					"phone",
					"email",
				],
			},
			title: "test title",
			payment_link_type: "DYNAMIC_AMOUNT",
			dynamic_amount: {
				min_amount: 5000,
				max_amount: 5000,
				preset_amount: 5000,
			},
			custom_field1: "custom field 1 content",
			custom_field2: "custom field 2 content",
			custom_field3: "custom field 3 content",
			callbacks: {
				finish: "https://www.google.com?merchant_order_id=test-122",
			},
		});
		expect(response.order_id).toBeDefined();
		expect(response.payment_url).toBeDefined();
	});
	it("should be able to get payment link details.", async () => {
		const response = await midtransClient.Core.paymentLink.get(order_id);
		expect(response.id).toBeDefined();
		expect(response.order_id).toBeDefined();
	});
	it("should be able to delete payment link.", async () => {
		const response = await midtransClient.Core.paymentLink.delete(order_id);
		expect(response.message).toBeDefined();
		expect(response.message).toBe(
			`Payment Link with Order ID ${order_id} deleted`
		);
	});
});
