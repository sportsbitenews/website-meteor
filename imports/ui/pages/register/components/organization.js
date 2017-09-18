// Copyright 2017, University of Colorado Boulder

/**
 * PhET Registration Page - Organization Panel
 * @author Matt Pennington
 *
 * @typedef {Object} React.Component
 * @property {function} setState
 *
 * @typedef {Object} component - a jsx component
 **/

import React from 'react';

import CheckBox from './checkBox.js';

import {SUBJECTS_ARRAY, GRADES_ARRAY, EXPERIENCE_LEVELS_ARRAY} from '/imports/api/users/users.js';

/**
 * @param {function} next Callback for moving to the next screen
 *
 * @return {React.Component} the third screen in the registration page activity
 **/
export default class OrganizationPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      organization: '',
      subjectsSelected: new Array( SUBJECTS_ARRAY.length ).fill( false ),
      gradesSelected: new Array( SUBJECTS_ARRAY.length ).fill( false ),
      phetExperience: '',
      teachingExperience: ''
    }
  }

  updateSubjectsSelected( subjectName ) {
    const subjectsSelected = this.state.subjectsSelected;
    const index = SUBJECTS_ARRAY.indexOf( subjectName );
    subjectsSelected[ index ] = !subjectsSelected[ index ];
    this.setState( { subjectsSelected } );
  }

  updateGradesSelected( gradeName ) {
    const gradesSelected = this.state.gradesSelected;
    const index = GRADES_ARRAY.indexOf( gradeName );
    gradesSelected[ index ] = !gradesSelected[ index ];
    this.setState( { gradesSelected } );
  }

  next( event ) {
    event.preventDefault();
    event.stopPropagation();

    this.setState( { errorMessages: null } );

    this.props.user.organization = this.state.organization.trim();
    this.state.subjectsSelected.forEach( ( isSelected, index ) => {
      if ( isSelected ) {
        this.props.user.subjects.push( SUBJECTS_ARRAY[ index ] );
      }
    } );
    this.state.gradesSelected.forEach( ( isSelected, index ) => {
      if ( isSelected ) {
        this.props.user.grades.push( GRADES_ARRAY[ index ] );
      }
    } );
    this.props.user.teachingExperience = parseInt( this.state.teachingExperience );
    this.props.user.phetExperience = this.state.phetExperience;
    
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
    const subjectItems = SUBJECTS_ARRAY.map( ( subject ) => {
      return (
        <li key={subject}>
          <CheckBox name={subject} onChange={() => this.updateSubjectsSelected( subject )}/>
        </li>
      );
    } );

    const gradeItems = GRADES_ARRAY.map( ( grade ) => {
      return (
        <li key={grade}>
          <CheckBox name={grade} onChange={() => this.updateGradesSelected( grade )}/>
        </li>
      );
    } );

    const experienceItems = EXPERIENCE_LEVELS_ARRAY.map( ( experience ) => {
      return (
        <li key={experience}>
          <label>
            <input type="radio" name="experience" onClick={ () => this.setState( { experience } ) }/>
            { experience }
          </label>
        </li>
      );
    } );

    return (
      <div className="organization_panel">
        <form onSubmit={this.next.bind(this)}>
          <div className="col-1">
            <label>
              <h4>Organization</h4>
              <div className="error">{ this.state.errorMessages && this.state.errorMessages.organization }</div>
              <input
                type="text"
                value={ this.state.organization }
                className="organization"
                onChange={ (event) => { this.setState( { organization: event.target.value } ); } }
              />
            </label>
          </div>
          <div className="col-3">
            <h4>Subject(s)</h4>
            <div className="error">{ this.state.errorMessages && this.state.errorMessages.subjects }</div>
            <ul id={'subject-checkbox-list'}>
              {subjectItems}
            </ul>
          </div>
          <div className="col-3">
            <h4>Grade(s)</h4>
            <div className="error">{ this.state.errorMessages && this.state.errorMessages.grades }</div>
            <ul id={'grade-checkbox-list'}>
              {gradeItems}
            </ul>
          </div>
          <div className="col-3">
            <label>
              <h4>Teaching Experience</h4>
              <div className="error">{ this.state.errorMessages && this.state.errorMessages.teachingExperience }</div>
              <input
                type="number"
                value={ this.state.teachingExperience }
                className="experience"
                onChange={ (event) => { this.setState( { teachingExperience: parseInt( event.target.value ) } ); } }
              />
              <span>years</span>
            </label>
          </div>
          <div className="col-2">
            <label>
              <h4>PhET Experience</h4>
              <div className="error">{ this.state.errorMessages && this.state.errorMessages.phetExperience }</div>
              <ul>
                {experienceItems}
              </ul>
            </label>
          </div>
          <button className="enabled register" type="submit">REGISTER NOW</button>
          <span className="registration_warning">By clicking register, you agree to the University of Colorado&quot;s privacy policy</span>
        </form>
      </div>
    );
  }
}