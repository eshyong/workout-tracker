'use strict';

var moment = require('moment'),
    React = require('react');

var WorkoutForm = React.createClass({
  getInitialState: function() {
    return {
      // The data fields of a workout
      // If we receive NULL fields, turn them into "0"s
      date: this.props.date,
      squats: this.props.squats === 'null' ? '0' : this.props.squats,
      benchPress: this.props.benchPress === 'null' ? '0' : this.props.benchPress,
      barbellRows: this.props.barbellRows === 'null' ? '0' : this.props.barbellRows,
      overheadPress: this.props.overheadPress === 'null' ? '0' : this.props.overheadPress,
      deadlifts: this.props.deadlifts === 'null' ? '0' : this.props.deadlifts,

      // Specifies whether the workout is workout A or B in the stronglifts regime
      isTypeA: Boolean(this.props.isTypeA),

      // These are set whenever an operation on a workout is performed,
      // such as an update or delete
      success: '',
      failure: ''
    }
  },
  handleInputChange: function(e) {
    var workoutField = e.target.id,
      newValue = e.target.value;
    if (workoutField === 'date') {
      newValue = moment.utc(newValue);
    }
    this.setState({
      [workoutField]: newValue,
      success: '',
      failure: ''
    });
  },
  handleRequest: function(e, requestFunc, input, successMessage) {
    e.preventDefault();
    requestFunc(input, (response) => {
      // Set success or failure messages accordingly
      if (response.status === 'failure') {
        this.setState({
          success: '',
          failure: response.message
        });
      } else if (response.status === 'success') {
        this.setState({
          success: successMessage,
          failure: ''
        });
      } else {
        this.setState({
          success: '',
          failure: 'Unknown failure.'
        });
        console.error(`Unknown response data format: ${response}`);
      }
    });
  },
  handleSubmit: function(e) {
    var input = {
      squats: this.state.squats,
      // Specifies whether workout is type A or B
      is_type_a: this.state.isTypeA ? 1 : 0,
      // Dates need to be in the MySQL format 'YYYY-MM-DD'
      date: this.state.date.format('YYYY-MM-DD')
    };
    if (this.state.isTypeA) {
      input.bench_press = this.state.benchPress;
      input.barbell_rows = this.state.barbellRows;
      input.overhead_press = null;
      input.deadlifts = null;
    } else {
      input.overhead_press = this.state.overheadPress;
      input.deadlifts = this.state.deadlifts;
      input.bench_press = null;
      input.barbell_rows = null;
    }
    this.handleRequest(e, this.props.onWorkoutSubmit, input, 'Successfully submitted workout.');
  },
  handleUpdate: function(e) {
    var input = {
      squats: this.state.squats,
      // Specifies whether workout is type A or B
      is_type_a: this.state.isTypeA ? 1 : 0,
      // Dates need to be in the MySQL format 'YYYY-MM-DD'
      date: this.state.date.format('YYYY-MM-DD')
    };
    if (this.state.isTypeA) {
      input.bench_press = this.state.benchPress;
      input.barbell_rows = this.state.barbellRows;
      input.overhead_press = null;
      input.deadlifts = null;
    } else {
      input.overhead_press = this.state.overheadPress;
      input.deadlifts = this.state.deadlifts;
      input.bench_press = null;
      input.barbell_rows = null;
    }
    this.handleRequest(e, this.props.onWorkoutUpdate, input, 'Successfully updated workout.');
  },
  handleDelete: function(e) {
    var input = {
      // Dates need to be in the MySQL format 'YYYY-MM-DD'
      date: this.state.date.format('YYYY-MM-DD')
    };
    this.handleRequest(e, this.props.onWorkoutDelete, input, 'Successfully deleted workout.');
  },
  selectWorkoutType: function(e) {
    if (e.target.id === 'workoutA') {
      this.setState({
        isTypeA: true
      });
    } else if (e.target.id === 'workoutB') {
      this.setState({
        isTypeA: false
      });
    }
  },
  render: function() {
    var dataFields;
    if (this.state.isTypeA) {
      dataFields = ([
        <div key="date">Workout Date:
          <input
            type="date"
            defaultValue={this.state.date.format('YYYY-MM-DD')}
            onChange={this.handleInputChange}
            id="date"
          />
        </div>,
        <div key="squats">Squats:
          <input
            type="text"
            defaultValue={this.state.squats}
            onChange={this.handleInputChange}
            id="squats"
          />
        </div>,
        <div key="benchPress">Bench Press:
          <input
            type="text"
            defaultValue={this.state.benchPress}
            onChange={this.handleInputChange}
            id="benchPress"
          />
        </div>,
        <div key="barbellRows">Barbell Rows:
          <input
            type="text"
            defaultValue={this.state.barbellRows}
            onChange={this.handleInputChange}
            id="barbellRows"
          />
        </div>
      ]);
    } else {
      dataFields = ([
        <div key="date">Workout Date:
          <input
            type="date"
            defaultValue={this.state.date.format('YYYY-MM-DD')}
            onChange={this.handleInputChange}
            id="date"
          />
        </div>,
        <div key="squats">Squats:
          <input
            type="text"
            defaultValue={this.state.squats}
            onChange={this.handleInputChange}
            id="squats"
          />
        </div>,
        <div key="overheadPress">Overhead Press:
          <input
            type="text"
            defaultValue={this.state.overheadPress}
            onChange={this.handleInputChange}
            id="overheadPress"
          />
        </div>,
        <div key="deadlifts">Deadlifts:
          <input
            type="text"
            defaultValue={this.state.deadlifts}
            onChange={this.handleInputChange}
            id="deadlifts"
          />
        </div>
      ]);
    }
    return (
      <div className="WorkoutForm">
        <div
          style={
            {
              fontSize: '16px',
              marginTop: '10',
              marginBottom: '10',
            }
          }
        >
          Please choose either workout A or B.<br/>
          If you don't know what that means, please consult the<br/>
          <a href="http://stronglifts.com">Stronglifts</a> website.
        </div>
        <div id="workoutSelector">
          <button
            className={
              // If type A, this button has the :active pseudoclass
              this.state.isTypeA ? "btn btn-default active" : "btn btn-default"
            }
            id="workoutA"
            onClick={this.selectWorkoutType}
          >
            Workout A
          </button>
          <button
            className={
              // If type B, this button has the :active pseudoclass
              !this.state.isTypeA ? "btn btn-default active" : "btn btn-default"
            }
            id="workoutB"
            onClick={this.selectWorkoutType}
          >
            Workout B
          </button>
        </div>
        <div
          style={
            {
              fontSize: '16px',
              marginTop: '10',
              marginBottom: '10',
            }
          }
        >
          Please enter the weight in lb that you lifted for each exercise.
        </div>
        <form onSubmit={this.handleSubmit}>
          {dataFields}
          {
            // If the form is a "submitter" form, then it INSERTs workouts
            // If not, it UPDATEs or DELETEs them
            this.props.submitter ?
              (
                <input
                  className="btn btn-default"
                  type="submit"
                  value="Submit"
                />
              ) :
              (
                [
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
                ]
              )
          }
        </form>
        {
          this.state.success ? (
            <div className="successMessage">{this.state.success}</div>
          ) : (
            null
          )
        }
        {
          this.state.failure ? (
            <div className="failureMessage">{this.state.failure}</div>
          ) : (
            null
          )
        }
      </div>
    );
  }
});

module.exports = WorkoutForm;
