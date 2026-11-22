/**
 * GameStatus (Value Object / Domain Enum)
 *
 * Represents the lifecycle status of an active or concluded game session.
 */
export enum GameStatus {
  /** The session is active and accepting player moves. */
  PLAYING = 'PLAYING',
  /** The session was won by meeting the level or game victory condition. */
  WON = 'WON',
  /** The session was lost due to lack of valid moves or board exhaustion. */
  LOST = 'LOST',
}
