import test from "node:test";
import assert from "node:assert/strict";

import { verifyDonationTransaction } from "../src/lib/blockfrostConnector.js";

test("verifyDonationTransaction marks a matching ADA output as verified", async () => {
  const originalFetch = global.fetch;

  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      hash: "abc123",
      outputs: [
        {
          address: "addr1wallet",
          amount: [{ unit: "lovelace", quantity: "2000000" }],
        },
      ],
    }),
  });

  try {
    const result = await verifyDonationTransaction({
      txHash: "abc123",
      walletAddress: "addr1wallet",
      amount: "2",
    });

    assert.equal(result.verified, true);
    assert.equal(result.amountLovelace, 2000000);
  } finally {
    global.fetch = originalFetch;
  }
});
