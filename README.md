# Proof of Attestation
 
This is a simple yet powerful Clarinet project that implements an on-chain attestation system on the Stacks blockchain. It provides a foundational building block for solving real-world problems related to trust and verification.

## The Problem It Solves

In many scenarios, from humanitarian aid distribution to academic credentialing, there is a need for a trusted, transparent, and immutable record of a specific claim or status. For example:

*   An NGO needs to prove that a relief package was delivered to a specific recipient.
*   An educational institution wants to issue a verifiable, digital certificate for a completed course.
*   A DAO wants to recognize a member's contribution with a specific on-chain status.

This project creates a simple smart contract where a designated authority can make a public attestation about a user, solving the problem of verification in a decentralized manner.

## How It Works

The core of the project is the `proof-of-attestation.clar` smart contract.

1.  **Authority:** When the contract is deployed, the deployer's address is set as the `authority`.
2.  **Create Attestation:** The `authority` can call the `create-attestation` function to create a record for any user (principal). This record is stored in a map and consists of a `status-code` (a number) that can represent anything you define (e.g., `u101` for "Course Completed", `u202` for "Aid Received").
3.  **Revoke Attestation:** The `authority` can remove an attestation using the `revoke-attestation` function.
4.  **Verify Attestation:** Anyone can call the `get-attestation-status` read-only function to check if a user has an attestation and what its status code is.

## Getting Started

### Prerequisites

*   Clarinet
*   Node.js and npm

### Installation & Setup

1.  **Clone the repository (if applicable)**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Project

1.  **Check contract syntax:**
    ```bash
    clarinet check
    ```

2.  **Run unit tests:**
    ```bash
    npm test
    ```

## Project Structure

*   `contracts/proof-of-attestation.clar`: The main Clarity smart contract.
*   `tests/proof-of-attestation_test.ts`: Vitest unit tests for the smart contract.
*   `Clarinet.toml`: The project configuration file, defining contracts and initial wallet states for testing.
*   `package.json`: Defines project scripts and dependencies.
