# Invoice API

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

### `Core.invoice.create`

**POST** **/v1/invoice**

ref: [Create invoice](https://docs.midtrans.com/reference/create-invoice)

```js
const options = {
 order_id: "test-id-123",
 invoice_number: "invoice-id-123",
 // 5 days from now.
 due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
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
};

Core.invoice.create(options).then((response) => {
 console.log("Invoice id:", response.id);
 console.log("PDF URL:", response.pdf_url);

 console.log("Response:", response);
});
```

### `Core.invoice.get`

**GET** **/v1/invoices/{invoice_id}**

Ref: [Get invoice](https://docs.midtrans.com/reference/get-invoice)

```js
Core.invoice.get(invoiceId).then((response) => {
 console.log("Invoice id:", response.id);
 console.log("PDF URL:", response.pdf_url);
 console.log("status:", response.status);

 console.log("Response:", response);
});
```

### `Core.invoice.void`

**PATCH** **/v1/invoices/{invoice_id}**

Ref: [Void Invoice](https://docs.midtrans.com/reference/void-invoice)

```js
Core.invoice.void(invoiceId).then((response) => {
 console.log("success:", response.success);
 console.log("Response:", response);
});
```

---

Help improve this page
