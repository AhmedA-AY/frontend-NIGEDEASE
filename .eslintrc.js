module.exports = {
  extends: ['next/core-web-vitals'],
  plugins: ['@typescript-eslint'],
  rules: {
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/unbound-method': 'off',
    'react-hooks/exhaustive-deps': 'off'
  },
  ignorePatterns: ['node_modules/', '.next/', 'out/']
}; 