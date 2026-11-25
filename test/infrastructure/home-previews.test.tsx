import { createElement } from 'react';
import { Text, View as mockRNView } from 'react-native';
import { render } from '@testing-library/react-native';
import {
  HomePreviewVisual,
  ImageHomePreview,
  SvgHomePreview,
  type HomePreviewRenderProps,
  type IHomePreview,
} from '../../src/infrastructure/home-previews';

const mockCreateElement = createElement;

jest.mock('react-native-svg', () => ({
  __esModule: true,
  SvgXml: ({
    xml,
    width,
    height,
    testID,
  }: {
    readonly xml: string;
    readonly width: number;
    readonly height: number;
    readonly testID?: string;
  }) =>
    mockCreateElement(mockRNView, {
      testID: testID ?? 'svg-xml',
      accessibilityLabel: xml,
      style: { width, height },
    }),
}));

describe('Home preview polymorphism (IHomePreview)', () => {
  it('should_render_svg_preview_when_using_svg_home_preview', async () => {
    // Arrange
    const preview = new SvgHomePreview('<svg data-test="lines" />');

    // Act
    const { getByTestId } = await render(
      <HomePreviewVisual preview={preview} size={120} testID="home-center-preview" />,
    );

    // Assert
    const node = getByTestId('home-center-preview');
    expect(node.props.accessibilityLabel).toBe('<svg data-test="lines" />');
    expect(node.props.style).toEqual({ width: 120, height: 120 });
  });

  it('should_render_image_preview_when_using_image_home_preview', async () => {
    // Arrange
    const source = { uri: 'https://example.com/preview.png' };
    const preview = new ImageHomePreview(source);

    // Act
    const { getByTestId } = await render(
      <HomePreviewVisual preview={preview} size={140} testID="home-center-preview" />,
    );

    // Assert
    const node = getByTestId('home-center-preview');
    expect(node.props.source).toEqual(source);
    expect(node.props.style).toEqual({ width: 140, height: 140 });
    expect(node.props.resizeMode).toBe('contain');
  });

  it('should_render_custom_preview_strategy_without_modifying_home_preview_visual_when_new_format_is_added', async () => {
    // Arrange: simulate a future animated/video preview format honoring reduceMotion
    class MotionAwareVideoPreview implements IHomePreview {
      public constructor(
        private readonly videoLabel: string,
        private readonly posterLabel: string,
      ) {}

      public render({ testID, reduceMotion }: HomePreviewRenderProps) {
        return (
          <Text testID={testID}>
            {reduceMotion ? this.posterLabel : this.videoLabel}
          </Text>
        );
      }
    }

    const preview = new MotionAwareVideoPreview('video-loop', 'static-poster');

    // Act
    const animatedRender = await render(
      <HomePreviewVisual
        preview={preview}
        size={140}
        testID="home-center-preview"
        reduceMotion={false}
      />,
    );
    const reducedRender = await render(
      <HomePreviewVisual
        preview={preview}
        size={140}
        testID="home-center-preview"
        reduceMotion
      />,
    );

    // Assert
    expect(animatedRender.getByText('video-loop')).toBeTruthy();
    expect(reducedRender.getByText('static-poster')).toBeTruthy();
  });
});
