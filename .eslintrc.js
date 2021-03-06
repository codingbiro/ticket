module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    semi: ['error', 'always'],
    quotes: [2, 'single', { avoidEscape: true }],
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'max-len': 130,
  },
};
