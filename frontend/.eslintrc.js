module.exports = {
  'extends': [
    'react-app',
    'react-app/jest',
    'eslint:recommended'
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
    'no-extra-parens': ['error', 'all', {nestedBinaryExpressions: false}],
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