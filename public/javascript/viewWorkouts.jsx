"use strict";

let WorkoutBox = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  loadWorkoutsFromServer: function() {
    $.ajax({
      url: this.props.getUrl,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data.workouts});
      }.bind(this),
      failure: function(xhr, status, err) {
        console.err(this.props.getUrl, status, err.toString());
      }.bind(this)
    });
  },
  handleWorkoutUpdate: function(workout, errCallback) {
    $.ajax({
      url: this.props.updateUrl,
      method: 'POST',
      data: workout,
      dataType: 'json',
      failure: function(xhr, status, err) {
        console.err(this.props.url, status, err.toString());
      }.bind(this)
    }).done(function(response) {
      if (response.status === 'failure') {
        errCallback(response);
      }
    });
  },
  componentDidMount: function() {
    this.loadWorkoutsFromServer();
    setInterval(this.loadWorkoutsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="workoutBox">
        <h2>Submit a new Workout</h2>
        <WorkoutForm/>
        <h2>Workouts</h2>
        <WorkoutList
          data={this.state.data}
          onWorkoutUpdate={this.handleWorkoutUpdate}
        />
      </div>
    );
  }
});

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
        <div>Workout Date:
          <input
            type="text"
            defaultValue={this.state.date}
          />
        </div>
        <div>Squats:
          <input
            type="text"
            defaultValue={this.state.squats}
          />
        </div>
        <div>Bench Press:
          <input
            type="text"
            defaultValue={this.state.benchPress}
          />
        </div>
        <div>Barbell Rows:
          <input
            type="text"
            defaultValue={this.state.barbellRows}
          />
        </div>
        <div>Overhead Press:
          <input
            type="text"
            defaultValue={this.state.overheadPress}
          />
        </div>
        <div>Deadlifts:
          <input
            type="text"
            defaultValue={this.state.deadlifts}
          />
        </div>
        <input
          className="btn btn-default"
          type="submit"
          value="Submit"
          id="submitWorkout"
        />
      </form>
    );
  }
});

let WorkoutList = React.createClass({
  render: function() {
    let self = this;
    let workoutNodes = this.props.data.map(function(workout) {
      return (
        <Workout key={workout.id}
          date={moment(workout.date).format('MM-DD-YYYY')}
          squats={String(workout.squats)}
          benchPress={String(workout.bench_press)}
          barbellRows={String(workout.barbell_rows)}
          overheadPress={String(workout.overhead_press)}
          deadlifts={String(workout.deadlifts)}
          onWorkoutUpdate={self.props.onWorkoutUpdate}
        />
      );
    });
    return (
      <div className="workoutList">
        {workoutNodes}
      </div>
    );
  }
});

let Workout = React.createClass({
  getInitialState: function() {
    return {
      editing: false,
      date: this.props.date,
      squats: this.props.squats,
      benchPress: this.props.benchPress,
      barbellRows: this.props.barbellRows,
      overheadPress: this.props.overheadPress,
      deadlifts: this.props.deadlifts,
      errMessage: ''
    };
  },
  toggleEditingMode: function(e) {
    this.setState({
      editing: !this.state.editing
    });
  },
  handleInputChange: function(e) {
    let workoutType = e.target.id,
      newValue = e.target.value;
    this.setState({
      [workoutType]: newValue
    });
  },
  handleUpdate: function(e) {
    // Send an UPDATE request to the API server
    e.preventDefault();
    this.props.onWorkoutUpdate({
      squats: this.state.squats,
      bench_press: this.state.benchPress,
      barbell_rows: this.state.barbellRows,
      overhead_press: this.state.overheadPress,
      deadlifts: this.state.deadlifts,
      date: moment(this.state.date, 'MM-DD-YYYY').format('YYYY-MM-DD')
    }, function(err) {
      this.setState({
        errMessage: err.message
      });
    });
  },
  handleDelete: function(e) {
    // TODO: Send a DELETE request to the API server
  },
  render: function() {
    return (
      <form className="workout">
        <div>Date: {this.props.date}</div>
        <div>Squats:
          <input
            readOnly={!this.state.editing}
            defaultValue={this.props.squats}
            onChange={this.handleInputChange}
            id="squats"
          />
        </div>
        <div>Bench Press:
          <input
            readOnly={!this.state.editing}
            defaultValue={this.props.benchPress}
            onChange={this.handleInputChange}
            id="benchPress"
          />
        </div>
        <div>Barbell Rows:
          <input
            readOnly={!this.state.editing}
            defaultValue={this.props.barbellRows}
            onChange={this.handleInputChange}
            id="barbellRows"
          />
        </div>
        <div>Overhead Press:
          <input
            readOnly={!this.state.editing}
            defaultValue={this.props.overheadPress}
            onChange={this.handleInputChange}
            id="overheadPress"
          />
        </div>
        <div>Deadlifts:
          <input
            readOnly={!this.state.editing}
            defaultValue={this.props.deadlifts}
            onChange={this.handleInputChange}
            id="deadlifts"
          />
        </div>
        <input
          className="btn btn-default"
          type="button"
          value="Edit"
          id="editWorkout"
          onClick={this.toggleEditingMode}
        />
        {
          // If not editing, hide the submit and delete buttons
          this.state.editing ? [
            <input
              className="btn btn-default"
              type="button"
              value="Update"
              key="updateWorkout"
              onClick={this.handleUpdate}
            />,
            <input
              className="btn btn-default"
              type="button"
              value="Delete"
              key="deleteWorkout"
              onClick={this.handleDelete}
            />
          ] : null
        }
      </form>
    );
  }
});

ReactDOM.render(
  <WorkoutBox
    getUrl="/api/get-workouts"
    updateUrl="/api/update-workout"
    pollInterval={2000}
  />,
  document.getElementById('content')
);
