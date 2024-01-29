module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', '@darraghor/nestjs-typed'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:perfectionist/recommended-natural',
    'plugin:@darraghor/nestjs-typed/recommended',
    'plugin:@darraghor/nestjs-typed/no-swagger'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '*config.*', '.github', 'data'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@darraghor/nestjs-typed/sort-module-metadata-arrays': 'error',
    '@darraghor/nestjs-typed/injectable-should-be-provided': [
      'error',
      {
        filterFromPaths: ['node_modules', '.test.', '.spec.'],
      },
    ],
  },
};
