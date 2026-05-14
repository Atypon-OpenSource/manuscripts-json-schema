module.exports = {
  transformIgnorePatterns: ['node_modules/(?!(\\.pnpm|uuid))'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
}
