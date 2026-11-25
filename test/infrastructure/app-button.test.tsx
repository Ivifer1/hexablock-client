import { Text, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { DARK_THEME, LIGHT_THEME, scaleButtonSize } from '../../src/infrastructure/theme';
import {
  AppButton,
  type AppButtonVariant,
  type AppButtonVariantStrategy,
} from '../../src/infrastructure/ui';

function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>(
      (acc, entry) => ({ ...acc, ...flattenStyle(entry) }),
      {},
    );
  }
  return typeof style === 'object' ? (style as Record<string, unknown>) : {};
}

describe('AppButton standardized UI component', () => {
  it.each(['s', 'm', 'l'] as const)(
    'should_apply_standardized_size_tokens_when_rendering_%s_button',
    async (size) => {
      // Arrange
      const expected = scaleButtonSize(size, 1);

      // Act
      const { getByTestId, getByText } = await render(
        <AppButton
          testID="app-btn"
          label="Action"
          size={size}
          theme={LIGHT_THEME}
          isDark={false}
          onPress={() => undefined}
        />,
      );

      // Assert
      const buttonStyle = flattenStyle(getByTestId('app-btn').props.style);
      const labelStyle = flattenStyle(getByText('Action').props.style);
      expect(buttonStyle.minHeight).toBe(expected.minHeight);
      expect(buttonStyle.paddingHorizontal).toBe(expected.paddingHorizontal);
      expect(labelStyle.fontSize).toBe(expected.fontSize);
      expect(labelStyle.lineHeight).toBe(expected.lineHeight);
    },
  );

  it.each<[AppButtonVariant, boolean, string, string]>([
    ['primary', false, LIGHT_THEME.primary, LIGHT_THEME.primaryFg],
    ['secondary', false, LIGHT_THEME.surfaceSubdued, LIGHT_THEME.textPrimary],
    ['outline', false, LIGHT_THEME.surface, LIGHT_THEME.textPrimary],
    ['ghost', true, 'transparent', DARK_THEME.primaryHover],
    ['danger', true, DARK_THEME.danger, DARK_THEME.primaryFg],
  ])(
    'should_apply_theme_colors_for_%s_variant_when_isDark_is_%s',
    async (variant, isDark, expectedBg, expectedText) => {
      // Arrange
      const theme = isDark ? DARK_THEME : LIGHT_THEME;

      // Act
      const { getByTestId, getByText } = await render(
        <AppButton
          testID="app-btn"
          label="Styled"
          variant={variant}
          theme={theme}
          isDark={isDark}
          onPress={() => undefined}
        />,
      );

      // Assert
      const buttonStyle = flattenStyle(getByTestId('app-btn').props.style);
      const labelStyle = flattenStyle(getByText('Styled').props.style);
      expect(buttonStyle.backgroundColor).toBe(expectedBg);
      expect(labelStyle.color).toBe(expectedText);
    },
  );

  it('should_block_press_and_expose_disabled_accessibility_state_when_disabled_is_true', async () => {
    // Arrange
    const onPress = jest.fn();
    const { getByTestId } = await render(
      <AppButton
        testID="app-btn"
        label="Disabled"
        disabled
        theme={LIGHT_THEME}
        isDark={false}
        onPress={onPress}
      />,
    );

    // Act
    await fireEvent.press(getByTestId('app-btn'));

    // Assert
    expect(onPress).not.toHaveBeenCalled();
    expect(getByTestId('app-btn').props.accessibilityState).toEqual({ disabled: true });
  });

  it('should_support_custom_variant_strategy_without_modifying_app_button_when_new_visual_style_is_supplied', async () => {
    // Arrange: custom Strategy proves OCP for future button styles
    const successStrategy: AppButtonVariantStrategy = (theme) => ({
      backgroundColor: theme.success,
      borderColor: theme.borderStrong,
      borderWidth: 2,
      textColor: theme.primaryFg,
      iconColor: theme.primaryFg,
      fontWeight: '700',
    });

    // Act
    const { getByTestId, getByText } = await render(
      <AppButton
        testID="app-btn"
        label="Confirm"
        variant={successStrategy}
        shape="rounded"
        theme={LIGHT_THEME}
        isDark={false}
        onPress={() => undefined}
      />,
    );

    // Assert
    const buttonStyle = flattenStyle(getByTestId('app-btn').props.style);
    const labelStyle = flattenStyle(getByText('Confirm').props.style);
    expect(buttonStyle.backgroundColor).toBe(LIGHT_THEME.success);
    expect(buttonStyle.borderColor).toBe(LIGHT_THEME.borderStrong);
    expect(buttonStyle.borderWidth).toBe(2);
    expect(labelStyle.color).toBe(LIGHT_THEME.primaryFg);
  });

  it('should_pass_computed_icon_color_and_size_to_left_and_right_icon_slots_and_render_badge', async () => {
    // Arrange
    const expected = scaleButtonSize('l', 1);

    // Act
    const { getByTestId } = await render(
      <AppButton
        testID="app-btn"
        label="Play"
        variant="primary"
        size="l"
        theme={DARK_THEME}
        isDark
        onPress={() => undefined}
        leftIcon={({ color, size }) => (
          <Text testID="left-icon">{`${color}:${size}`}</Text>
        )}
        rightIcon={({ color, size }) => (
          <Text testID="right-icon">{`${color}:${size}`}</Text>
        )}
        badge={<View testID="btn-badge" />}
      />,
    );

    // Assert
    expect(getByTestId('left-icon').props.children).toBe(
      `${DARK_THEME.primaryFg}:${expected.iconSize}`,
    );
    expect(getByTestId('right-icon').props.children).toBe(
      `${DARK_THEME.primaryFg}:${expected.iconSize}`,
    );
    expect(getByTestId('btn-badge')).toBeTruthy();
  });
});
