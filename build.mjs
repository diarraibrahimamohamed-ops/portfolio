import { readFile, writeFile } from 'node:fs/promises';
import { minify as minifyHtml } from 'html-minifier-terser';
import CleanCSS from 'clean-css';
import JavaScriptObfuscator from 'javascript-obfuscator';

const [html, css, js] = await Promise.all([
  readFile('src/index.html', 'utf8'),
  readFile('src/style.css', 'utf8'),
  readFile('src/script.js', 'utf8'),
]);

// Security checks on source JavaScript - only catch truly dangerous patterns
const criticalDangerousPatterns = [
  /eval\s*\(/gi,
  /new\s+Function\s*\(/gi,
  /document\.write\s*\(/gi,
  /outerHTML\s*=/gi,
];

const securityViolations = [];
criticalDangerousPatterns.forEach((pattern) => {
  const matches = js.match(pattern);
  if (matches) {
    securityViolations.push(`Pattern critique détecté: ${pattern.source} (${matches.length} occurrences)`);
  }
});

if (securityViolations.length > 0) {
  console.error('⚠️  Violations de sécurité critiques détectées dans le JavaScript source:');
  securityViolations.forEach(v => console.error(`  - ${v}`));
  console.error('Veuillez corriger ces problèmes avant de continuer.');
  process.exit(1);
}

console.log('✅ Vérifications de sécurité source JavaScript: PASSED');

const cssResult = new CleanCSS({
  level: {
    1: {
      specialComments: 0,
      removeWhitespace: true,
      removeQuotes: true,
      removeEmpty: true,
      mergeMediaQueries: true,
      mergeIntoShorthands: true,
    },
    2: {
      mergeSemantically: true,
      restructureRules: true,
      removeUnusedAtRules: true,
      removeDuplicateRules: true,
      removeDuplicateDeclarations: true,
    },
  },
}).minify(css);

if (cssResult.errors.length) {
  console.error(cssResult.errors.join('\n'));
  process.exit(1);
}

const jsOut = JavaScriptObfuscator.obfuscate(js, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 0,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'mangled',
  identifiersPrefix: '',
  inputFileName: '',
  numbersToExpressions: true,
  renameGlobals: false,
  renameProperties: false,
  reservedNames: [],
  reservedStrings: [],
  seed: 0,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.5,
  stringArrayEncoding: ['rc4'],
  stringArrayIndexShift: true,
  stringArrayIndexesType: ['hexadecimal-number'],
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  target: 'browser',
  transformObjectKeys: true,
  transformObjectKeysThreshold: 0.75,
  unicodeEscapeSequence: false,
  sourceMap: false,
  sourceMapMode: 'separate',
}).getObfuscatedCode();

if (/\beval\s*\(|\bnew\s+Function\s*\(|\bFunction\s*\(/.test(jsOut)) {
  console.error('Le JavaScript obscurci utilise eval/Function. Refus : incompatible avec une CSP sans unsafe-eval.');
  process.exit(1);
}

const htmlOut = await minifyHtml(html, {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: true,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  useShortDoctype: true,
  keepClosingSlash: true,
  decodeEntities: false,
  minifyCSS: false,
  minifyJS: false,
  continueOnParseError: false,
});

if (/\son[a-z]+\s*=/i.test(htmlOut) || /javascript:/i.test(htmlOut)) {
  console.error('HTML minifié contient encore un gestionnaire inline ou une URL javascript:.');
  process.exit(1);
}

await Promise.all([
  writeFile('index.html', htmlOut),
  writeFile('style.css', cssResult.styles),
  writeFile('script.js', jsOut + '\n'),
]);

console.log(JSON.stringify({
  html: htmlOut.length,
  css: cssResult.styles.length,
  js: jsOut.length,
}));
