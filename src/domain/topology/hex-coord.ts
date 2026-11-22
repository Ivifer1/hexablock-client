/**
 * HexCoord (Value Object - DDD)
 *
 * Represents an immutable cell coordinate on a hexagonal grid using axial coordinates (q, r).
 * Derives the cubic coordinate s such that q + r + s = 0.
 *
 * Ubiquitous language:
 * - HexCoord: Cell position in axial coordinates (q, r).
 */
export class HexCoord {
  public static readonly ORIGIN = new HexCoord(0, 0);

  public readonly q: number;
  public readonly r: number;

  constructor(q: number, r: number) {
    if (!Number.isInteger(q) || !Number.isInteger(r)) {
      throw new Error(`HexCoord coordinates must be integers. Received q=${q}, r=${r}`);
    }
    this.q = q;
    this.r = r;
    Object.freeze(this);
  }

  /**
   * Derived cubic coordinate s where q + r + s = 0.
   */
  public get s(): number {
    const val = -this.q - this.r;
    return val === 0 ? 0 : val;
  }

  /**
   * String serialization key ("q,r") for Set and Map lookups in domain collections.
   */
  public get key(): string {
    return `${this.q},${this.r}`;
  }

  /**
   * Structural equality between two hexagonal coordinates.
   */
  public equals(other: HexCoord | null | undefined): boolean {
    if (!other) return false;
    return this.q === other.q && this.r === other.r;
  }

  /**
   * Vector addition returning a new immutable HexCoord.
   */
  public add(other: HexCoord): HexCoord {
    return new HexCoord(this.q + other.q, this.r + other.r);
  }

  /**
   * Vector subtraction returning a new immutable HexCoord.
   */
  public subtract(other: HexCoord): HexCoord {
    return new HexCoord(this.q - other.q, this.r - other.r);
  }

  /**
   * Scalar multiplication returning a new immutable HexCoord.
   */
  public scale(factor: number): HexCoord {
    if (!Number.isInteger(factor)) {
      throw new Error(`HexCoord scale factor must be an integer. Received factor=${factor}`);
    }
    return new HexCoord(this.q * factor, this.r * factor);
  }

  public toString(): string {
    return `HexCoord(${this.q}, ${this.r}, ${this.s})`;
  }
}
