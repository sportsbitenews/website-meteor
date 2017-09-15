// Copyright 2017, University of Colorado Boulder

/**
 * PhET Registration Page
 * @author Matt Pennington
 * TODO: implement translatability
 *
 * @typedef {Object} React.Component
 * @property {function} setState
 *
 * @typedef {Object} component - a jsx component
 **/

import React from 'react';
import Helmet from 'react-helmet';

import FooterPanel from '/imports/ui/components/footer/footer.js';
import Strings from '/imports/api/strings/strings.js';
import User from '/imports/api/users/users.js';

import HeaderLine from './components/headerLine/headerLine.js';
import AccountTypePanel from './components/accountType.js';
import ContactInfoPanel from './components/contactInfo.js';
import OrganizationPanel from './components/organization.js';
import ClassroomPanel from './components/classroom.js';


import {PUBLIC_ORIGIN, MOUNT_PATH} from '/imports/api/data/constants.js';

import './register.css';

const registrationStrings = [];

/**
 * @return {React.Component} main class
 **/
export default class RegistrationPage extends React.Component {
  constructor( props ) {
    super( props );

    this.state = {
      locale: this.props.locale,
      getString: Strings( registrationStrings, this.props.locale, this ),
      page: 1,
      user: new User()
    }
  }

  switchLocale( locale ) {
    window.history.replaceState( null, null, window.location.href.replace( '/' + this.state.locale + '/', '/' + locale + '/' ) );
    this.setState( {
      locale: locale,
      getString: Strings( registrationStrings, locale, this )
    } )
  }

  handleNext( user ) {
    console.log( 'handling next: ', user, this.state.page );
    if ( this.state.page < 3 ) {
      this.setState( {
        user,
        page: this.state.page + 1
      } );
    }
    else {
      user.validate( ( user, errorMessages ) => {
        if ( errorMessages === null ) {
          console.log( 'finished without errors.' );
          //TODO: submit user to database
          window.location = this.props.dest;
        }
        else {
          //TODO: handle validation errors
          console.log( 'finished with errors.' )
        }
      } )
    }
  }

  render() {
    console.log('rendering page: ', this.state.page );
    let contentPanel;
    let headerText;
    switch( this.state.page ) {
      case 1:
        headerText = 'Create Your PhET Account';
        contentPanel = <AccountTypePanel next={this.handleNext.bind(this)} user={this.state.user}/>;
        break;
      case 2:
        headerText = 'Tell Us About You';
        contentPanel = <ContactInfoPanel next={this.handleNext.bind(this)} user={this.state.user}/>;
        break;
      case 3:
        if ( this.state.user.types.indexOf( 'Teacher' ) >= 0 || this.state.user.types.indexOf( 'Pre-service Teacher' ) >= 0 ) {
          headerText = 'Tell Us About Your Classroom';
          contentPanel = <ClassroomPanel next={this.handleNext.bind(this)} user={this.state.user}/>;
        }
        else {
          headerText = 'Tell Us About Your Organization';
          contentPanel = <OrganizationPanel next={this.handleNext.bind(this)} user={this.state.user}/>;
        }
        break;
      default:
        headerText = '';
        contentPanel = <div>Error in contentPanel index</div>;
    }

    return (
      <div>
        <Helmet>
          <title>Register</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
        </Helmet>

        <div id="sign-in">
          <span>Already Registered?</span>
          {/* TODO: Handle locale and dest */}
          <a className="button disabled" href={ PUBLIC_ORIGIN + '/' + this.props.locale + '/' + 'sign-in' }>SIGN IN</a>
        </div>

        <div id="header">
          <img src={ MOUNT_PATH + '/img/phet_registration_logo.png' } alt="PhET Logo"/>
          <h1>{headerText}</h1>
          <HeaderLine page={this.state.page}/>
        </div>

        <div id="content">
          {contentPanel}
        </div>

        <FooterPanel locale={ this.state.locale } switchLocale={ this.switchLocale.bind( this ) }/>
      </div>
    );
  }
}
