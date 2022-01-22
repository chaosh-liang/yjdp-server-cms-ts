module.exports = {
  extends: ['standard', 'prettier'],
  globals: {
    // postMessage: true
  },
  rules: {
    'space-before-function-paren': 0,
    camelcase: [
      'error',
      {
        properties: 'never',
        ignoreImports: true,
        ignoreGlobals: true,
        ignoreDestructuring: true,
      },
    ],
  },
}
