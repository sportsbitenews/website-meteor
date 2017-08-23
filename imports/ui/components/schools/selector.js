// Copyright 2017, University of Colorado Boulder

/**
 * School Selector with autosuggest function
 * @author Matt Pennington
 *
 **/

import React from 'react';
import Autosuggest from 'react-autosuggest';

import {Schools} from '/imports/api/schools/schools.js';

import './selector.css';

const renderSuggestion = ( suggestion ) => (
  <div>
    <strong>{suggestion.name}</strong> {suggestion.name2}- {suggestion.city}, {suggestion.state}
  </div>
);

export default class SchoolSelector extends React.Component {
  constructor() {
    super();
    this.state = {
      search: new ReactiveVar( '' ), // Subscription parameter
      value: '', // current textarea value
      suggestions: [], //list of schools
      selection: null,
      highlight: null
    };

    // Change the subscription parameter whenever the user changes the selection text
    // and change state.value to show typed value in the textarea
    Tracker.autorun( ()=> {
      Meteor.subscribe( 'schools.public', this.state.search.get() );
      this.setState( {value: this.state.search.get()} );
    } );

    // Refresh the autocomplete options when new data is ready
    Tracker.autorun( ()=> {
      this.setState( {suggestions: Schools.find().fetch() } );
    } );
  }

  suggestionsContainsName = ( name ) => {
    for ( let i in this.state.suggestions ) {
      if ( this.state.suggestions.hasOwnProperty( i ) && this.state.suggestions[ i ].name === name ) {
        return true;
      }
    }
    return false;
  }

  // Update the search ReactiveVar to trigger subscription change
  onChange = (event, { newValue }) => {
    // User is highlighting a suggestion. Do not update subscription parameters.
    if ( this.suggestionsContainsName( newValue )) {

      this.setState( {value: newValue} );
    }
    // User is typing, update subscription parameters and clear the selection
    else {
      this.state.search.set( newValue );
      this.setState( {selection: null} );
    }
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    console.log('select')
    this.setState( { selection: suggestion } );
    // TODO: trigger callback passing this value to parent
  }

  render() {
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Enter your school name, city, or state',
      value: this.state.value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={this.state.suggestions}
        onSuggestionSelected={this.onSuggestionSelected}
        onSuggestionsFetchRequested={()=>{}} // fetch handled by search tracker
        onSuggestionsClearRequested={() => {}} // clear handled by search tracker
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}
