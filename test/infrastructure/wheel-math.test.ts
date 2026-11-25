import {
  canonicalWheelDeg,
  computeShortestWheelTargetDeg,
  indexAtTopForRotationDeg,
  modeBaseAngleRad,
  wrapAngleDeltaRad,
} from '../../src/infrastructure/wheelMath';

describe('HexModeSelector wheel math', () => {
  it('should_place_first_mode_at_zero_degrees_when_initialized', () => {
    // Arrange & Act
    const rotation = canonicalWheelDeg(0, 4);

    // Assert
    expect(rotation).toBe(0);
    expect(modeBaseAngleRad(0, 4)).toBeCloseTo(-Math.PI / 2, 6);
  });

  it('should_rotate_counterclockwise_by_90_degrees_when_selecting_right_mode_in_four_mode_wheel', () => {
    // Arrange
    const currentDeg = 0;

    // Act
    const targetDeg = computeShortestWheelTargetDeg(currentDeg, 1, 4);

    // Assert
    expect(targetDeg).toBe(-90);
  });

  it('should_rotate_clockwise_by_90_degrees_when_selecting_left_mode_in_four_mode_wheel', () => {
    // Arrange
    const currentDeg = 0;

    // Act
    const targetDeg = computeShortestWheelTargetDeg(currentDeg, 3, 4);

    // Assert
    expect(targetDeg).toBe(90);
  });

  it('should_continue_across_360_boundary_without_rewinding_when_wrapping_from_last_to_first_mode', () => {
    // Arrange
    const currentDeg = -270;

    // Act
    const targetDeg = computeShortestWheelTargetDeg(currentDeg, 0, 4);

    // Assert
    expect(targetDeg).toBe(-360);
  });

  it('should_compute_72_degree_steps_when_fifth_mode_is_registered', () => {
    // Arrange & Act
    const stepOne = computeShortestWheelTargetDeg(0, 1, 5);
    const stepFour = computeShortestWheelTargetDeg(0, 4, 5);

    // Assert
    expect(stepOne).toBe(-72);
    expect(stepFour).toBe(72);
  });

  it('should_resolve_nearest_mode_index_at_top_when_wheel_rotates_clockwise_or_counterclockwise', () => {
    // Arrange & Act & Assert
    expect(indexAtTopForRotationDeg(0, 4)).toBe(0);
    expect(indexAtTopForRotationDeg(-88, 4)).toBe(1);
    expect(indexAtTopForRotationDeg(-182, 4)).toBe(2);
    expect(indexAtTopForRotationDeg(92, 4)).toBe(3);
    expect(indexAtTopForRotationDeg(-360, 4)).toBe(0);
  });

  it('should_wrap_pointer_angle_delta_across_pi_boundary_when_dragging_past_left_axis', () => {
    // Arrange
    const prevAngle = Math.PI - 0.1;
    const nextAngle = -Math.PI + 0.1;

    // Act
    const delta = wrapAngleDeltaRad(nextAngle - prevAngle);

    // Assert
    expect(delta).toBeCloseTo(0.2, 6);
  });
});
