import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BORDER_WIDTH, RADIUS, SPACING, TYPOGRAPHY, type Theme } from '../theme';

export interface SettingsLogoutDialogProps {
  readonly visible: boolean;
  readonly message: string;
  readonly cancelLabel: string;
  readonly confirmLabel: string;
  readonly theme: Theme;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

export function SettingsLogoutDialog({
  visible,
  message,
  cancelLabel,
  confirmLabel,
  theme,
  onCancel,
  onConfirm,
}: SettingsLogoutDialogProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View
          testID="settings-logout-dialog"
          accessibilityViewIsModal
          style={styles.dialog}
        >
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable
              testID="settings-logout-cancel"
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.cancelLabel}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              testID="settings-logout-confirm"
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(21, 24, 33, 0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.s6,
    },
    dialog: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.surface,
      borderRadius: RADIUS.xl,
      padding: SPACING.s5,
      borderWidth: BORDER_WIDTH.thin,
      borderColor: theme.borderDefault,
      gap: SPACING.s5,
      ...theme.shadowMedium,
    },
    message: {
      fontSize: TYPOGRAPHY.title2.fontSize,
      lineHeight: TYPOGRAPHY.title2.lineHeight,
      fontWeight: '700',
      color: theme.textPrimary,
      textAlign: 'center',
    },
    actions: {
      flexDirection: 'row',
      gap: SPACING.s3,
    },
    button: {
      flex: 1,
      minHeight: SPACING.touchTargetMin,
      borderRadius: RADIUS.full,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPACING.s3,
      paddingVertical: SPACING.s2,
    },
    cancelButton: {
      backgroundColor: theme.surfaceSubdued,
      borderWidth: BORDER_WIDTH.thin,
      borderColor: theme.borderDefault,
    },
    confirmButton: {
      backgroundColor: theme.danger,
    },
    cancelLabel: {
      fontSize: TYPOGRAPHY.bodyMedium.fontSize,
      lineHeight: TYPOGRAPHY.bodyMedium.lineHeight,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    confirmLabel: {
      fontSize: TYPOGRAPHY.bodyMedium.fontSize,
      lineHeight: TYPOGRAPHY.bodyMedium.lineHeight,
      fontWeight: '700',
      color: theme.primaryFg,
    },
    buttonPressed: {
      opacity: 0.85,
    },
  });
}
