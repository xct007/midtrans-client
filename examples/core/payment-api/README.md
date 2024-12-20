# Payment API

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

## `charge`

Reference [Charge Transactions](https://docs.midtrans.com/reference/charge-transactions-1)

```js
Core.charge({
 payment_type: "bank_transfer",
 transaction_details: {
  order_id: "test-order-id",
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

## `capture`

Reference [Capture Transaction](https://docs.midtrans.com/reference/capture-transaction)

```js
Core.capture({
 transaction_id: "trx-id",
 gross_amount: 145000,
})
 .then((response) => {
  console.log("Response:", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

## `cancel`

Reference [Cancel Transaction](https://docs.midtrans.com/reference/cancel-transaction)

```js
Core.cancel("trx-id")
 .then((response) => {
  console.log("Response:", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

## `status`

Reference [Get Transaction Status](https://docs.midtrans.com/reference/get-transaction-status)

```js
Core.status("trx-id")
 .then((response) => {
  console.log("Response:", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

## All [`Payment API`](https://docs.midtrans.com/reference/overview-17) Method

---

### `Core.charge`

**POST** **/v2/charge**

> Perform a transaction with various available payment methods and features.

**[Reference](https://docs.midtrans.com/reference/charge-transactions-1)**

---

### `Core.capture`

**POST** **/v2/capture**

> Capture transaction is triggered to capture the transaction balance when `transaction_status`:`authorize`. This is only available after [Pre-Authorized Credit Card](https://docs.midtrans.com/reference/card-feature-pre-authorization) or [Pre-Authorized GoPay](https://docs.midtrans.com/reference/gopay-tokenization#gopay-tokenization-features-pre-auth).

**[Reference](https://docs.midtrans.com/reference/capture-transaction)**

---

### `Core.approve`

**POST** **/v2/{order_id}/approve**

> Approve transaction is triggered to `accept` the card payment transaction with `fraud_status`:`challenge`.

**[Reference](https://docs.midtrans.com/reference/approve-transaction)**

---

### `Core.deny`

**POST** **/v2/{order_id}/deny**

> Deny a transaction with a specific order_id, flagged as challenge by Fraud Detection System.

**[Reference](https://docs.midtrans.com/reference/deny-transaction)**

---

### `Core.cancel`

**POST** **/v2/{order_id}/cancel**

> Cancel transaction is triggered to void the transaction. If transaction is already settled (status : `settlement`) you should perform refund instead if the payment method supports it.

**[Reference](https://docs.midtrans.com/reference/cancel-transaction)**

---

### `Core.expire`

**POST** **/v2/{order_id}/expire**

> Expire transaction is triggered to update the `transaction_status` to expire, when the customer fails to complete the payment. The expired `order_id` can be reused for the same or different payment methods.

**[Reference](https://docs.midtrans.com/reference/expire-transaction)**

---

### `Core.refund`

**POST** **/v2/{order_id}/refund**

> Refund transaction is called to reverse the money back to customers for transactions with payment status Settlement.
> If transaction's status is still `Pending` `Authorize` or `Capture` please use Cancel API instead.

**[Reference](https://docs.midtrans.com/reference/refund-transaction)**

---

### `Core.directRefund`

**POST** **/v2/{order_id}/refund/online/direct**

> Direct Refund transaction is triggered to send the refund request directly to the bank or to the third-party payment provider for transaction with payment status Settlement.
> If payment status is still in either Capture, Pending or Authorize, use the Cancel API instead.

**[Reference](https://docs.midtrans.com/reference/direct-refund-transaction)**

---

### `Core.status`

**GET** **/v2/{order_id}/status**

> Get Transaction Status is triggered to obtain the transaction_status and other details of a specific transaction.

**[Reference](https://docs.midtrans.com/reference/get-transaction-status)**

---

### `Core.statusB2B`

**GET** **/v2/{order_id}/status/b2b**

> Get Transaction Status B2B is triggered to obtain the transaction status for all B2B transactions related to an `order_id`.

**[Reference](https://docs.midtrans.com/reference/get-transaction-status-b2b)**

---

### `Core.registerCard`

**GET** **/v2/card/register**

> Register Card can be triggered to register the card information of the customer for future one click and two click transactions.

**[Reference](https://docs.midtrans.com/reference/register-card)**

---

### `Core.createGoPayAccount`

**POST** **/v2/pay/account**

> Create Pay Account is triggered to link the customer's account to be used for payments using specific payment channel.

**[Reference](https://docs.midtrans.com/reference/create-pay-account)**

---

### `Core.getGoPayAccount`

**GET** **/v2/pay/account/{account_id}**

> Get Pay Account is triggered to get GoPay's account linked status. This method is only applicable for GoPay Tokenizations.

**[Reference](https://docs.midtrans.com/reference/get-pay-account)**

---

### `Core.unbindGoPayAccount`

**POST** **/v2/pay/account/{account_id}/unbind**

> Unbind Pay Account is triggered to remove the linked customer account.

**[Reference](https://docs.midtrans.com/reference/unbind-pay-account)**

---

### `Core.pointInquiry`

**GET** **/v2/point_inquiry/{token_id}**

> Point Inquiry is triggered to obtain the balance amount on the card.

**[Reference](https://docs.midtrans.com/reference/point-inquiry)**

---

### `Core.getBinMetadata`

**GET** **/v1/bins/{bin_number}**

> BIN API is called to get metadata for a particular BIN, such as card type (Credit or Debit), the card network provider (Visa, MasterCard), and so on.

**[Reference](https://docs.midtrans.com/reference/bin-api)**

## Subscription API

Ref: [Api Method](https://docs.midtrans.com/reference/api-methods-1)

### `create` Subscription

Reference [Create Subscription Request](https://docs.midtrans.com/reference/create-subscription)

```js
const options = {
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
};

Core.subscription
 .create(options)
 .then((response) => {
  console.log(response);
 })
 .catch((error) => {
  console.error(error);
 });
```

### `Core.subscription` methods

More information [here](https://docs.midtrans.com/reference/api-methods-1)

### `Core.subscription.create`

**POST** **/v1/subscriptions**

> Create a subscription or recurring transaction by sending all the details required to create a transaction.

**[Reference](https://docs.midtrans.com/reference/create-subscription)**

---

### `Core.subscription.get`

**GET** **/v1/subscriptions/{subscription_id}**

> Retrieve the subscription details of a customer using the `subscription_id`.

**[Reference](https://docs.midtrans.com/reference/get-subscription)**

---

### `Core.subscription.disable`

**POST** **/v1/subscriptions/{subscription_id}/disable**

> Disable a customer's subscription account with a specific `subscription_id` so that the customer is not charged for the subscription in the future.

**[Reference](https://docs.midtrans.com/reference/disable-subscription)**

---

### `Core.subscription.cancel`

**POST** **/v1/subscriptions/{subscription_id}/cancel**

> Cancel a customer's subscription account with a specific `subscription_id` so that the customer is not charged for the subscription in the future.

**[Reference](https://docs.midtrans.com/reference/cancel-subscription)**

---

### `Core.subscription.enable`

**POST** **/v1/subscriptions/{subscription_id}/enable**

> Activate a customer's subscription account with a specific `subscription_id`, so that the customer can start paying for the subscription immediately.

**[Reference](https://docs.midtrans.com/reference/enable-subscription)**

---

### `Core.subscription.update`

**PATCH** **/v1/subscriptions/{subscription_id}**

> Update the details of a customer's existing subscription account with the specific `subscription_id`. Successful request returns `status_message` indicating that the subscription details are updated.

**[Reference](https://docs.midtrans.com/reference/update-subscription)**

---

Help improve this page
