module.exports = {
  'parserOptions': {
    'ecmaVersion': 12
  },
  'env': {
    'node': true,
    'commonjs': true,
    'es6': true,
    'mocha': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:mocha/recommended'
  ],
  'plugins': [
    'mocha'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': 'error',
    'quotes': [
      'error',
      'single'
    ],
    'prefer-template': 'warn',
    'semi': [
      'error',
      'never'
    ],
    'no-console': 'warn',
    'no-extra-parens': 'error',
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'no-unused-vars': 'warn',
    'space-before-function-paren': [
      'error',
      'never'
    ],
    'space-before-blocks': [
      'error',
      'always'
    ],
    'space-in-parens': [
      'error',
      'never'
    ],
    'array-bracket-spacing': [
      'error',
      'never'
    ],
    'block-spacing': 'error',
    'comma-spacing': 'error',
    'computed-property-spacing': [
      'error',
      'never'
    ],
    'func-call-spacing': 'error',
    'rest-spread-spacing': 'error',
    'arrow-spacing': 'error',
    'object-curly-spacing': 'error',
    'eol-last': [
      'error',
      'never'
    ],
    'lines-between-class-members': 'error'
  }
}