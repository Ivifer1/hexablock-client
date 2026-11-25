import { computeHomeLayoutMetrics } from '../../src/infrastructure/homeLayout';
import { DEFAULT_HOME_MODE_DESCRIPTORS } from '../../src/infrastructure/homeModeDescriptors';
import { HOME_TEXT_CATALOG } from '../../src/infrastructure/i18n/homeTranslations';

describe('Home layout responsiveness and copy stability', () => {
  it('should_keep_game_descriptions_within_similar_lengths_when_checked_in_spanish_and_english', () => {
    // Arrange
    const locales: readonly ('es' | 'en')[] = ['es', 'en'];
    const descriptionKeys = DEFAULT_HOME_MODE_DESCRIPTORS.map(
      (descriptor) => descriptor.descriptionKey,
    );

    // Act & Assert
    for (const locale of locales) {
      const lengths = descriptionKeys.map((key) => {
        const value = HOME_TEXT_CATALOG[key]?.[locale] ?? '';
        expect(value.length).toBeGreaterThan(0);
        return value.length;
      });
      const minLength = Math.min(...lengths);
      const maxLength = Math.max(...lengths);
      expect(maxLength - minLength).toBeLessThanOrEqual(8);
    }
  });

  it('should_fit_wheel_and_orbit_slots_without_horizontal_overflow_when_viewport_varies', () => {
    // Arrange
    const viewports = [
      { width: 320, height: 568 },
      { width: 360, height: 640 },
      { width: 360, height: 800 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1280, height: 800 },
    ];

    // Act & Assert
    for (const { width, height } of viewports) {
      const metrics = computeHomeLayoutMetrics(width, height, 'web', 0);
      const slotWidth = Math.max(metrics.selectedModeIconSize + 18, 78);
      const availableWidth = width - metrics.horizontalPadding * 2;
      expect(0.82 * metrics.wheelSize + slotWidth).toBeLessThanOrEqual(availableWidth);
      expect(metrics.selectorHeight).toBeGreaterThanOrEqual(metrics.wheelSize);
    }
  });

  it('should_reserve_fixed_two_line_description_height_when_layout_metrics_are_computed', () => {
    // Arrange & Act
    const metrics = computeHomeLayoutMetrics(360, 800, 'ios', 0);

    // Assert
    expect(metrics.descriptionHeight).toBe(metrics.descriptionLineHeight * 2);
    expect(metrics.cardHeaderMinHeight).toBeGreaterThanOrEqual(metrics.cardTitleLineHeight);
    expect(metrics.playButtonMinHeight).toBeGreaterThanOrEqual(44);
  });
});
