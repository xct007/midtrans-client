# Snap API

## **Import and initialize**

```js
import MidtransClient from "@xct007/midtrans-client";

const midtransClient = new MidtransClient({
	sandbox: true,
	clientKey: "CLIENT_KEY",
	serverKey: "SERVER_KEY",
});
```

## `Snap.create`

Create transaction.

ref: [Snap Backend Integration](https://docs.midtrans.com/reference/backend-integration)

```js
midtransClient.Snap.create({
	transaction_details: {
		order_id: "order-id",
		gross_amount: 10000,
	},
	credit_card: {
		secure: true,
	},
})
	.then((response) => {
		console.log("Token: ", response.token);
		console.log("Redirect url: ", response.redirect_url);
	})
	.catch((error) => {
		console.error("Charge Error:", error);
	});
```

## `capture`

Get Snap Preferences

ref: [Preference API
](https://docs.midtrans.com/reference/snap-checkout-preference-api)

```js
midtransClient.Snap.getPreferences()
	.then((response) => {
		console.log("Response:", response);
	})
	.catch((error) => {
		console.error("Error:", error);
	});
```

---

###### Help improve this page
