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
        this.setState({
          data: data.workouts
        });
      }.bind(this),
      failure: function(xhr, status, err) {
        console.err(this.props.getUrl, status, err.toString());
      }.bind(this)
    });
  },
  handleWorkoutUpdate: function(workout, handleResponse) {
    $.ajax({
      url: this.props.updateUrl,
      method: 'POST',
      data: workout,
      dataType: 'json',
      failure: function(xhr, status, err) {
        console.err(this.props.url, status, err.toString());
      }.bind(this)
    }).done(function(data) {
      handleResponse(data);
    });
  },
  handleWorkoutDelete: function(workout, handleResponse) {
    $.ajax({
      url: this.props.deleteUrl,
      method: 'POST',
      data: workout,
      dataType: 'json',
      failure: function(xhr, status, err) {
        console.err(this.props.url, status, err.toString());
      }.bind(this)
    }).done(function(data) {
      handleResponse(data);
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
          onWorkoutDelete={this.handleWorkoutDelete}
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
            type="date"
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
    let workoutNodes = this.props.data.map((workout) => {
      return (
        <Workout key={workout.id}
          date={moment(workout.date).format('MM-DD-YYYY')}
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
      date: moment(this.state.date, 'MM-DD-YYYY').format('YYYY-MM-DD')
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
      date: moment(this.state.date, 'MM-DD-YYYY').format('YYYY-MM-DD')
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
        <div>Date: {this.props.date}</div>
        <div>Squats:
          {
            this.state.editing ? (
              <input
                defaultValue={this.props.squats}
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
                defaultValue={this.props.benchPress}
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
                defaultValue={this.props.barbellRows}
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
                defaultValue={this.props.overheadPress}
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
                defaultValue={this.props.deadlifts}
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
            />,
            <input
              className="btn btn-default"
              type="button"
              value="Delete"
              onClick={this.handleDelete}
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
    updateUrl="/api/update-workout"
    deleteUrl="/api/delete-workout"
    pollInterval={2000}
  />,
  document.getElementById('content')
);
