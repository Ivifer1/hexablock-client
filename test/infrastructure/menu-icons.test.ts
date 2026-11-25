import {
  buildChevronIconSvg,
  buildPlayHexIconSvg,
  buildPointsIconSvg,
  buildSessionIconSvg,
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

  it('should_render_distinct_session_icons_when_authentication_state_changes', () => {
    // Arrange & Act
    const guestSvg = buildSessionIconSvg(false, '#FFFFFF', 20);
    const signedInSvg = buildSessionIconSvg(true, '#FFFFFF', 20);

    // Assert
    expect(guestSvg).toContain('stroke="#FFFFFF"');
    expect(signedInSvg).toContain('fill="#FFFFFF"');
    expect(signedInSvg).toContain('<polygon');
    expect(guestSvg).not.toContain('aria-hidden');
    expect(signedInSvg).not.toContain('aria-hidden');
    expect(guestSvg).not.toBe(signedInSvg);
  });

  it('should_render_distinct_left_and_right_chevron_icons_without_aria_hidden', () => {
    // Arrange & Act
    const leftSvg = buildChevronIconSvg('left', '#F3F5F9', 18);
    const rightSvg = buildChevronIconSvg('right', '#F3F5F9', 18);

    // Assert
    expect(leftSvg).toContain('stroke="#F3F5F9"');
    expect(rightSvg).toContain('stroke="#F3F5F9"');
    expect(leftSvg).toContain('width="18"');
    expect(leftSvg).not.toContain('aria-hidden');
    expect(rightSvg).not.toContain('aria-hidden');
    expect(leftSvg).not.toBe(rightSvg);
  });
});
