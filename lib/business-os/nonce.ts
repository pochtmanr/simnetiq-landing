export type NonceClaim = "claimed" | "replayed" | "rate_limited";

export interface NonceClaimInput {
  keyId: string;
  nonce: string;
  expiresAtMs: number;
  nowMs: number;
  rateLimit: number;
  windowMs: number;
}

export interface NonceStore {
  claim(input: NonceClaimInput): Promise<NonceClaim>;
}

interface NonceRow {
  expiresAtMs: number;
  createdAtMs: number;
}

/** One synchronous section so two overlapping claims of the same nonce cannot both succeed. */
export class MemoryNonceStore implements NonceStore {
  private readonly rows = new Map<string, NonceRow>();

  async claim(input: NonceClaimInput): Promise<NonceClaim> {
    const key = `${input.keyId}\0${input.nonce}`;
    const existing = this.rows.get(key);
    if (existing && existing.expiresAtMs > input.nowMs) return "replayed";
    this.rows.set(key, { expiresAtMs: input.expiresAtMs, createdAtMs: input.nowMs });
    let recent = 0;
    for (const [id, row] of this.rows) {
      if (row.expiresAtMs <= input.nowMs) {
        this.rows.delete(id);
        continue;
      }
      if (id.startsWith(`${input.keyId}\0`) && input.nowMs - row.createdAtMs <= input.windowMs) recent += 1;
    }
    if (recent > input.rateLimit) return "rate_limited";
    return "claimed";
  }
}
