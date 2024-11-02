# Unofficial Midtrans Client Library

An unofficial Midtrans Payment API Client Library for Node.js.

[![npm version](https://img.shields.io/npm/v/@xct007/midtrans-client.svg)](https://www.npmjs.com/package/@xct007/midtrans-client)
[![license](https://img.shields.io/npm/l/@xct007/midtrans-client.svg)](https://github.com/xct007/midtrans-client/blob/master/LICENSE)

## Installation

```bash
npm install @xct007/midtrans-client
```

## Usage

### **import the library**

```javascript
// CommonJS
const MidtransClient = require('@xct007/midtrans-client');

// ES Modules
import MidtransClient from '@xct007/midtrans-client';
```

### **Initialize the client**

```javascript
const midtransClient = new MidtransClient({
	sandbox: true, // Set to false for production
	clientKey: "YOUR_CLIENT_KEY",
	serverKey: "YOUR_SERVER_KEY",
	throwHttpErrors: false,
});
```

### **Core API Example**

```javascript
midtransClient.Core.charge({
	payment_type: "bank_transfer",
	transaction_details: {
		order_id: "order-id-123",
		gross_amount: 10000,
	},
	bank_transfer: {
		bank: "bca",
	},
})
	.then((response) => {
		console.log("Charge Response:", response);
	})
	.catch((error) => {
		console.error("Charge Error:", error);
	});
```

### **Snap API Example**

```javascript
midtransClient.Snap.create({
	transaction_details: {
		order_id: "order-id-" + new Date().getTime(),
		gross_amount: 10000,
	},
})
	.then((response) => {
		console.log("Snap Token:", response.token);
		console.log("Redirect URL:", response.redirect_url);
	})
	.catch((error) => {
		console.error("Snap Error:", error);
	});
```

## Documentation

For hands-on examples, please refer to the [examples](docs) directory.

For detailed API documentation, please refer to the [Midtrans API Documentation](https://docs.midtrans.com/reference).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/xct007/midtrans-client).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

-   This library is unofficial and maintained by [xct007](https://github.com/xct007).
-   This library is inspired by the official [Midtrans Node.js Client](https://github.com/midtrans/midtrans-nodejs-client?tab=readme-ov-file#midtrans-client---node-js)
-   Special thanks to [Midtrans](https://midtrans.com) team.
