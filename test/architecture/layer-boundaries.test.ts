/**
 * @jest-environment node
 */
import { ESLint } from 'eslint';

// The dependency rule: inner layers never import outer layers or UI/framework packages.
// These tests pin the ESLint configuration that enforces it.

// The real project config is passed in directly because Jest cannot run ESLint's
// dynamic config loading without experimental VM flags.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const projectConfig = require('../../eslint.config.js');

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: projectConfig,
});

async function restrictedImportErrors(layerFile: string, importPath: string): Promise<number> {
  const code = `import { something } from '${importPath}';\nexport { something };\n`;
  const [result] = await eslint.lintText(code, {
    filePath: layerFile,
  });
  return result.messages.filter((message) => message.ruleId === 'no-restricted-imports').length;
}

describe('layer boundaries', () => {
  it.each([
    ['src/domain/board/sample.ts', '../../application/use-case'],
    ['src/domain/board/sample.ts', '../../adapters/presenter'],
    ['src/domain/board/sample.ts', '../../infrastructure/screen'],
    ['src/domain/board/sample.ts', 'react'],
    ['src/domain/board/sample.ts', 'react-native'],
    ['src/domain/board/sample.ts', 'expo-status-bar'],
    ['src/application/sample.ts', '../adapters/presenter'],
    ['src/application/sample.ts', '../infrastructure/screen'],
    ['src/application/sample.ts', 'react-native'],
    ['src/application/sample.ts', 'expo'],
    ['src/adapters/sample.ts', '../infrastructure/screen'],
  ])('should_report_error_when_%s_imports_%s', async (layerFile, importPath) => {
    // Arrange: the layer file and the forbidden import come from the table.

    // Act
    const errors = await restrictedImportErrors(layerFile, importPath);

    // Assert
    expect(errors).toBe(1);
  });

  it.each([
    ['src/application/sample.ts', '../domain/board'],
    ['src/adapters/sample.ts', '../application/use-case'],
    ['src/adapters/sample.ts', '../domain/board'],
    ['src/infrastructure/sample.ts', '../adapters/presenter'],
    ['src/infrastructure/sample.ts', 'react-native'],
  ])('should_allow_import_when_%s_imports_inner_or_allowed_%s', async (layerFile, importPath) => {
    // Arrange: the layer file and the allowed import come from the table.

    // Act
    const errors = await restrictedImportErrors(layerFile, importPath);

    // Assert
    expect(errors).toBe(0);
  });
});
