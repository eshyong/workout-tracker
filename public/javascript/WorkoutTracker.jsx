'use strict';

let WorkoutBox = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  // Load workouts from the server to display
  loadWorkoutsFromServer: function() {
    $.ajax({
      url: this.props.getUrl,
      dataType: 'json',
      success: function(data) {
        this.setState({
          data: data.workouts
        });
      }.bind(this),
      failure: function(xhr, status, err) {
        console.err(this.props.getUrl, status, err.toString());
      }.bind(this)
    });
  },
  // Helper function for workout POST functions
  handlePost: function(url, workout, callback) {
    $.ajax({
      url: url,
      method: 'POST',
      data: workout,
      dataType: 'json',
      success: function(data) {
        callback(data);
      }.bind(this),
      failure: function(xhr, status, err) {
        console.err(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleWorkoutSubmit: function(workout, callback) {
    this.handlePost(this.props.submitUrl, workout, callback);
  },
  handleWorkoutUpdate: function(workout, callback) {
    this.handlePost(this.props.updateUrl, workout, callback);
  },
  handleWorkoutDelete: function(workout, callback) {
    this.handlePost(this.props.deleteUrl, workout, callback);
  },
  componentDidMount: function() {
    this.loadWorkoutsFromServer();
    setInterval(this.loadWorkoutsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="workoutBox">
        <h2>Submit a new Workout</h2>
        <WorkoutForm
          date={moment.utc()}
          squats="0"
          benchPress="0"
          barbellRows="0"
          overheadPress="0"
          deadlifts="0"
          onWorkoutSubmit={this.handleWorkoutSubmit}
        />
        <h2>Workouts</h2>
        <WorkoutList
          data={this.state.data}
          onWorkoutUpdate={this.handleWorkoutUpdate}
          onWorkoutDelete={this.handleWorkoutDelete}
        />
      </div>
    );
  }
});

let WorkoutForm = React.createClass({
  getInitialState: function() {
    return {
      // The data fields of a workout
      date: this.props.date,
      squats: this.props.squats,
      benchPress: this.props.benchPress,
      barbellRows: this.props.barbellRows,
      overheadPress: this.props.overheadPress,
      deadlifts: this.props.deadlifts,

      // These are set whenever an operation on a workout is performed,
      // such as an update or delete
      success: false,
      failure: false,
      successMessage: '',
      failureMessage: ''
    }
  },
  handleInputChange: function(e) {
    let workoutType = e.target.id,
      newValue = e.target.value;
    if (workoutType === 'date') {
      newValue = moment.utc(newValue);
    }
    this.setState({
      [workoutType]: newValue
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onWorkoutSubmit({
      squats: this.state.squats,
      bench_press: this.state.benchPress,
      barbell_rows: this.state.barbellRows,
      overhead_press: this.state.overheadPress,
      deadlifts: this.state.deadlifts,
      // Dates need to be in the MySQL format 'YYYY-MM-DD'
      date: this.state.date.format('YYYY-MM-DD')
    }, (response) => {
      // Set success or failure messages accordingly
      if (response.status === 'failure') {
        this.setState({
          success: false,
          failure: true,
          failureMessage: response.message
        });
      } else if (response.status === 'success') {
        this.setState({
          success: true,
          failure: false,
          successMessage: 'Successfully submitted workout.'
        });
      } else {
        console.log(`Unknown status: ${response.status}`);
      }
    });
  },
  render: function() {
    return (
      <div className="workoutForm">
        <form onSubmit={this.handleSubmit}>
          <div>Workout Date:
            <input
              type="date"
              defaultValue={this.state.date.format('YYYY-MM-DD')}
              onChange={this.handleInputChange}
              id="date"
            />
          </div>
          <div>Squats:
            <input
              type="text"
              defaultValue={this.state.squats}
              onChange={this.handleInputChange}
              id="squats"
            />
          </div>
          <div>Bench Press:
            <input
              type="text"
              defaultValue={this.state.benchPress}
              onChange={this.handleInputChange}
              id="benchPress"
            />
          </div>
          <div>Barbell Rows:
            <input
              type="text"
              defaultValue={this.state.barbellRows}
              onChange={this.handleInputChange}
              id="barbellRows"
            />
          </div>
          <div>Overhead Press:
            <input
              type="text"
              defaultValue={this.state.overheadPress}
              onChange={this.handleInputChange}
              id="overheadPress"
            />
          </div>
          <div>Deadlifts:
            <input
              type="text"
              defaultValue={this.state.deadlifts}
              onChange={this.handleInputChange}
              id="deadlifts"
            />
          </div>
          <input
            className="btn btn-default"
            type="submit"
            value="Submit"
            id="submitWorkout"
          />
        </form>
        {
          this.state.success ? (
            <div className="successMessage">{this.state.successMessage}</div>
          ) : null
        }
        {
          this.state.failure ? (
            <div className="failureMessage">{this.state.failureMessage}</div>
          ) : null
        }
      </div>
    );
  }
});

let WorkoutList = React.createClass({
  render: function() {
    let workoutNodes = this.props.data.map((workout) => {
      return (
        <Workout key={workout.id}
          date={moment.utc(workout.date)}
          squats={String(workout.squats)}
          benchPress={String(workout.bench_press)}
          barbellRows={String(workout.barbell_rows)}
          overheadPress={String(workout.overhead_press)}
          deadlifts={String(workout.deadlifts)}
          onWorkoutUpdate={this.props.onWorkoutUpdate}
          onWorkoutDelete={this.props.onWorkoutDelete}
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
      // A flag that specifies whether workout is in editing
      // mode or not
      editing: false,

      // The data fields of a workout
      date: this.props.date,
      squats: this.props.squats,
      benchPress: this.props.benchPress,
      barbellRows: this.props.barbellRows,
      overheadPress: this.props.overheadPress,
      deadlifts: this.props.deadlifts,

      // These are set whenever an operation on a workout is performed,
      // such as an update or delete
      success: false,
      failure: false,
      successMessage: '',
      failureMessage: ''
    };
  },
  toggleEditingMode: function(e) {
    this.setState({
      editing: !this.state.editing,
      success: false,
      failure: false,
      successMessage: '',
      failureMessage: ''
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
    this.props.onWorkoutUpdate({
      squats: this.state.squats,
      bench_press: this.state.benchPress,
      barbell_rows: this.state.barbellRows,
      overhead_press: this.state.overheadPress,
      deadlifts: this.state.deadlifts,
      // Dates need to be in the MySQL format 'YYYY-MM-DD'
      date: this.state.date.format('YYYY-MM-DD')
    }, (response) => {
      // Set success or failure messages accordingly
      if (response.status === 'failure') {
        this.setState({
          success: false,
          failure: true,
          failureMessage: response.message
        });
      } else if (response.status === 'success') {
        this.setState({
          success: true,
          failure: false,
          successMessage: 'Successfully updated workout.'
        });
      } else {
        console.log(`Unknown status: ${response.status}`);
      }
    });
  },
  handleDelete: function(e) {
    // Send a DELETE request to the API server
    this.props.onWorkoutDelete({
      // Dates need to be in the MySQL format 'YYYY-MM-DD'
      date: this.state.date.format('YYYY-MM-DD')
    }, (response) => {
      // Set success or failure messages accordingly
      if (response.status === 'failure') {
        this.setState({
          success: false,
          failure: true,
          failureMessage: response.message
        });
      } else if (response.status === 'success') {
        this.setState({
          success: true,
          failure: false,
          successMessage: 'Successfully deleted workout.'
        });
      } else {
        console.log(`Unknown status: ${response.status}`);
      }
    });
  },
  render: function() {
    return (
      <form className="workout">
        <div>Date: {this.props.date.format('MM-DD-YYYY')}</div>
        <div>Squats:
          {
            this.state.editing ? (
              <input
                defaultValue={this.state.squats}
                onChange={this.handleInputChange}
                id="squats"
              />
            ) : ` ${this.state.squats}`
          }
        </div>
        <div>Bench Press:
          {
            this.state.editing ? (
              <input
                defaultValue={this.state.benchPress}
                onChange={this.handleInputChange}
                id="benchPress"
              />
            ) : ` ${this.state.benchPress}`
          }
        </div>
        <div>Barbell Rows:
          {
            this.state.editing ? (
              <input
                defaultValue={this.state.barbellRows}
                onChange={this.handleInputChange}
                id="barbellRows"
              />
            ) : ` ${this.state.barbellRows}`
          }
        </div>
        <div>Overhead Press:
          {
            this.state.editing ? (
              <input
                defaultValue={this.state.overheadPress}
                onChange={this.handleInputChange}
                id="overheadPress"
              />
            ) : ` ${this.state.overheadPress}`
          }
        </div>
        <div>Deadlifts:
          {
            this.state.editing ? (
              <input
                defaultValue={this.state.deadlifts}
                onChange={this.handleInputChange}
                id="deadlifts"
              />
            ) : ` ${this.state.deadlifts}`
          }
        </div>
        <input
          className="btn btn-default"
          type="button"
          value="Edit"
          onClick={this.toggleEditingMode}
        />
        {
          // If not editing, hide the submit and delete buttons
          this.state.editing ? [
            <input
              className="btn btn-default"
              type="button"
              value="Update"
              onClick={this.handleUpdate}
              key="update"
            />,
            <input
              className="btn btn-default"
              type="button"
              value="Delete"
              onClick={this.handleDelete}
              key="delete"
            />
          ] : null
        }
        {
          this.state.success ? (
            <div className="successMessage">{this.state.successMessage}</div>
          ) : null
        }
        {
          this.state.failure ? (
            <div className="failureMessage">{this.state.failureMessage}</div>
          ) : null
        }
      </form>
    );
  }
});

ReactDOM.render(
  <WorkoutBox
    getUrl="/api/get-workouts"
    submitUrl="/api/submit-workout"
    updateUrl="/api/update-workout"
    deleteUrl="/api/delete-workout"
    pollInterval={2000}
  />,
  document.getElementById('content')
);
