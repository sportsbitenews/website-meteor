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

/**
 * @param {Function} this.props.next - Callback for moving to the next screen
 * @param {User} this.props.user - Callback for moving to the next screen
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
      errorMessages: {}
    }
  }

  next( event ) {
    event.preventDefault();
    event.stopPropagation();

    const newUser = this.props.user;

    newUser.primaryEmail = this.state.primaryEmail;
    newUser.confirmEmail = this.state.confirmEmail;
    newUser.secondaryEmail = this.state.secondaryEmail;
    newUser.password = this.state.password;
    newUser.confirmPassword = this.state.confirmPassword;
    newUser.firstName = this.state.firstName;
    newUser.lastName = this.state.lastName;
    newUser.country = this.state.country;
    newUser.state = this.state.state;
    newUser.city = this.state.city;
    newUser.zipCode = this.state.zipCode;
    newUser.twitterHandle = this.state.twitterHandle;
    newUser.receiveEmail = this.state.receiveEmail;

    this.setState( { errorMessages: null } );

    newUser.validateContactInfo( ( user, errorMessages ) => {
      if ( errorMessages === null ) {
        this.props.next( user );
      }
      else {
        this.setState( { errorMessages } );
      }
    } );
  }

  render() {
    return (
      <div className="contact_info_panel">
        <form onSubmit={ this.next.bind( this ) }>
          <div>
            <label>
              <span>Primary Email address</span>
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.primaryEmail }</span>
              <input
                className={ this.state.errorMessages && this.state.errorMessages.primaryEmail ? 'error' : '' }
                type="text"
                value={ this.state.primaryEmail }
                onChange={ (event) => { this.setState( { primaryEmail: event.target.value } ); } }
              />
            </label>
            <label>
              <span>Re-enter Primary Email address</span>
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.confirmEmail }</span>
              <input
                className={ this.state.errorMessages && this.state.errorMessages.confirmEmail ? 'error' : '' }
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
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.secondaryEmail }</span>
              <input
                className={ this.state.errorMessages && this.state.errorMessages.secondaryEmail ? 'error' : '' }
                type="text"
                value={ this.state.secondary }
                onChange={ (event) => { this.setState( { secondary: event.target.value } ); } }
              />
              { this.state.showEmailHelper ?
                <div className="helper_label">To ensure you can always access your account, we recommend adding a second personal email
                  address</div> : '' }
            </label>
          </div>
          <div>
            <label>
              <span>Password</span>
              <span style={{float: 'right', color: 'navy'}} onClick={ () => { this.setState( { showEmailHelper: !this.state.showEmailHelper } ); } }>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </span>
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.password }</span>
              <input
                className={ this.state.errorMessages && this.state.errorMessages.password ? 'error' : '' }
                type="password"
                value={ this.state.password }
                onChange={ (event) => { this.setState( { password: event.target.value } ); } }
              />
              { this.state.showPasswordHelper ? <div className="helper_label">Passwords must be at least 8 characters long.</div> : '' }
            </label>
            <label>
              <span>Confirm Password</span>
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.confirmPassword }</span>
              <input
                className={ this.state.errorMessages && this.state.errorMessages.confirmPassword ? 'error' : '' }
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
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.firstName }</span>
              <input
                className={ this.state.errorMessages && this.state.errorMessages.firstName ? 'error' : '' }
                type="text"
                value={ this.state.firstName }
                onChange={ (event) => { this.setState( { firstName: event.target.value } ); } }
              />
            </label>
          </div>
          <div>
            <label>
              <span>Last Name</span>
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.lastName }</span>
              <input className={ this.state.errorMessages && this.state.errorMessages.lastName ? 'error' : '' }
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
          <div>
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
          <div>
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
          <div>
            <label className={this.state.country === 'United States of America' || this.state.country === 'default' ? 'hidden' : ''}>
              {/*TODO: hide if country !== USA */}
              <span>Zip code</span>
              <span className="error">{ this.state.errorMessages && this.state.errorMessages.zipCode }</span>
              <input
                className={ this.state.errorMessages && this.state.errorMessages.zipCode ? 'error' : '' }
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

          <button className="enabled" type="submit">NEXT</button>
        </form>
      </div>
    );
  }
}