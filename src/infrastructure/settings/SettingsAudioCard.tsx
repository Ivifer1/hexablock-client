import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BORDER_WIDTH, RADIUS, SPACING, type Theme } from '../theme';
import { MusicNoteIcon, SoundEffectsIcon } from '../ui-icons/SettingsIcons';
import { SettingsToggleRow } from './SettingsToggleRow';

export interface SettingsAudioCardProps {
  readonly musicLabel: string;
  readonly sfxLabel: string;
  readonly musicEnabled: boolean;
  readonly sfxEnabled: boolean;
  readonly theme: Theme;
  readonly isDark: boolean;
  readonly onToggleMusic: (enabled: boolean) => void;
  readonly onToggleSfx: (enabled: boolean) => void;
}

export function SettingsAudioCard({
  musicLabel,
  sfxLabel,
  musicEnabled,
  sfxEnabled,
  theme,
  isDark,
  onToggleMusic,
  onToggleSfx,
}: SettingsAudioCardProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <SettingsToggleRow
        testID="settings-music-switch"
        label={musicLabel}
        value={musicEnabled}
        icon={<MusicNoteIcon color={theme.primary} size={22} />}
        theme={theme}
        isDark={isDark}
        onToggle={onToggleMusic}
      />
      <View style={styles.divider} />
      <SettingsToggleRow
        testID="settings-sfx-switch"
        label={sfxLabel}
        value={sfxEnabled}
        icon={<SoundEffectsIcon color={theme.primary} size={22} />}
        theme={theme}
        isDark={isDark}
        onToggle={onToggleSfx}
      />
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.s5,
      borderWidth: BORDER_WIDTH.thin,
      borderColor: theme.borderDefault,
      gap: SPACING.s3,
      ...theme.shadowLow,
    },
    divider: {
      height: BORDER_WIDTH.thin,
      width: '100%',
      backgroundColor: theme.borderDefault,
    },
  });
}
