// Copyright 2017, University of Colorado Boulder

/**
 * PhET Registration Page - Classroom Panel
 * @author Matt Pennington
 *
 * @typedef {Object} React.Component
 * @property {function} setState
 *
 * @typedef {Object} component - a jsx component
 **/

import React from 'react';
import Modal from 'react-modal';

import SchoolSelector from '/imports/ui/components/schools/selector';
import AddSchoolModal from './addSchoolModal';

// import CheckBox from './checkBox.js';
// import {SUBJECTS_ARRAY, GRADES_ARRAY, EXPERIENCE_LEVELS_ARRAY} from '/imports/api/users/users.js';

/**
 * @param {Function} props.next - Callback for moving to the next screen
 *
 * @return {React.Component} the third screen in the registration page activity
 **/
export default class ClassroomPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      school: null,
      showSchoolCreateDialog: false
    };
  }

  /**
   * @param {School} school - called when user has selected a school in the SchoolSelector element
   */
  handleSchoolSelection( school ) {
    this.setState( { school } );
  }

  openAddSchoolModal() {
    if ( !this.state.school || !this.state.school.isNew ) {
      this.setState( { showSchoolCreateDialog: true } )
    }
  }

  /**
   * Add school form onSubmit callback
   */
  addSchool( school ) {
    this.setState({school, showSchoolCreateDialog: false});
  }

  /**
   * Main form onSubmit callback
   * @param event
   */
  onSubmit( event ) {
    event.preventDefault();
    event.stopPropagation();

    this.setState( { errorMessages: null } );

    this.props.user.school = this.state.school;

    this.props.user.validateClassroom( ( user, errorMessages ) => {
      if ( errorMessages === null ) {
        this.props.next( user );
      }
      else {
        window.scrollTo( 0, 340 );
        this.setState( { errorMessages } );
      }
    } );
  }

  render() {
    return (
      <div>
        <form onSubmit={ this.onSubmit.bind( this ) }>
          <div className="col-1">
            <label>
              <h4>School</h4>
              <div className="error">{ this.state.errorMessages && this.state.errorMessages.school }</div>
              <SchoolSelector callback={ this.handleSchoolSelection.bind( this ) } school={ this.state.school } />
              <a onClick={ this.openAddSchoolModal.bind( this ) }>Can&quot;t find your school?</a>
            </label>
          </div>

          <button className="enabled" type="submit">REGISTER NOW</button>

          <AddSchoolModal
            isOpen={ this.state.showSchoolCreateDialog }
            addSchool={ this.addSchool.bind( this ) }
          />
        </form>
      </div>
    );
  }
}
