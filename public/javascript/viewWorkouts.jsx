"use strict";

let WorkoutForm = React.createClass({
  getInitialState: function() {
    return {
      squats: 0,
      benchPress: 0,
      barbellRows: 0,
      overheadPress: 0,
      deadlifts: 0,
      date: moment().format('YYYY-MM-DD')
    }
  },
  render: function() {
    return (
      <form className="workoutForm" onSubmit={this.handleSubmit}>
        <label>Workout Date:
          <input
            type="text"
            value={this.state.date}
          />
        </label>
        <label>Squats:
          <input
            type="text"
            value={this.state.squats}
          />
        </label>
        <label>Bench Press:
          <input
            type="text"
            value={this.state.benchPress}
          />
        </label>
        <label>Barbell Rows:
          <input
            type="text"
            value={this.state.barbellRows}
          />
        </label>
        <label>Overhead Press:
          <input
            type="text"
            value={this.state.overheadPress}
          />
        </label>
        <label>Deadlifts:
          <input
            type="text"
            value={this.state.deadlifts}
          />
        </label>
      </form>
    );
  }
});

let WorkoutBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadWorkoutsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data.workouts});
      }.bind(this),
      failure: function(xhr, status, err) {
        console.err(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadWorkoutsFromServer();
    setInterval(this.loadWorkoutsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="workoutBox">
        <h1>Submit a new Workout</h1>
        <WorkoutForm/>
        <h1>Workouts</h1>
        <WorkoutList data={this.state.data} />
      </div>
    );
  }
});

let WorkoutList = React.createClass({
  render: function() {
    let workoutNodes = this.props.data.map(function(workout) {
      return (
        <Workout key={workout.id}
          date={moment(workout.date).format('MM-DD-YYYY')}
          squats={workout.squats}
          benchPress={workout.bench_press}
          barbellRows={workout.barbell_rows}
          overheadPress={workout.overhead_press}
          deadlifts={workout.deadlifts}
        />
      );
    });
    return (
      <div className="workoutList">
        <h1>This is a WorkoutList</h1>
        {workoutNodes}
      </div>
    );
  }
});

let Workout = React.createClass({
  render: function() {
    return (
      <div className="workout">
        This is a workout
        <div>Date: {this.props.date}</div>
        <div>Squats: {this.props.squats}</div>
        <div>Bench Press: {this.props.benchPress}</div>
        <div>Barbell Rows: {this.props.barbellRows}</div>
        <div>Overhead Press: {this.props.overheadPress}</div>
        <div>Deadlifts: {this.props.deadlifts}</div>
      </div>
    );
  }
});

ReactDOM.render(
  <WorkoutBox url="/api/get-workouts" pollInterval={2000}/>,
  document.getElementById('content')
);
