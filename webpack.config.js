module.exports = {
  entry: {
    loginPage: './client/LoginPage.jsx',
    editWorkoutsPage: './client/EditWorkoutsPage.jsx'
  },
  module: {
    loaders: [{
      loader: 'babel-loader',
      include: [
        __dirname + '/client'
      ],
      test: /\.jsx?$/,
      query: {
        presets: ['react']
      }
    }]
  },
  output: {
    filename: '[name].bundle.js',
    path: __dirname + '/public/javascript'
  },
  watchOptions: {
    poll: 1000
  }
};
