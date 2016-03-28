module.exports = {
  entry: {
    login: './client/Login.jsx',
    workoutTracker: './client/WorkoutTracker.jsx'
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
  }
};
