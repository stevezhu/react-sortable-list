module.exports = {
  stories: ['../src/**/*.stories.[tj]sx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-storysource'],
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: ['babel-loader', 'ts-loader', 'react-docgen-typescript-loader'],
    })
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  },
}
