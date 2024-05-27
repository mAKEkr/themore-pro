/* eslint-env node */
module.exports = {
  root: true,
  env: {
    'vue/setup-compiler-macros': true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-prototype-builtins': 'off'
  }
}
