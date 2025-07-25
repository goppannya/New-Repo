import { describe, expect, it } from "vitest";
import { simnet } from "@hirosystems/clarinet-sdk";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const userA = accounts.get("user_a")!;
const nonAuthority = accounts.get("authority")!; // Just another user for testing

const contract = "proof-of-attestation";

describe("Proof of Attestation Contract", () => {
  it("ensures the deployer is set as the initial authority", () => {
    const currentAuthority = simnet.callReadOnlyFn(
      contract,
      "get-authority",
      [],
      deployer
    );
    expect(currentAuthority.result).toBePrincipal(deployer);
  });

  it("allows the authority to create an attestation for a user", () => {
    const statusCode = 100; // e.g., "Verified Contributor"

    const createTx = simnet.callPublicFn(
      contract,
      "create-attestation",
      [Cl.principal(userA), Cl.uint(statusCode)],
      deployer
    );

    // The transaction should be successful
    expect(createTx.result).toBeOk(Cl.bool(true));

    // Check that the attestation was stored correctly
    const attestationStatus = simnet.callReadOnlyFn(
      contract,
      "get-attestation-status",
      [Cl.principal(userA)],
      deployer
    );

    // The result should be (ok u100)
    expect(attestationStatus.result).toBeOk(Cl.uint(statusCode));
  });

  it("prevents a non-authority from creating an attestation", () => {
    const statusCode = 200;

    // nonAuthority tries to create an attestation for userA
    const createTx = simnet.callPublicFn(
      contract,
      "create-attestation",
      [Cl.principal(userA), Cl.uint(statusCode)],
      nonAuthority // Caller is not the authority
    );

    // The transaction should fail with err u401 (Not Authorized)
    expect(createTx.result).toBeErr(Cl.uint(401));
  });

  it("allows the authority to revoke an attestation", () => {
    // First, create an attestation to be revoked
    const statusCode = 300;
    simnet.callPublicFn(
      contract,
      "create-attestation",
      [Cl.principal(userA), Cl.uint(statusCode)],
      deployer
    );

    // Now, the authority revokes it
    const revokeTx = simnet.callPublicFn(
      contract,
      "revoke-attestation",
      [Cl.principal(userA)],
      deployer
    );
    expect(revokeTx.result).toBeOk(Cl.bool(true));

    // Verify it's gone (should return (err u404))
    const attestationStatus = simnet.callReadOnlyFn(
      contract,
      "get-attestation-status",
      [Cl.principal(userA)],
      deployer
    );
    expect(attestationStatus.result).toBeErr(Cl.uint(404));
  });
});