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
    this.state = {
      search: new ReactiveVar( '' ),
      results: []
    };
    Tracker.autorun( ()=> {
      Meteor.subscribe( 'schools.public', this.state.search.get() );
    } );
    Tracker.autorun( ()=> {
      console.log( 'found new results' );
      const newState = this.state;
      newState.results = Schools.find().fetch()
      this.setState( newState );
    } );
  }

  handleChange( event ) {
    this.state.search.set( event.target.value );
  }

  render() {
    return (
      <div>
        <textarea onChange={this.handleChange.bind(this)} placeholder="Enter a school name, city, or state."/>
        <ListView
          dataSource={this.state.results}
          renderRow={(rowData) => <Text>{rowData.name}</Text>}
        />
      </div>
    );
  }
}
