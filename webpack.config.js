module.exports = {
  entry: {
    editWorkoutsPage: './client/EditWorkoutsPage.jsx',
    loginPage: './client/LoginPage.jsx',
    statsPage: './client/StatsPage.jsx'
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
