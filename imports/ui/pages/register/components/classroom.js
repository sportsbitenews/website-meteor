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

import CheckBox from './checkBox.js';

import {SUBJECTS, GRADES, EXPERIENCE_LEVELS} from '/imports/ui/pages/register/register.js';

/**
 * @param {function} next Callback for moving to the next screen
 *
 * @return {React.Component} the third screen in the registration page activity
 **/
export default class ClassroomPanel extends React.Component {
  constructor() {
    super();
    this.state = { SUBJECTS, GRADES, EXPERIENCE_LEVELS };
  }

  handleSchool() {}

  render() {
    return (
      <div>
        <CheckBox />
        <SchoolSelector onClick={this.handleSchool}/>
        <button className="enabled" onClick={this.props.onClick}>REGISTER NOW</button>
      </div>
    );
  }
}