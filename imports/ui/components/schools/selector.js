// Copyright 2017, University of Colorado Boulder

/**
 * School Selector with autocomplete function
 * @author Matt Pennington
 *
 **/

import React from 'react';

import {Schools} from '/imports/api/schools/schools.js';

export default class SchoolSelector extends React.Component {
  constructor() {
    super();
    this.state = { search: new ReactiveVar( '' ) };
    Tracker.autorun( ()=> {
      console.log( this.state.search.get() );
    } );
  }

  handleChange( event ) {
    this.state.search.set( event.target.value );
  }

  render() {
    return (
      <div>
        <textarea value={this.state.search} onChange={this.handleChange} placeholder="Enter a school name, city, or state."/>
      </div>
    );
  }
}
