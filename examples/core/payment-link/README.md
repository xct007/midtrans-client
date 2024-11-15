# Payment Link API

## **Import and initialize**

```js
import MidtransClient from "@xct007/midtrans-client";

const { Core } = new MidtransClient({
	sandbox: true,
	clientKey: "CLIENT_KEY",
	serverKey: "SERVER_KEY",
	throwHttpErrors: true,
});
```

### `Core.paymentLink.create`

**POST** **/v1/payment-links**

ref: [Create invoice](https://docs.midtrans.com/reference/create-invoice)

```js
const options = {
	transaction_details: {
		order_id: "001",
		gross_amount: 190000,
		payment_link_id: "for-payment-123",
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
		start_time: "2022-04-01 18:00 +0700",
		duration: 20,
		unit: "days",
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
		customer_details_required_fields: ["first_name", "phone", "email"],
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
};

Core.paymentLink.create(options).then((response) => {
	console.log("order id:", response.order_id);
	console.log("Payment url:", response.payment_url);

	console.log("Response:", response);
});
```

### `Core.paymentLink.get`

**GET** **/v1/payment-links/{order_id}**

Ref: [Get Payment Details](https://docs.midtrans.com/reference/get-payment-link-details)

```js
Core.paymentLink.get(order_id).then((response) => {
	console.log("Response:", response);
});
```

### `Core.paymentLink.delete`

**DELETE /v1/payment-links/{order_id}**

Ref: [Delete Payment Link](https://docs.midtrans.com/reference/delete-payment-link)

```js
Core.paymentLink.delete(order_id).then((response) => {
	console.log("message:", response.message);

	console.log("Response:", response);
});
```

---

###### Help improve this page
