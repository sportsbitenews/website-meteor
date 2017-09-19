// Copyright 2017, University of Colorado Boulder

/**
 * PhET Schools Administration Page
 * @author Matt Pennington
 *
 * @typedef {Object} React.Component
 * @property {function} setState
 *
 * @typedef {Object} component - a jsx component
 **/

import React from 'react';
import Helmet from 'react-helmet';

import {Schools} from '/imports/api/schools/schools.js';
import Locations from '/imports/api/data/countryState.js';

const PAGE_SIZE = 20;

/**
 * @return {React.Component} main class
 **/
export default class SchoolsAdministrationPage extends React.Component {
  constructor() {
    super();
    this.state = {
      searchTerm: '',
      country: 'default',
      state: 'default',
      city: '',
      schools: [],
      pageNumber: 1,
      count: 0
    };


    // Refresh the autocomplete options when new data is ready
    Tracker.autorun( () => {
      this.setState( { schools: Schools.find().fetch() } );
    } );

    Tracker.autorun( () => {
      this.setState( { count: Counts.get( 'schools.admin.count' ) } );
    } );
  }

  editSchool( school ) {
    if ( school.ncesId ) {
      window.alert( 'NCES Schools cannot be edited' );
      return;
    }
    else {
      // TODO: show modal popup to edit school
    }
  }

  replaceSchool( school ) {
    if ( school.ncesId ) {
      window.alert( 'NCES Schools cannot be replaced' );
      return;
    }
    if ( school.parent ) {
      school.parent = undefined;
      // TODO: save changes
    }
    else {
      // TODO: show modal popup asking for parent
    }
  }

  deleteSchool( school ) {
    if ( school.ncesId ) {
      window.alert( 'NCES Schools cannot be deleted' );
      return;
    }
    else {
      // TODO: confirm delete
      // TODO: call to wicket to replace this school with "No School Identified"
    }
  }

  renderSchool( school ) {
    let className = 'school table-row';
    if ( school.ncesId ) {
      className += ' nces';
    }
    else if ( school.parent ) {
      className += ' replaced';
    }
    else if ( school.validatedDate ) {
      className += ' valid';
    }
    else {
      className += ' invalid';
    }

    return (
      <div className={className}>
        <span className="table-cell edit"
              title="Edit School"
              onClick={ () => this.editSchool(school) }>
          <i className="fa fa-pencil" aria-hidden="true"></i></span>
        <span className="table-cell replace"
              title={ ( school.parent ? 'Restore' : 'Replace' ) + ' School' }
              onClick={ () => this.replaceSchool(school) }>
          <i className={ 'fa fa-' + ( school.parent ? 'unlink' : 'link' ) } aria-hidden="true"></i></span>
        <span className="table-cell delete"
              title="Delete School"
              onClick={ () => this.deleteSchool(school) }>
          <i className="fa fa-trash" aria-hidden="true"></i></span>
        <span className="table-cell id">{school._id}</span>
        <span className="table-cell ncesId">{school.ncesId}</span>
        <span className="table-cell name">{school.name}</span>
        <span className="table-cell name2">{school.name2}</span>
        <span className="table-cell city">{school.city}</span>
        <span className="table-cell state">{school.state}</span>
        <span className="table-cell country">{school.country}</span>
        <span className="table-cell validatedDate">{school.validatedDate}</span>
        <span className="table-cell user">{school.user}</span>
        <span className="table-cell editDate">{school.editDate}</span>
        <span className="table-cell parent">{school.parent}</span>
      </div>
    )
  }

  search( event ) {
    event.preventDefault();
    event.stopPropagation();

    this.setState( { pageNumber: 1 } );
    Meteor.subscribe( 'schools.admin', {
      searchTerm: this.state.searchTerm,
      country: this.state.country,
      state: this.state.state,
      city: this.state.city,
      pageNumber: this.state.pageNumber
    } );
  }

  pageBack() {
    if ( this.state.pageNumber > 1 ) {
      this.setState( { pageNumber: this.state.pageNumber - 1 } );
      Meteor.subscribe( 'schools.admin', {
        searchTerm: this.state.searchTerm,
        country: this.state.country,
        state: this.state.state,
        city: this.state.city,
        pageNumber: this.state.pageNumber
      } );
    }


  }

  pageForward() {
    if ( this.state.pageNumber * PAGE_SIZE < this.state.count ) {
      this.setState( { pageNumber: this.state.pageNumber - 1 } );
      Meteor.subscribe( 'schools.admin', {
        searchTerm: this.state.searchTerm,
        country: this.state.country,
        state: this.state.state,
        city: this.state.city,
        pageNumber: this.state.pageNumber
      } );
    }
  }

  render() {
    return (
      <div className="schools admin">
        <Helmet>
          <title>School Administration</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
        </Helmet>

        <form onSubmit={ this.search.bind( this ) }>
          <div>
            <label>
              <span>Name/ID Search</span>
              <input
                type="text"
                value={ this.state.searchTerm }
                onChange={ (event) => { this.setState( { searchTerm: event.target.value } ); } }
              />
            </label>
          </div>
          <div>
            <label>
              <span>Country</span>
              <select
                value={ this.state.country }
                onChange={ (event) => { this.setState( { country: event.target.value } ); } }>
                <option value="default" disabled>Select your country</option>
                {
                  Locations.countries.map( ( country ) => (
                    <option key={country} value={country}>{country}</option>
                  ) )
                }
              </select>
            </label>
          </div>
          <div>
            <label>
              <span>State/Province</span>
              <select
                value={ this.state.state }
                onChange={ (event) => { this.setState( { state: event.target.value } ); } }>
                <option value="default" disabled>Select your state</option>
                {
                  this.state.country !== 'default'
                    ? Locations.states[ Locations.countries.indexOf( this.state.country ) ].map( ( state ) => (
                    <option key={state} value={state}>{state}</option>
                  ) )
                    : ''
                }
              </select>
            </label>
          </div>
          <div>
            <label>
              <span>City</span>
              <input
                type="text"
                value={ this.state.city }
                onChange={ (event) => { this.setState( { city: event.target.value } ); } }
              />
            </label>
          </div>
          <button className="enabled" type="submit">Search</button>
        </form>

        <div className="Search Results">
          <div className="table-header">
            <span className="header-cell">Edit</span>
            <span className="header-cell">Replace</span>
            <span className="header-cell">Delete</span>
            <span className="header-cell">ID</span>
            <span className="header-cell">NCES ID</span>
            <span className="header-cell">Name</span>
            <span className="header-cell">Name2</span>
            <span className="header-cell">City</span>
            <span className="header-cell">State</span>
            <span className="header-cell">Country</span>
            <span className="header-cell">Validated Date</span>
            <span className="header-cell">User</span>
            <span className="header-cell">Edited Date</span>
            <span className="header-cell">Parent ID</span>
          </div>
          <div className="table-body">
            { schools.map( ( school ) => { return this.renderSchool( school ) } ) }
          </div>
          <button className="previous" onClick={ this.pageBack.bind( this ) }>PREVIOUS</button>
          <button className="next" onClick={ this.pageForward.bind( this ) }>NEXT</button>
        </div>
      </div>
    );
  }
}
