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

---

Help improve this page
