import { SPACING, scaleButtonSize } from './theme';

export interface HomeLayoutMetrics {
  readonly compact: boolean;
  readonly narrow: boolean;
  readonly wide: boolean;
  readonly horizontalPadding: number;
  readonly fontScale: number;
  readonly modeIconSize: number;
  readonly selectedModeIconSize: number;
  readonly menuHeight: number;
  readonly topSafeInset: number;
  readonly bottomSafeInset: number;
  readonly bodyPaddingBottom: number;
  readonly mainBodyPaddingVertical: number;
  readonly menuIconSize: number;
  readonly cardPadding: number;
  readonly wheelSize: number;
  readonly selectorHeight: number;
  readonly cardTitleFontSize: number;
  readonly cardTitleLineHeight: number;
  readonly cardHeaderMinHeight: number;
  readonly progressBadgeMinHeight: number;
  readonly descriptionFontSize: number;
  readonly descriptionLineHeight: number;
  readonly descriptionHeight: number;
  readonly playButtonMinHeight: number;
  readonly estimatedTotalHeight: number;
}

export function computeHomeLayoutMetrics(
  viewportWidth: number,
  viewportHeight: number,
  platformOS: string,
  androidStatusBarHeight: number,
): HomeLayoutMetrics {
  const compact = viewportHeight < 760;
  const narrow = viewportWidth < 350;
  const wide = viewportWidth >= 600;

  const horizontalPadding = narrow ? SPACING.s3 : wide ? SPACING.s12 : SPACING.s6;
  const fontScale = Math.max(0.82, Math.min(viewportWidth / 360, 1.12));

  const modeIconSize = narrow ? 42 : compact ? 44 : wide ? 52 : 48;
  const selectedModeIconSize = narrow ? 52 : compact ? 54 : wide ? 64 : 62;
  const menuHeight = narrow || compact ? 64 : wide ? 72 : 68;
  const topSafeInset =
    platformOS === 'android'
      ? androidStatusBarHeight + (compact ? SPACING.s2 : SPACING.s4)
      : compact
        ? SPACING.s3
        : wide
          ? SPACING.s6
          : SPACING.s4;
  const bottomSafeInset =
    platformOS === 'android'
      ? SPACING.s8
      : compact
        ? SPACING.s4
        : SPACING.s5;
  const bodyPaddingBottom = compact ? SPACING.s2 : SPACING.s3;
  const mainBodyPaddingVertical = compact ? SPACING.s1 : SPACING.s2;
  const menuIconSize = narrow ? 22 : wide ? 28 : 24;
  const cardPadding = narrow || compact ? SPACING.s3 : SPACING.s5;

  const cardTitleFontSize = Math.round(22 * fontScale);
  const cardTitleLineHeight = Math.round(28 * fontScale);
  const cardHeaderMinHeight = Math.ceil(30 * fontScale);
  const progressBadgeMinHeight = Math.ceil(24 * fontScale);
  const descriptionFontSize = Math.round(Math.max(13, 15 * fontScale));
  const descriptionLineHeight = Math.round(Math.max(18, 22 * fontScale));
  const descriptionHeight = descriptionLineHeight * 2;
  const playButtonMinHeight = scaleButtonSize('l', fontScale).minHeight;

  const slotWidth = Math.max(selectedModeIconSize + 18, 78);
  const availableWidth = Math.max(160, viewportWidth - horizontalPadding * 2);
  const maxWheelByWidth = Math.floor((availableWidth - slotWidth) / 0.82);
  const availableBodyHeight = Math.max(300, viewportHeight - (menuHeight + bottomSafeInset));

  const headerHeight = SPACING.touchTargetMin;
  const heroTitleLineHeight = (narrow ? 28 : 34) * fontScale;
  const heroSubtitleHeight = (compact ? SPACING.s1 / 2 : SPACING.s1) + (narrow ? 16 : 20);
  const selectorMarginVertical = (narrow || compact ? SPACING.s2 : SPACING.s4) + SPACING.s2;
  const cardMarginTop = compact ? SPACING.s2 : SPACING.s3;
  const entryKindBadgeHeight = SPACING.s1 + Math.ceil(11 * fontScale * 1.4) + 6;
  const playButtonMarginTop = compact ? SPACING.s3 : SPACING.s4;
  const estimatedCardHeight =
    cardMarginTop +
    cardPadding * 2 +
    cardHeaderMinHeight +
    entryKindBadgeHeight +
    SPACING.s2 +
    descriptionHeight +
    playButtonMarginTop +
    playButtonMinHeight +
    2;
  const fixedVerticalHeight =
    topSafeInset +
    bodyPaddingBottom +
    headerHeight +
    mainBodyPaddingVertical * 2 +
    heroTitleLineHeight +
    heroSubtitleHeight +
    selectorMarginVertical +
    estimatedCardHeight;
  const maxSelectorByHeight = availableBodyHeight - Math.ceil(fixedVerticalHeight);
  const maxWheelByHeight = Math.floor(
    maxSelectorByHeight - Math.ceil(selectedModeIconSize * 0.95),
  );
  const targetWheel = wide ? 268 : narrow ? 208 : 248;
  const wheelSize = Math.max(112, Math.min(targetWheel, maxWheelByWidth, maxWheelByHeight));
  const selectorHeight = Math.round(wheelSize + selectedModeIconSize * 0.95);
  const estimatedTotalHeight = Math.ceil(
    fixedVerticalHeight + selectorHeight + menuHeight + bottomSafeInset,
  );

  return {
    compact,
    narrow,
    wide,
    horizontalPadding,
    fontScale,
    modeIconSize,
    selectedModeIconSize,
    menuHeight,
    topSafeInset,
    bottomSafeInset,
    bodyPaddingBottom,
    mainBodyPaddingVertical,
    menuIconSize,
    cardPadding,
    wheelSize,
    selectorHeight,
    cardTitleFontSize,
    cardTitleLineHeight,
    cardHeaderMinHeight,
    progressBadgeMinHeight,
    descriptionFontSize,
    descriptionLineHeight,
    descriptionHeight,
    playButtonMinHeight,
    estimatedTotalHeight,
  };
}
