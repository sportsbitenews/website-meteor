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

import SchoolSelector from '/imports/ui/components/schools/selector.js';

import CheckBox from './checkBox.js';

import {SUBJECTS_ARRAY, GRADES_ARRAY, EXPERIENCE_LEVELS_ARRAY} from '/imports/api/users/users.js';

/**
 * @param {function} next Callback for moving to the next screen
 *
 * @return {React.Component} the third screen in the registration page activity
 **/
export default class ClassroomPanel extends React.Component {
  constructor() {
    super();
    this.state = { SUBJECTS_ARRAY, GRADES_ARRAY, EXPERIENCE_LEVELS_ARRAY };
  }

  handleSchool() {}

  next( event ) {
    event.preventDefault();
    event.stopPropagation();

    this.setState( { errorMessages: null } );

    this.props.user.validateOrganization( ( user, errorMessages ) => {
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
        <form onSubmit={this.next.bind(this)}>
          <CheckBox />
          <SchoolSelector callback={ this.handleSchool.bind(this) } />
          <button className="enabled" type="submit">REGISTER NOW</button>
        </form>
      </div>
    );
  }
}