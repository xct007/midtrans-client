# Snap API

## **Import and initialize**

```js
import MidtransClient from "@xct007/midtrans-client";

const { Iris } = new MidtransClient({
 sandbox: true,
 clientKey: "CLIENT_KEY",
 serverKey: "SERVER_KEY",
 throwHttpErrors: true,
});
```

## `Iris.ping`

Ping the Iris API to check if it's up and running.

ref: [Ping](https://docs.midtrans.com/reference/ping)

```js
Iris.ping()
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

## `Iris.accountValidation`

Check if an account is valid, if valid return account information.

ref: [Validate Bank Account](https://docs.midtrans.com/reference/validate-bank-account)

```js
Iris.accountValidation({
 bank: "danamon".
 account: "1234567890",
})
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

## `Iris.supportedBanks`

Show list of supported banks in Payouts

Ref: [List of Supported Banks](https://docs.midtrans.com/reference/list-of-banks)

```js
Iris.supportedBanks()
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

## `Iris.payout`

`payout` object contains methods to perform payouts.

```js
const { payout } = Iris;
```

### `payout.create`

Ref: [Create Payout](https://docs.midtrans.com/reference/create-payout)

```js
payout
 .create({
  payouts: [
    {
      beneficiary_name: "Jon Snow",
      beneficiary_account: "1172993826",
      beneficiary_bank: "bni",
      beneficiary_email: "beneficiary@example.com",
      amount: "100000.00",
      notes: "Payout April 17"
    },
  ]
})
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });

```

### `payout.approve`

Ref: [Approve Payout](https://docs.midtrans.com/reference/accept-payout)

```js
payout
 .approve({
  reference_nos: ["1234567890"],
  otp: "123456",
})
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

### `payout.reject`

Ref: [Reject Payout](https://docs.midtrans.com/reference/reject-payout)

```js
payout
 .reject({
  reference_nos: ["1234567890"],
  reject_reason: "Rejecting reason",
})
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

### `payout.get`

Ref: [Get Payout Details](https://docs.midtrans.com/reference/get-payout-details)

```js
payout
 .get("1234567890")
 .then((response) => {
  console.log("Response: ", response);
})
 .catch((error) => {
  console.error("Error:", error);
});
```

## `Iris.beneficiary`

`beneficiary` object contains methods to manage beneficiaries.

```js
const { beneficiary } = Iris;
```

### `beneficiary.create`

Ref: [Create Beneficiary](https://docs.midtrans.com/reference/create-beneficiaries)

```js
beneficiary
 .create({
  name: "John Doe",
  account: "33452784",
  bank: "bca",
  alias_name: "johnbca",
  email: "beneficiary@example.com"
})
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

### `beneficiary.update`

Ref: [Update Beneficiary](https://docs.midtrans.com/reference/update-beneficiaries)

```js
beneficiary
 .update({
  id: "1234567890",
  name: "John Doe",
  account: "33452784",
  bank: "bca",
  alias_name: "johnbca",
  email: "beneficiary@example.com"
})
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

### `beneficiary.lists`

Ref: [List of Beneficiaries](https://docs.midtrans.com/reference/list-of-beneficiaries)

```js
beneficiary
 .lists()
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

## `Iris.facilitator`

`facilitator` object contains methods to manage facilitators.

```js
const { facilitator } = Iris;
```

### `facilitator.balance`

Ref: [Check Balance (Facilitator)](https://docs.midtrans.com/reference/check-balance-facilitator)

```js
const bank_account_id = "1234567890";

facilitator
 .balance(bank_account_id)
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

### `facilitator.lists`

Ref: [Bank Account (Facilitator)](https://docs.midtrans.com/reference/bank-account-facilitator)

```js
facilitator
 .lists()
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

## `Iris.aggregator`

`aggregator` object contains methods to manage aggregators.

```js
const { aggregator } = Iris;
```

### `aggregator.balance`

Ref: [Check Balance](https://docs.midtrans.com/reference/check-balance-agregator)

```js
aggregator
 .balance()
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

### `aggregator.channels`

Ref: [Top Up Channel Information for Aggregator](https://docs.midtrans.com/reference/top-up-channel-information-for-aggregator)

```js
aggregator
 .channels()
 .then((response) => {
  console.log("Response: ", response);
 })
 .catch((error) => {
  console.error("Error:", error);
 });
```

---

Help improve this page
