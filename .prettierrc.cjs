module.exports = {
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: 'none',
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: false,
  printWidth: 80,
  semi: true,
  useTabs: false,
  tabWidth: 2,
  quoteProps: 'as-needed',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.ts',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.tsx',
      options: {
        singleAttributePerLine: true,
      },
    },
  ],
  plugins: ['prettier-plugin-tailwindcss'],
};
