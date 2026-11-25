/**
 * @jest-environment node
 */
import ts from 'typescript';
import { ESLint } from 'eslint';
import { CompositionRoot } from '../../src/infrastructure/CompositionRoot';
import type { GameModeDescriptor } from '../../src/application/modes';
import type { HomeDestination } from '../../src/application/ports';

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
  statSync(filePath: string): { isFile(): boolean };
}

interface NodePath {
  readonly sep: string;
  resolve(...segments: string[]): string;
  join(...segments: string[]): string;
  dirname(filePath: string): string;
  relative(from: string, to: string): string;
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('node:fs') as NodeFs;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('node:path') as NodePath;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const projectConfig = require('../../eslint.config.js');

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: projectConfig,
});

const REPO_ROOT = path.resolve(__dirname, '../..');
const SRC_ROOT = path.join(REPO_ROOT, 'src');

const FORBIDDEN_VARIANT_LITERALS = new Set([
  'lines',
  'fit',
  'sort',
  'merge',
  'hexa-lines',
  'hexa-fit',
  'hexa-sort',
  'hexa-merge',
  'LINES',
  'FIT',
  'SORT',
  'MERGE',
]);

function listSourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listSourceFiles(fullPath));
    } else if (
      entry.isFile() &&
      /\.(ts|tsx)$/.test(entry.name) &&
      !entry.name.endsWith('.d.ts')
    ) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function parseSourceFile(filePath: string): ts.SourceFile {
  const content = fs.readFileSync(filePath, 'utf8');
  const scriptKind = filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, scriptKind);
}

function visitAst(node: ts.Node, visitor: (current: ts.Node) => void): void {
  visitor(node);
  ts.forEachChild(node, (child) => visitAst(child, visitor));
}

function collectModuleSpecifiers(sourceFile: ts.SourceFile): string[] {
  const specifiers: string[] = [];
  visitAst(sourceFile, (node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    }
  });
  return specifiers;
}

