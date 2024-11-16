import MidtransClient from "../src/index";

describe("IRIS API", () => {
	let iris: MidtransClient["Iris"];

	beforeAll(() => {
		iris = new MidtransClient({
			sandbox: true,
			throwHttpErrors: true,
		}).Iris;
	});

	// My personal Midtrans Account doesn't have permission to test this feature
	// Except for this one
	it("should be able to ping.", async () => {
		const response = await iris.ping();
		expect(response).toBe("pong");
	});
});
