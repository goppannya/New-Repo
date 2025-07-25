;; proof-of-attestation.clar
;; A simple contract for on-chain attestations.

;; ---
;; This contract allows a designated authority to make a public, on-chain
;; attestation about a specific user (principal). This can be used to verify
;; credentials, status, or completion of a task in a decentralized way.
;; For example, an NGO could attest that a recipient has received aid,
;; or an educational institution could attest that a student has passed a course.
;; ---

;; --- Data Storage ---

;; The principal of the authority who can create attestations.
;; By default, it's the address that deploys the contract.
(define-data-var authority principal tx-sender)

;; A map to store attestations.
;; Key: The principal of the user being attested.
;; Value: A uint representing the type or status of the attestation.
(define-map attestations principal uint)

;; --- Constants ---

(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-ATTESTATION-NOT-FOUND (err u404))

;; --- Public Functions ---

;; @desc Creates or updates an attestation for a user.
;; @param user: The principal of the user to attest for.
;; @param status-code: A uint representing the status or credential.
;; @returns (ok bool)
;; @emits only the designated authority can call this.
(define-public (create-attestation (user principal) (status-code uint))
  (begin
    (asserts! (is-eq tx-sender (var-get authority)) ERR-NOT-AUTHORIZED)
    (ok (map-set attestations user status-code))))

;; @desc Revokes an attestation for a user.
;; @param user: The principal of the user whose attestation to revoke.
;; @returns (ok bool)
;; @emits only the designated authority can call this.
(define-public (revoke-attestation (user principal))
  (begin
    (asserts! (is-eq tx-sender (var-get authority)) ERR-NOT-AUTHORIZED)
    (ok (map-delete attestations user))))

;; --- Read-Only Functions ---

;; @desc Gets the attestation status for a given user.
;; @param user: The principal of the user to check.
;; @returns (ok uint) if attestation exists, or (err u404) if not found.
(define-read-only (get-attestation-status (user principal))
  (ok (unwrap! (map-get? attestations user) ERR-ATTESTATION-NOT-FOUND)))

;; @desc Gets the current authority principal.
;; @returns principal
(define-read-only (get-authority)
  (var-get authority))