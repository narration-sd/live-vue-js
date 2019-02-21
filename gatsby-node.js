/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

// this is the essential to get public cleared on build
// you have to clear once after installing this, as all it does
// is prevent maps, which were apparently what was not overwritten/removed
// how do they think???
exports.onCreateWebpackConfig = ({ actions, stage }) => {
  // If production JavaScript and CSS build
  if (stage === 'build-javascript') {
    // Turn off source maps
    actions.setWebpackConfig({
      devtool: false,
    })
  }
};

// doesn't work as noted, but also, not employed until build??
/*
exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  rules.setWebpackConfig({ // unfortunately, none of the labels will run this
    module: {
      rules: [
        {
          resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                '@': resolve('src'),
            }
          },
        },
      ],
    }
  })
}
*/
