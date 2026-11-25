import {
  buildPlayHexIconSvg,
  buildPointsIconSvg,
  buildSettingsIconSvg,
  buildThemeIconSvg,
} from '../../src/infrastructure/ui-icons/MenuIcons';

describe('Home menu and UI SVG icons', () => {
  it('should_render_outline_menu_icons_when_items_are_not_selected', () => {
    // Arrange
    const options = {
      color: '#636A79',
      cutoutColor: '#FFFFFF',
      size: 24,
      filled: false,
    };

    // Act
    const pointsSvg = buildPointsIconSvg(options);
    const playSvg = buildPlayHexIconSvg(options);
    const settingsSvg = buildSettingsIconSvg(options);

    // Assert
    for (const svg of [pointsSvg, playSvg, settingsSvg]) {
      expect(svg).toContain('fill="none"');
      expect(svg).toContain(`stroke="${options.color}"`);
      expect(svg).not.toContain(`fill="${options.color}"`);
      expect(svg).not.toContain('aria-hidden');
    }
  });

  it('should_render_filled_menu_icons_when_items_are_selected', () => {
    // Arrange
    const options = {
      color: '#0891B2',
      cutoutColor: '#FFFFFF',
      size: 24,
      filled: true,
    };

    // Act
    const pointsSvg = buildPointsIconSvg(options);
    const playSvg = buildPlayHexIconSvg(options);
    const settingsSvg = buildSettingsIconSvg(options);

    // Assert
    for (const svg of [pointsSvg, playSvg, settingsSvg]) {
      expect(svg).toContain(`fill="${options.color}"`);
      expect(svg).toContain(`fill="${options.cutoutColor}"`);
      expect(svg).not.toContain('aria-hidden');
    }
  });

  it('should_render_distinct_sun_and_moon_icons_when_theme_changes', () => {
    // Arrange & Act
    const sunSvg = buildThemeIconSvg(true, '#F59E0B', 20);
    const moonSvg = buildThemeIconSvg(false, '#636A79', 20);

    // Assert
    expect(sunSvg).toContain('<polygon');
    expect(moonSvg).toContain('<path');
    expect(sunSvg).not.toBe(moonSvg);
  });
});
