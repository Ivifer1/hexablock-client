import { IScoringPolicy, ScoreResult, TurnScoreContext } from '../../src/domain/rules/iscoring-policy';
import { GameStatus } from '../../src/domain/rules/game-status';
import { FakeGameState } from './fake-game-state';

/**
 * FakeScoringPolicy (Test Double)
 */
export class FakeScoringPolicy implements IScoringPolicy<FakeGameState> {
  public calculateTurnScore(context: TurnScoreContext<FakeGameState>): ScoreResult {
    let basePoints = context.afterState.score - context.beforeState.score;
    let multiplier = 1;
    let bonus = 0;

    const hasCombo = context.events.some((e) => e.type === 'COMBO_TRIGGERED');
    if (hasCombo) {
      multiplier = 2;
      bonus = 20;
    }

    const pointsEarned = (basePoints + bonus) * multiplier;
    const newTotalScore = context.beforeState.score + pointsEarned;
    const starsEarned = context.afterState.status === GameStatus.WON ? 3 : 0;

    return Object.freeze({
      pointsEarned,
      newTotalScore,
      multiplier,
      starsEarned,
      breakdown: Object.freeze({
        basePoints,
        bonus,
        multiplier,
      }),
    });
  }
}