function resolveRelativeImport(fromFile: string, specifier: string): string | null {
  const basePath = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function relRepo(filePath: string): string {
  return path.relative(REPO_ROOT, filePath);
}

describe('SOLID and Clean Architecture automated gates', () => {
  it('should_have_no_circular_dependencies_when_analyzing_src_import_graph', () => {
    // Arrange
    const files = listSourceFiles(SRC_ROOT);
    const adjacency = new Map<string, string[]>();

    for (const file of files) {
      const sourceFile = parseSourceFile(file);
      const deps: string[] = [];
      for (const spec of collectModuleSpecifiers(sourceFile)) {
        if (!spec.startsWith('.')) continue;
        const resolved = resolveRelativeImport(file, spec);
        if (resolved) deps.push(resolved);
      }
      adjacency.set(file, deps);
    }

    // Act
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const stack: string[] = [];
    const cycles: string[] = [];

    const dfs = (node: string): void => {
      visiting.add(node);
      stack.push(node);

      for (const dep of adjacency.get(node) ?? []) {
        if (visiting.has(dep)) {
          const cycleStart = stack.indexOf(dep);
          const cyclePath = [...stack.slice(cycleStart), dep].map(relRepo).join(' -> ');
          cycles.push(cyclePath);
        } else if (!visited.has(dep)) {
          dfs(dep);
        }
      }

      stack.pop();
      visiting.delete(node);
      visited.add(node);
    };

    for (const file of files) {
      if (!visited.has(file)) dfs(file);
    }

    // Assert
    expect(cycles).toEqual([]);
  });

  it('should_only_import_concrete_adapters_from_composition_root_when_scanning_infrastructure', () => {
    // Arrange
    const infraDir = path.join(SRC_ROOT, 'infrastructure');
    const compositionRootFile = path.join(infraDir, 'CompositionRoot.ts');
    const adaptersDir = path.join(SRC_ROOT, 'adapters');
    const files = listSourceFiles(infraDir).filter((file) => file !== compositionRootFile);

    // Act
    const violations: string[] = [];
    for (const file of files) {
      const sourceFile = parseSourceFile(file);
      for (const spec of collectModuleSpecifiers(sourceFile)) {
        if (spec.startsWith('.')) {
          const resolvedBase = path.resolve(path.dirname(file), spec);
          if (resolvedBase === adaptersDir || resolvedBase.startsWith(`${adaptersDir}${path.sep}`)) {
            violations.push(`${relRepo(file)} imports "${spec}"`);
          }
        } else if (/(^|\/)adapters(\/|$)/.test(spec)) {
          violations.push(`${relRepo(file)} imports "${spec}"`);
        }
      }
    }

    // Assert
    expect(violations).toEqual([]);
  });

  it('should_keep_application_ports_small_and_cohesive_when_checking_isp', () => {
    // Arrange
    const portsDir = path.join(SRC_ROOT, 'application', 'ports');
    const files = listSourceFiles(portsDir);
    const maxMembersPerPort = 6;

    // Act
    const oversizedPorts: string[] = [];
    for (const file of files) {
      const sourceFile = parseSourceFile(file);
      visitAst(sourceFile, (node) => {
        if (ts.isInterfaceDeclaration(node) && node.members.length > maxMembersPerPort) {
          oversizedPorts.push(
            `${relRepo(file)}::${node.name.text} has ${node.members.length} members`,
          );
        }
      });
    }

    // Assert
    expect(oversizedPorts).toEqual([]);
  });

  it('should_limit_each_adapter_class_to_at_most_one_output_port_when_checking_srp_and_isp', () => {
    // Arrange
    const outputPortsDir = path.join(SRC_ROOT, 'application', 'ports', 'output');
    const outputPortNames = new Set<string>();
    for (const file of listSourceFiles(outputPortsDir)) {
      const sourceFile = parseSourceFile(file);
      visitAst(sourceFile, (node) => {
        if (ts.isInterfaceDeclaration(node)) {
          outputPortNames.add(node.name.text);
        }
      });
    }

    const adapterFiles = listSourceFiles(path.join(SRC_ROOT, 'adapters'));

    // Act
    const violations: string[] = [];
    for (const file of adapterFiles) {
      const sourceFile = parseSourceFile(file);
      visitAst(sourceFile, (node) => {
        if (!ts.isClassDeclaration(node) || !node.heritageClauses) return;
        const implementedOutputPorts: string[] = [];

        for (const clause of node.heritageClauses) {
          if (clause.token !== ts.SyntaxKind.ImplementsKeyword) continue;
          for (const typeNode of clause.types) {
            const typeName = typeNode.expression.getText(sourceFile);
            if (outputPortNames.has(typeName)) {
              implementedOutputPorts.push(typeName);
            }
          }
        }

        if (implementedOutputPorts.length > 1) {
          violations.push(
            `${relRepo(file)}::${node.name?.text ?? 'Anonymous'} implements ${implementedOutputPorts.join(', ')}`,
          );
        }
      });
    }

    // Assert
    expect(violations).toEqual([]);
  });

  it('should_contain_no_concrete_variant_conditionals_when_scanning_core_and_screens', () => {
    // Arrange
    const filesToScan = [
      ...listSourceFiles(path.join(SRC_ROOT, 'domain')),
      ...listSourceFiles(path.join(SRC_ROOT, 'application')),
      ...listSourceFiles(path.join(SRC_ROOT, 'adapters')),
      path.join(SRC_ROOT, 'infrastructure', 'HomeScreen.tsx'),
      path.join(SRC_ROOT, 'infrastructure', 'HexModeSelector.tsx'),
      ...listSourceFiles(path.join(SRC_ROOT, 'infrastructure', 'home')),
    ].filter((file) => fs.existsSync(file));

    const equalityOps = new Set<ts.SyntaxKind>([
      ts.SyntaxKind.EqualsEqualsEqualsToken,
      ts.SyntaxKind.ExclamationEqualsEqualsToken,
      ts.SyntaxKind.EqualsEqualsToken,
      ts.SyntaxKind.ExclamationEqualsToken,
    ]);

    const stringValue = (expr: ts.Expression): string | null => {
      if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
        return expr.text;
      }
      return null;
    };

    // Act
    const violations: string[] = [];
    for (const file of filesToScan) {
      const sourceFile = parseSourceFile(file);
      visitAst(sourceFile, (node) => {
        if (ts.isBinaryExpression(node) && equalityOps.has(node.operatorToken.kind)) {
          const left = stringValue(node.left);
          const right = stringValue(node.right);
          const hit = [left, right].find((val) => val !== null && FORBIDDEN_VARIANT_LITERALS.has(val));
          if (hit) {
            violations.push(`${relRepo(file)} compares against concrete variant "${hit}"`);
          }
        }
        if (ts.isCaseClause(node)) {
          const hit = stringValue(node.expression);
          if (hit && FORBIDDEN_VARIANT_LITERALS.has(hit)) {
            violations.push(`${relRepo(file)} switches on concrete variant "${hit}"`);
          }
        }
      });
    }

    // Assert
    expect(violations).toEqual([]);
  });

  it('should_contain_no_concrete_variant_literals_in_application_type_unions_when_checking_ocp', () => {
    // Arrange
    const filesToScan = [
      ...listSourceFiles(path.join(SRC_ROOT, 'application', 'ports')),
      ...listSourceFiles(path.join(SRC_ROOT, 'application', 'value-objects')),
    ];
    const variantPattern = /^(LINES|FIT|SORT|MERGE)($|_)|^hexa-(lines|fit|sort|merge)$/i;

    // Act
    const violations: string[] = [];
    for (const file of filesToScan) {
      const sourceFile = parseSourceFile(file);
      visitAst(sourceFile, (node) => {
        if (!ts.isUnionTypeNode(node)) return;
        for (const member of node.types) {
          if (ts.isLiteralTypeNode(member) && ts.isStringLiteral(member.literal)) {
            if (variantPattern.test(member.literal.text)) {
              violations.push(`${relRepo(file)} union contains concrete variant "${member.literal.text}"`);
            }
          }
        }
      });
    }

    // Assert
    expect(violations).toEqual([]);
  });

  it('should_support_a_fifth_variant_end_to_end_when_registered_in_composition_root', () => {
    // Arrange
    let navigatedTo: HomeDestination | null = null;
    const fifthVariant: GameModeDescriptor = {
      id: 'hexa-fill',
      nameKey: 'game.fill.name',
      descriptionKey: 'game.fill.desc',
      entryKind: 'DIRECT',
      progressDescriptor: 'best',
      previewKey: 'hexa-fill',
      iconKey: 'hexa-fill',
      accentColor: '#E11D48',
      hudComponents: ['score'],
      controls: ['pause'],
    };
    const root = new CompositionRoot([fifthVariant], {
      navigate: (destination) => {
        navigatedTo = destination;
      },
    });

    // Act
    root.initializeHome();
    root.homeController.selectMode('hexa-fill');
    root.homeController.play('hexa-fill');

    // Assert
    expect(root.homeOutput.current?.modes).toHaveLength(1);
    expect(root.homeOutput.current?.selectedModeId).toBe('hexa-fill');
    expect(root.homeSelectionPreference.load()).toBe('hexa-fill');
    expect(navigatedTo).toBe('DIRECT');
  });

  it('should_contain_no_not_implemented_throws_when_scanning_src', () => {
    // Arrange
    const files = listSourceFiles(SRC_ROOT);

    // Act
    const violations: string[] = [];
    for (const file of files) {
      const sourceFile = parseSourceFile(file);
      visitAst(sourceFile, (node) => {
        if (ts.isThrowStatement(node) && /not\s*implemented/i.test(node.getText(sourceFile))) {
          violations.push(relRepo(file));
        }
      });
    }

    // Assert
    expect(violations).toEqual([]);
  });

  it.each([
    ['src/domain/sample.ts', 'export const r = () => Math.random();\n', 'no-restricted-properties'],
    ['src/domain/sample.ts', 'export const t = () => Date.now();\n', 'no-restricted-properties'],
    ['src/domain/sample.ts', 'export const d = () => new Date();\n', 'no-restricted-syntax'],
    ['src/domain/sample.ts', "export const l = () => { console.log('x'); };\n", 'no-console'],
    ['src/domain/sample.ts', "export const f = () => fetch('/api');\n", 'no-restricted-globals'],
    [
      'src/domain/sample.ts',
      'export const c = (x: unknown, Foo: new () => object) => x instanceof Foo;\n',
      'no-restricted-syntax',
    ],
    ['src/application/sample.ts', 'export const r = () => Math.random();\n', 'no-restricted-properties'],
    ['src/application/sample.ts', 'export const t = () => Date.now();\n', 'no-restricted-properties'],
    ['src/application/sample.ts', 'export const d = () => new Date();\n', 'no-restricted-syntax'],
    ['src/application/sample.ts', "export const l = () => { console.log('x'); };\n", 'no-console'],
    ['src/application/sample.ts', "export const f = () => fetch('/api');\n", 'no-restricted-globals'],
    [
      'src/application/sample.ts',
      'export const c = (x: unknown, Foo: new () => object) => x instanceof Foo;\n',
      'no-restricted-syntax',
    ],
  ])(
    'should_reject_impure_apis_and_instanceof_when_used_in_%s (%s)',
    async (filePath, code, expectedRuleId) => {
      // Arrange & Act
      const [result] = await eslint.lintText(code, { filePath });
      const matchingErrors = result.messages.filter((msg) => msg.ruleId === expectedRuleId);

      // Assert
      expect(matchingErrors.length).toBeGreaterThanOrEqual(1);
    },
  );

  it('should_reject_console_calls_when_used_in_infrastructure', async () => {
    // Arrange
    const code = "export const log = () => { console.log('x'); };\n";

    // Act
    const [result] = await eslint.lintText(code, { filePath: 'src/infrastructure/sample.ts' });
    const consoleErrors = result.messages.filter((msg) => msg.ruleId === 'no-console');

    // Assert
    expect(consoleErrors).toHaveLength(1);
  });

  it('should_reject_high_cyclomatic_complexity_when_exceeding_srp_threshold_in_adapters', async () => {
    // Arrange
    const code = `export function complex(n: number): number {
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 3;
  if (n === 4) return 4;
  if (n === 5) return 5;
  if (n === 6) return 6;
  if (n === 7) return 7;
  if (n === 8) return 8;
  if (n === 9) return 9;
  if (n === 10) return 10;
  return 0;
}\n`;

    // Act
    const [result] = await eslint.lintText(code, { filePath: 'src/adapters/sample.ts' });
    const complexityErrors = result.messages.filter((msg) => msg.ruleId === 'complexity');

    // Assert
    expect(complexityErrors).toHaveLength(1);
  });
});
