import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { StaticTextCatalog } from '../../src/adapters/i18n';
import type { HomeProgressDTO } from '../../src/application/value-objects';
import {
  formatHomeProgress,
  type HomeProgressFormatterMap,
} from '../../src/infrastructure/home/progressFormatters';
import { LIGHT_THEME } from '../../src/infrastructure/theme';
import { BottomNavBar, type BottomNavItem } from '../../src/infrastructure/ui';

describe('Home extensibility (progress formatters and BottomNavBar)', () => {
  it('should_format_custom_progress_dto_without_modifying_home_mode_card_when_custom_kind_is_used', () => {
    // Arrange
    const catalog = new StaticTextCatalog(
      {
        'common.goals_progress': {
          es: 'Metas: {done} de {total}',
          en: 'Goals: {done} of {total}',
        },
      },
      'es',
    );
    const progress: HomeProgressDTO = {
      kind: 'CUSTOM',
      label: { key: 'common.goals_progress', parameters: { done: 2, total: 5 } },
    };

    // Act
    const spanish = formatHomeProgress(progress, catalog, 'es');
    const english = formatHomeProgress(progress, catalog, 'en');

    // Assert
    expect(spanish).toBe('Metas: 2 de 5');
    expect(english).toBe('Goals: 2 of 5');
  });

  it('should_allow_overriding_progress_formatter_strategy_when_custom_formatter_map_is_injected', () => {
    // Arrange
    const catalog = new StaticTextCatalog({}, 'es');
    const customFormatters: HomeProgressFormatterMap = {
      BEST: (progress) =>
        progress.kind === 'BEST' ? `TOP ${progress.value}` : null,
    };

    // Act
    const formatted = formatHomeProgress(
      { kind: 'BEST', value: 990 },
      catalog,
      'es',
      customFormatters,
    );

    // Assert
    expect(formatted).toBe('TOP 990');
  });

  it('should_render_arbitrary_number_of_nav_items_and_mark_selected_and_disabled_states', async () => {
    // Arrange
    const pressed: string[] = [];
    const items: readonly BottomNavItem[] = [
      {
        key: 'POINTS',
        label: 'Puntos',
        onPress: () => pressed.push('POINTS'),
        renderIcon: ({ selected }) => (
          <View testID={`icon-POINTS-${selected ? 'filled' : 'outline'}`} />
        ),
      },
      {
        key: 'PLAY',
        label: 'Jugar',
        onPress: () => pressed.push('PLAY'),
        renderIcon: ({ selected }) => (
          <View testID={`icon-PLAY-${selected ? 'filled' : 'outline'}`} />
        ),
      },
      {
        key: 'EVENTS',
        label: 'Eventos',
        disabled: true,
        onPress: () => pressed.push('EVENTS'),
        renderIcon: ({ selected }) => (
          <View testID={`icon-EVENTS-${selected ? 'filled' : 'outline'}`} />
        ),
      },
      {
        key: 'SETTINGS',
        label: 'Ajustes',
        onPress: () => pressed.push('SETTINGS'),
        renderIcon: ({ selected }) => (
          <View testID={`icon-SETTINGS-${selected ? 'filled' : 'outline'}`} />
        ),
      },
    ];

    // Act
    const { getByLabelText, getByTestId } = await render(
      <BottomNavBar
        items={items}
        selectedKey="PLAY"
        height={68}
        bottomSafeInset={16}
        iconSize={24}
        theme={LIGHT_THEME}
      />,
    );

    await fireEvent.press(getByLabelText('Puntos'));
    await fireEvent.press(getByLabelText('Eventos'));

    // Assert
    expect(getByTestId('icon-PLAY-filled')).toBeTruthy();
    expect(getByTestId('icon-POINTS-outline')).toBeTruthy();
    expect(getByTestId('icon-EVENTS-outline')).toBeTruthy();
    expect(getByTestId('icon-SETTINGS-outline')).toBeTruthy();
    expect(getByLabelText('Jugar').props.accessibilityState).toEqual({
      selected: true,
      disabled: false,
    });
    expect(getByLabelText('Eventos').props.accessibilityState).toEqual({
      selected: false,
      disabled: true,
    });
    expect(pressed).toEqual(['POINTS', 'EVENTS']);
  });
});
