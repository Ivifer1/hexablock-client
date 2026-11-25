import { AccessibilityInfo, Text, View } from 'react-native';
import { act, render, waitFor } from '@testing-library/react-native';
import {
  AnimatedFade,
  AnimatedPulse,
  AnimatedScale,
  MotionProvider,
  MotionRoot,
  SwipeableSurface,
  useReducedMotion,
  type IMotionAdapter,
} from '../../src/infrastructure/motion';

declare const __dirname: string;

interface NodeDirEntry {
  readonly name: string;
  isDirectory(): boolean;
  isFile(): boolean;
}

interface NodeFs {
  existsSync(filePath: string): boolean;
  readdirSync(dirPath: string, options: { withFileTypes: true }): readonly NodeDirEntry[];
  readFileSync(filePath: string, encoding: 'utf8'): string;
}

interface NodePath {
  resolve(...segments: string[]): string;
  join(...segments: string[]): string;
  relative(from: string, to: string): string;
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('node:fs') as NodeFs;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('node:path') as NodePath;

const REPO_ROOT = path.resolve(__dirname, '../..');
const SRC_ROOT = path.join(REPO_ROOT, 'src');

function listSourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listSourceFiles(fullPath));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function ReduceMotionProbe() {
  const reduced = useReducedMotion();
  return <Text testID="reduce-motion-state">{reduced ? 'reduced' : 'full'}</Text>;
}

describe('Infrastructure motion facade & adapter isolation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should_render_children_through_default_reanimated_motion_primitives_when_mounted', async () => {
    // Arrange & Act
    const { getByTestId, getByText } = await render(
      <MotionRoot>
        <AnimatedScale scale={1.04} testID="motion-scale">
          <AnimatedPulse triggerKey="lines" testID="motion-pulse">
            <AnimatedFade triggerKey="lines" testID="motion-fade">
              <SwipeableSurface testID="motion-swipe" onSwipeLeft={jest.fn()} onSwipeRight={jest.fn()}>
                <Text>Animated Content</Text>
              </SwipeableSurface>
            </AnimatedFade>
          </AnimatedPulse>
        </AnimatedScale>
      </MotionRoot>,
    );

    // Assert
    expect(getByTestId('motion-scale')).toBeTruthy();
    expect(getByTestId('motion-pulse')).toBeTruthy();
    expect(getByTestId('motion-fade')).toBeTruthy();
    expect(getByTestId('motion-swipe')).toBeTruthy();
    expect(getByText('Animated Content')).toBeTruthy();
  });

  it('should_update_primitives_cleanly_when_trigger_keys_and_reduce_motion_change', async () => {
    // Arrange
    const { getByText, rerender } = await render(
      <AnimatedScale scale={1} reduceMotion={false}>
        <AnimatedPulse triggerKey="lines" reduceMotion={false}>
          <AnimatedFade triggerKey="lines" reduceMotion={false}>
            <Text>Mode lines</Text>
          </AnimatedFade>
        </AnimatedPulse>
      </AnimatedScale>,
    );

    // Act: transition trigger keys with full motion, then with reduceMotion enabled
    await rerender(
      <AnimatedScale scale={1.04} reduceMotion={false}>
        <AnimatedPulse triggerKey="merge" reduceMotion={false}>
          <AnimatedFade triggerKey="merge" reduceMotion={false}>
            <Text>Mode merge</Text>
          </AnimatedFade>
        </AnimatedPulse>
      </AnimatedScale>,
    );
    await rerender(
      <AnimatedScale scale={1} reduceMotion>
        <AnimatedPulse triggerKey="sort" reduceMotion>
          <AnimatedFade triggerKey="sort" reduceMotion>
            <Text>Mode sort</Text>
          </AnimatedFade>
        </AnimatedPulse>
      </AnimatedScale>,
    );

    // Assert
    expect(getByText('Mode sort')).toBeTruthy();
  });

  it('should_delegate_to_injected_motion_adapter_when_custom_provider_is_used', async () => {
    // Arrange
    const calls: string[] = [];
    const fakeAdapter: IMotionAdapter = {
      Root: ({ children }) => {
        calls.push('Root');
        return <View testID="fake-root">{children}</View>;
      },
      Scale: ({ scale, children }) => {
        calls.push(`Scale:${scale}`);
        return <View testID="fake-scale">{children}</View>;
      },
      Pulse: ({ triggerKey, children }) => {
        calls.push(`Pulse:${triggerKey}`);
        return <View testID="fake-pulse">{children}</View>;
      },
      Fade: ({ triggerKey, children }) => {
        calls.push(`Fade:${triggerKey}`);
        return <View testID="fake-fade">{children}</View>;
      },
      Swipeable: ({ children }) => {
        calls.push('Swipeable');
        return <View testID="fake-swipe">{children}</View>;
      },
    };

    // Act
    const { getByTestId } = await render(
      <MotionProvider adapter={fakeAdapter}>
        <MotionRoot>
          <AnimatedScale scale={1.08}>
            <AnimatedPulse triggerKey="fit">
              <AnimatedFade triggerKey="fit">
                <SwipeableSurface>
                  <Text>Swapped</Text>
                </SwipeableSurface>
              </AnimatedFade>
            </AnimatedPulse>
          </AnimatedScale>
        </MotionRoot>
      </MotionProvider>,
    );

    // Assert
    expect(getByTestId('fake-root')).toBeTruthy();
    expect(getByTestId('fake-scale')).toBeTruthy();
    expect(getByTestId('fake-pulse')).toBeTruthy();
    expect(getByTestId('fake-fade')).toBeTruthy();
    expect(getByTestId('fake-swipe')).toBeTruthy();
    expect(calls).toEqual(['Root', 'Scale:1.08', 'Pulse:fit', 'Fade:fit', 'Swipeable']);
  });

  it('should_read_and_subscribe_to_reduced_motion_preference_when_hook_is_used', async () => {
    // Arrange
    let listener: ((enabled: boolean) => void) | undefined;
    const remove = jest.fn();
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((_event, handler) => {
      listener = handler as (enabled: boolean) => void;
      return { remove } as unknown as ReturnType<typeof AccessibilityInfo.addEventListener>;
    });

    // Act
    const { getByTestId, unmount } = await render(<ReduceMotionProbe />);

    await waitFor(() => {
      expect(getByTestId('reduce-motion-state').props.children).toBe('full');
    });

    await act(async () => {
      listener?.(true);
    });

    // Assert
    expect(getByTestId('reduce-motion-state').props.children).toBe('reduced');

    await unmount();
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('should_keep_animation_and_gesture_packages_isolated_to_infrastructure_motion_module', () => {
    // Arrange
    const allowedImporter = path.join(SRC_ROOT, 'infrastructure', 'motion', 'ReanimatedMotionAdapter.tsx');
    const forbiddenPackagePattern =
      /from\s+['"]react-native-(reanimated|gesture-handler|worklets)(?:\/[^'"]*)?['"]|require\(\s*['"]react-native-(reanimated|gesture-handler|worklets)/;
    const files = listSourceFiles(SRC_ROOT);

    // Act
    const leaks: string[] = [];
    for (const file of files) {
      if (file === allowedImporter) continue;
      const content = fs.readFileSync(file, 'utf8');
      if (forbiddenPackagePattern.test(content)) {
        leaks.push(path.relative(REPO_ROOT, file));
      }
    }

    // Assert
    expect(leaks).toEqual([]);
  });
});
