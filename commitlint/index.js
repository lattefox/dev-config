// Conventional Commits 规则；不依赖 @commitlint/config-conventional，避免跨包解析 parserPreset
// 允许中文描述：不限制 subject 大小写

const types = [
  'feat',
  'fix',
  'refactor',
  'perf',
  'docs',
  'test',
  'build',
  'ci',
  'chore',
  'style',
  'revert',
]

export default {
  rules: {
    'type-enum': [2, 'always', types],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', ['.', '。']],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
  },
}
