/**
 * Hash-Chained Audit Trail Integrity Engine
 * SendaTender SIH 2026 (PS-26100 - MoPNG & GeM)
 *
 * Implements deterministic SHA-256 cryptographic chaining across audit events.
 * Preserves audit history authenticity and verifies tamper-resistance.
 */

const crypto = require('crypto');

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Compute SHA-256 hash of an audit event linked to previous hash
 */
function computeEventHash(event, prevHash = GENESIS_HASH) {
  const payload = [
    event.action || '',
    event.user || '',
    event.timestamp || '',
    event.bidderId || '',
    event.tenderId || 'S26-104',
    event.remarks || '',
    prevHash
  ].join('|');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Ensure an audit array has sequential hash chaining computed in chronological order.
 * Note: SendaTender stores newest first (unshifted) in bidder.audit.
 * Chronological order is reverse (oldest first).
 */
function chainAuditEvents(auditList, bidderId = '', tenderId = 'S26-104') {
  if (!Array.isArray(auditList) || auditList.length === 0) {
    return [];
  }

  // Work in chronological order (oldest to newest)
  // If auditList is newest first, reverse copy
  const chronological = [...auditList].reverse();

  let prevHash = GENESIS_HASH;
  for (let i = 0; i < chronological.length; i++) {
    const item = { ...chronological[i] };
    if (!item.bidderId && bidderId) item.bidderId = bidderId;
    if (!item.tenderId) item.tenderId = tenderId;
    
    // Compute deterministic hash
    item.prevHash = prevHash;
    item.hash = computeEventHash(item, prevHash);
    prevHash = item.hash;
    chronological[i] = item;
  }

  // Return in reverse (newest first for UI display)
  return chronological.reverse();
}

/**
 * Verify cryptographic hash integrity of an audit chain.
 * Returns { verified: boolean, totalEvents: number, chainHead: string, brokenAt: number | null }
 */
function verifyAuditChain(auditList) {
  if (!Array.isArray(auditList) || auditList.length === 0) {
    return {
      verified: true,
      totalEvents: 0,
      chainHead: GENESIS_HASH,
      status: 'VERIFIED_EMPTY'
    };
  }

  // Reverse to chronological order (oldest first)
  const chronological = [...auditList].reverse();
  let expectedPrevHash = GENESIS_HASH;

  for (let i = 0; i < chronological.length; i++) {
    const item = chronological[i];
    const computedHash = computeEventHash(item, expectedPrevHash);

    // If item already has a recorded hash, verify it matches
    if (item.hash && item.hash !== computedHash) {
      return {
        verified: false,
        totalEvents: chronological.length,
        brokenAt: i,
        status: 'TAMPER_DETECTED',
        error: `Integrity check failed at block #${i + 1} (${item.action})`
      };
    }

    expectedPrevHash = item.hash || computedHash;
  }

  return {
    verified: true,
    totalEvents: chronological.length,
    chainHead: expectedPrevHash,
    status: 'VERIFIED_SECURE'
  };
}

module.exports = {
  GENESIS_HASH,
  computeEventHash,
  chainAuditEvents,
  verifyAuditChain
};
