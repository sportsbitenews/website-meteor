// Copyright 2017, University of Colorado Boulder

/**
 * PhET Registration Page - Contact Info Panel
 * @author Matt Pennington
 *
 * @typedef {Object} React.Component
 * @property {function} setState
 *
 * @typedef {Object} component - a jsx component
 **/

import React from 'react';

import Locations from '/imports/api/data/countryState.js';

import CheckBox from './checkBox.js';

import {PUBLIC_ORIGIN} from '/imports/api/data/constants.js'

/**
 * @param {function} next Callback for moving to the next screen
 *
 * @return {React.Component} the second screen in the registration page activity
 **/
export default class ContactInfoPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      primaryEmail: '',
      confirmEmail: '',
      secondaryEmail: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      country: 'default',
      state: 'default',
      city: '',
      zipCode: '',
      twitterHandle: '',
      receiveEmail: true,
      errorMessages: [],
      errorFields: {}
    }
  }

  next( event ) {
    event.preventDefault();
    event.stopPropagation();

    let errorMessages = [];
    let errorFields = {};

    if ( !( this.state.primaryEmail.indexOf( '@' ) > 0 ) || this.state.primaryEmail.length < 5 ) {
      errorMessages.push( "Please enter a valid email address" );
      errorFields.primaryEmail = 1;
    }
    else if ( this.state.primaryEmail !== this.state.confirmEmail ) {
      errorMessages.push( "Please confirm email address" );
      errorFields.confirmEmail = 1;
    }

    if ( this.state.secondaryEmail.length > 0 && ( !( this.state.secondaryEmail.indexOf( '@' ) > 0 ) || this.state.secondaryEmail.length < 5 ) ) {
      errorMessages.push( "Please enter a valid secondary email address" );
      errorFields.secondaryEmail = 1;
    }

    //TODO: check if either email already exists in the database

    if ( this.state.password.length < 8 ) {
      errorMessages.push( "Password should be at least 8 characters" );
      errorFields.password = 1;
    }
    else if ( this.state.password !== this.state.confirmPassword ) {
      errorMessages.push( "Please confirm password" );
      errorFields.confirmPassword = 1;
    }

    if ( this.state.firstName.length <= 0 ) {
      errorMessages.push( "Please enter your first name" );
      errorFields.firstName = 1;
    }

    if ( this.state.lastName.length <= 0 ) {
      errorMessages.push( "Please enter your last name" );
      errorFields.lastName = 1;
    }

    if ( this.state.country === 'default' ) {
      errorMessages.push( "Please select a country" );
      errorFields.country = 1;
    }

    if ( this.state.state === 'default' ) {
      errorMessages.push( "Please select a state or province" );
      errorFields.state = 1;
    }

    if ( this.state.city.length <= 0 ) {
      errorMessages.push( "Please enter a city" );
      errorFields.city = 1;
    }

    if ( this.state.country === 'United States' && this.state.zipCode.length != 5 ) {
      errorMessages.push( "Please enter your 5 digit zip code" );
      errorFields.zipCode = 1;
    }

    HTTP.get(
      PUBLIC_ORIGIN + '/services/users',
      {
        params: {
          email: this.state.primaryEmail
        }
      },
      ( error, result ) => {
        if ( error ) {
          console.log( 'err:', error );
          return;
        }


        if ( result.data.userExists === "true" ) {
          errorMessages.push( "This email address has already been registered. Please check your inbox for a confirmation email." );
          errorFields.primaryEmail = 1;
        }

        if ( errorMessages.length > 0 ) {
          this.setState( { errorMessages, errorFields } );
          return;
        }

        this.props.next( {
          primaryEmail: this.state.primaryEmail,
          secondaryEmail: this.state.secondaryEmail,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          country: this.state.country,
          state: this.state.state,
          city: this.state.city,
          zipCode: this.state.zipCode,
          twitterHandle: this.state.twitterHandle,
          receiveEmail: this.state.receiveEmail,
          showEmailHelper: false
        } );
      }
    );
  }

  render() {
    return (
      <div className="contact_info_panel">
        <form
          onSubmit={ this.next.bind( this ) }>
          <div>
            <label>
              <span>Primary Email address</span>
              <input
                className={ this.state.errorFields.primaryEmail ? 'error' : '' }
                type="text"
                value={ this.state.primaryEmail }
                onChange={ (event) => { this.setState( { primaryEmail: event.target.value } ); } }
              />
            </label>
            <label>
              <span>Re-enter Primary Email address</span>
              <input
                className={ this.state.errorFields.confirmEmail ? 'error' : '' }
                type="text"
                value={ this.state.confirmEmail }
                onChange={ (event) => { this.setState( { confirmEmail: event.target.value } ); } }
              />
            </label>
          </div>
          <div>
            <label>
              <span style={{float: 'left'}}>Secondary Email address (optional)</span>
              <span style={{float: 'right', color: 'navy'}} onClick={ () => { this.setState( { showEmailHelper: !this.state.showEmailHelper } ); } }>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </span>
              <input
                className={ this.state.errorFields.secondaryEmail ? 'error' : '' }
                type="text"
                value={ this.state.secondary }
                onChange={ (event) => { this.setState( { secondary: event.target.value } ); } }
              />
              {
                this.state.showEmailHelper
                  ?
                <div className="helper_label">To ensure you can always access your account, we recommend adding a second personal email address</div>
                  : ''
              }
            </label>
          </div>
          <div>
            <label>
              <span>Password</span>
              <input
                className={ this.state.errorFields.password ? 'error' : '' }
                type="password"
                value={ this.state.password }
                onChange={ (event) => { this.setState( { password: event.target.value } ); } }
              />
            </label>
            <label>
              <span>Confirm Password</span>
              <input
                className={ this.state.errorFields.confirmPassword ? 'error' : '' }
                type="password"
                value={ this.state.confirmPassword }
                onChange={ (event) => { this.setState( { confirmPassword: event.target.value } ); } }
              />
            </label>
          </div>
          <div>{/*spacer*/}</div>
          <div>
            <label>
              <span>First Name</span>
              <input
                className={ this.state.errorFields.firstName ? 'error' : '' }
                type="text"
                value={ this.state.firstName }
                onChange={ (event) => { this.setState( { firstName: event.target.value } ); } }
              />
            </label>
          </div>
          <div>
            <label>
              <span>Last Name</span>
              <input className={ this.state.errorFields.lastName ? 'error' : '' }
                     type="text"
                     value={ this.state.lastName }
                     onChange={ (event) => { this.setState( { lastName: event.target.value } ); } }
              />
            </label>
          </div>
          <hr />
          <div>
            <label>
              <span>Country</span>
              <select
                className={ this.state.errorFields.country ? 'error' : '' }
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
                className={ this.state.errorFields.state ? 'error' : '' }
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
                className={ this.state.errorFields.city ? 'error' : '' }
                type="text"
                value={ this.state.city }
                onChange={ (event) => { this.setState( { city: event.target.value } ); } }
              />
            </label>
          </div>
          <div>
            <label className={this.state.country === 'United States of America' || this.state.country === 'default' ? 'hidden' : ''}>
              {/*TODO: hide if country !== USA */}
              <span>Zip code</span>
              <input
                className={ this.state.errorFields.zipCode ? 'error' : '' }
                type="text"
                value={ this.state.zipCode }
                onChange={ (event) => { this.setState( { zipCode: event.target.value } ); } }
              />
            </label>
          </div>
          <div>
            <label>
              <div><i className="fa fa-twitter" aria-hidden="true"></i>Twitter Handle (optional)</div>
            <span className="twitter_input">
              <input
                type="text"
                value={ this.state.twitterHandle }
                onChange={ (event) => { this.setState( { twitterHandle: event.target.value } ); } }
              />
            </span>
            </label>
          </div>
          <div>{/*spacer*/}</div>
          <div>
            <div className="email_header">Email Subscriptions</div>
            <label>
              <CheckBox
                key={"Receive PhET Emails"}
                name={"Receive PhET Emails"}
                checked={ true }
                onChange={() => this.setState( { receiveEmail: !this.state.receiveEmail } )}/>
            </label>
          </div>
          <div>{/*spacer*/}</div>
          <div className="error">
            {
              this.state.errorMessages.map( ( error, i ) => (
                <div key={'contact_error' + i }>
                  {error}
                </div> )
              )
            }
          </div>
          <button
            className="enabled"
            type="submit">
            NEXT
          </button>
        </form>
      </div>
    );
  }
}