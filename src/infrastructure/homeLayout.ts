import { SPACING, scaleButtonSize } from './theme';

export interface HomeLayoutMetrics {
  readonly compact: boolean;
  readonly narrow: boolean;
  readonly wide: boolean;
  readonly horizontalPadding: number;
  readonly fontScale: number;
  readonly menuHeight: number;
  readonly topSafeInset: number;
  readonly bottomSafeInset: number;
  readonly bodyPaddingBottom: number;
  readonly mainBodyPaddingVertical: number;
  readonly menuIconSize: number;
  readonly heroTitleFontSize: number;
  readonly heroTitleLineHeight: number;
  readonly heroTitleTailFontSize: number;
  readonly heroTitleTailLineHeight: number;
  readonly showcaseSize: number;
  readonly arrowButtonSize: number;
  readonly arrowGap: number;
  readonly showcaseMarginVertical: number;
  readonly modePillMinHeight: number;
  readonly progressBadgeMinHeight: number;
  readonly descriptionFontSize: number;
  readonly descriptionLineHeight: number;
  readonly descriptionHeight: number;
  readonly metadataRowHeight: number;
  readonly modeTileHeight: number;
  readonly modeTileIconSize: number;
  readonly tileGap: number;
  readonly sectionGap: number;
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

  const menuHeight = narrow || compact ? 64 : wide ? 72 : 68;
  const topSafeInset =
    platformOS === 'android'
      ? androidStatusBarHeight + (compact ? SPACING.s2 : SPACING.s4)
      : compact
        ? SPACING.s2
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
  const mainBodyPaddingVertical = compact ? 0 : SPACING.s1;
  const menuIconSize = narrow ? 22 : wide ? 28 : 24;

  const heroTitleFontSize = Math.round((narrow ? 24 : wide ? 34 : 30) * fontScale);
  const heroTitleLineHeight = Math.round((narrow ? 27 : wide ? 38 : 34) * fontScale);
  const heroTitleTailFontSize = Math.round((narrow ? 20 : wide ? 28 : 25) * fontScale);
  const heroTitleTailLineHeight = Math.round((narrow ? 23 : wide ? 32 : 28) * fontScale);

  const arrowButtonSize =
    narrow || compact
      ? SPACING.touchTargetMin
      : Math.max(SPACING.touchTargetMin, Math.round(44 * fontScale));
  const arrowGap = narrow ? SPACING.s2 : wide ? SPACING.s5 : SPACING.s3;
  const showcaseMarginVertical = compact ? SPACING.s2 : SPACING.s3;

  const modePillMinHeight = Math.ceil(32 * fontScale);
  const progressBadgeMinHeight = Math.ceil(22 * fontScale);
  const descriptionFontSize = Math.round(Math.max(13, 14 * fontScale));
  const descriptionLineHeight = Math.round(Math.max(17, 20 * fontScale));
  const descriptionHeight = descriptionLineHeight * 2;
  const metadataRowHeight = Math.ceil(22 * fontScale);

  const modeTileHeight = narrow || compact ? 62 : wide ? 86 : 78;
  const modeTileIconSize = narrow || compact ? 26 : wide ? 34 : 30;
  const tileGap = narrow ? 6 : wide ? SPACING.s3 : SPACING.s2;
  const sectionGap = compact ? SPACING.s2 : SPACING.s4;
  const playButtonMinHeight = scaleButtonSize('l', fontScale).minHeight;

  const availableWidth = Math.max(160, viewportWidth - horizontalPadding * 2);
  const maxShowcaseByWidth = Math.floor(availableWidth - arrowButtonSize * 2 - arrowGap * 2);
  const availableBodyHeight = Math.max(300, viewportHeight - (menuHeight + bottomSafeInset));

  const headerHeight = SPACING.touchTargetMin;
  const heroSubtitleTopMargin = compact ? 2 : SPACING.s1;
  const heroSubtitleLineHeight = narrow ? 16 : 20;
  const heroHeight =
    heroTitleLineHeight + heroTitleTailLineHeight + heroSubtitleTopMargin + heroSubtitleLineHeight;

  const summaryHeight =
    modePillMinHeight +
    SPACING.s1 +
    descriptionHeight +
    SPACING.s1 +
    metadataRowHeight;

  const fixedVerticalHeight =
    topSafeInset +
    bodyPaddingBottom +
    headerHeight +
    mainBodyPaddingVertical * 2 +
    heroHeight +
    showcaseMarginVertical * 2 +
    summaryHeight +
    sectionGap * 2 +
    modeTileHeight +
    playButtonMinHeight;

  const maxShowcaseByHeight = availableBodyHeight - Math.ceil(fixedVerticalHeight);
  const targetShowcase = wide ? 220 : compact ? 164 : narrow ? 152 : 200;
  const showcaseSize = Math.max(
    104,
    Math.min(targetShowcase, maxShowcaseByWidth, maxShowcaseByHeight),
  );
  const estimatedTotalHeight = Math.ceil(
    fixedVerticalHeight + showcaseSize + menuHeight + bottomSafeInset,
  );

  return {
    compact,
    narrow,
    wide,
    horizontalPadding,
    fontScale,
    menuHeight,
    topSafeInset,
    bottomSafeInset,
    bodyPaddingBottom,
    mainBodyPaddingVertical,
    menuIconSize,
    heroTitleFontSize,
    heroTitleLineHeight,
    heroTitleTailFontSize,
    heroTitleTailLineHeight,
    showcaseSize,
    arrowButtonSize,
    arrowGap,
    showcaseMarginVertical,
    modePillMinHeight,
    progressBadgeMinHeight,
    descriptionFontSize,
    descriptionLineHeight,
    descriptionHeight,
    metadataRowHeight,
    modeTileHeight,
    modeTileIconSize,
    tileGap,
    sectionGap,
    playButtonMinHeight,
    estimatedTotalHeight,
  };
}
