const withCSS       = require('@zeit/next-css');
const withImages    = require('next-images');

module.exports = withImages(
    withCSS({
        useFileSystemPubilcRoutes: false,
        publivRuntimeConfig: {
            PORT: parseInt(process.env.PORT, 10) || 3000
        },
        webpack: (config, { buildId, dev }) => {
          // This allows the app to refer to files through our symlink
          config.resolve.symlinks = false
          return config
        }
    })
)
  