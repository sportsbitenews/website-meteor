// Copyright 2017, University of Colorado Boulder

import React from 'react';
import Modal from 'react-modal';

import ModalStyle from './modalStyle.js';
import Locations from '/imports/api/data/countryState.js';

/**
 * @param {Function} props.addSchool - Callback for saving school
 * @param {boolean} props.isOpen - flag to show the modal dialog
 *
 * @return {React.Component} the third screen in the registration page activity
 **/
export default class AddSchoolModal extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      country: '',
      state: '',
      city: ''
    }
  }

  onSubmit() {
    const errorMessages = {};

    if ( this.state.name.length < 1 ) {
      errorMessages.name = 'Please enter a name';
    }

    if ( this.country === 'default' || Locations.countries.indexOf( this.country ) < 0 ) {
      errorMessages.country = 'Please select a country';
    }
    else if ( this.state === 'default' || Locations.states[ Locations.countries.indexOf( this.country ) ].indexOf( this.state ) < 0 ) {
      errorMessages.state = 'Please select a state or province';
    }

    if ( this.city.length <= 0 ) {
      errorMessages.city = 'Please enter a city';
    }

    if ( Object.keys( errorMessages ).length === 0 && errorMessages.constructor === Object ) {
      this.props.addSchool( {
        name: this.state.name,
        country: this.state.country,
        state: this.state.state,
        city: this.state.city,
        isNew: true
      } );
    }
    else {
      this.setState( { errorMessages } );
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        style={ModalStyle}
        contentLabel="Tell us about your school">

        <h2>Add your school to our database</h2>
        <form onSubmit={ this.onSubmit.bind( this ) }>
          <div className="col-2">
            <label>
              <h4>School Name</h4>
              <div className="error">{ this.state.errorMessages && this.state.errorMessages.name }</div>
              <input
                type="text"
                value={ this.state.organization }
                className="organization"
                onChange={ (event) => { this.setState( { organization: event.target.value } ); } }
              />
            </label>
          </div>
          <div className="col-2">{/*spacer*/}</div>
          <div className="col-2">
            <label>
              <span>Country</span>
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.country }</span>
              <select
                className={ this.state.errorMessages && this.state.errorMessages.country ? 'error' : '' }
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
          <div className="col-2">
            <label>
              <span>State/Province</span>
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.state }</span>
              <select
                className={ this.state.errorMessages && this.state.errorMessages.state ? 'error' : '' }
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
          <div className="col-2">
            <label>
              <span>City</span>
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.city }</span>
              <input
                className={ this.state.errorMessages && this.state.errorMessages.city ? 'error' : '' }
                type="text"
                value={ this.state.city }
                onChange={ (event) => { this.setState( { city: event.target.value } ); } }
              />
            </label>
          </div>
          <button className="enabled" type="submit">ADD YOUR SCHOOL</button>

        </form>
      </Modal>
    )
  }
}