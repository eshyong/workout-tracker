module.exports = {
  entry: {
    editWorkoutsPage: './client/EditWorkoutsPage.jsx',
    forgotPage: './client/ForgotPage.jsx',
    loginPage: './client/LoginPage.jsx',
    profilePage: './client/ProfilePage.jsx',
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
        presets: [
          'react',
          'es2015'
        ]
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
