const presets = [
  [
    '@babel/preset-env',
    {
      targets: 'last 2 Chrome versions',
    },
  ],
]
const plugins = []

module.exports = { presets, plugins }
