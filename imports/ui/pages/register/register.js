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

import {Meteor} from 'meteor/meteor';

import React from 'react';
import Helmet from 'react-helmet';

import FooterPanel from '/imports/ui/components/footer/footer.js';
import Strings from '/imports/api/strings/strings.js';
import {validate, User} from '/imports/api/users/users.js';

import HeaderLine from './components/headerLine/headerLine.js';
import AccountTypePanel from './components/accountType.js';
import ContactInfoPanel from './components/contactInfo.js';
import OrganizationPanel from './components/organization.js';
import ClassroomPanel from './components/classroom.js';

import '/imports/api/users/methods';

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
    };
  }

  switchLocale( locale ) {
    window.history.replaceState( null, null, window.location.href.replace( '/' + this.state.locale + '/', '/' + locale + '/' ) );
    this.setState( {
      locale: locale,
      getString: Strings( registrationStrings, locale, this )
    } )
  }

  handleNext( user ) {
    if ( this.state.page < 3 ) {
      this.setState( {
        user,
        page: this.state.page + 1
      } );
    }
    else {
      validate( user, ( errorMessages ) => {
        if ( errorMessages === null ) {
          Meteor.call( 'users.saveUser', { user }, ( error, userResult ) => {
            if ( error ) {
              console.log( 'Registration finished with errors:', error, user );
              // TODO: handle errors with server validation
            }
            else {
              console.log( 'method result: ', userResult );
              if ( !user.school._id || user.school._id === '' ) {
                Meteor.call( 'schools.insert', { userResult, school: user.school }, ( error, schoolResult ) => {
                  if ( error ) {
                    console.log( 'Registration finished with errors:', error, user );
                    // TODO: handle errors with school creation
                  }
                  else {
                    console.log( 'School added, result:', schoolResult );
                    Meteor.call( 'users.addSchool', { user, schoolId: schoolResult }, ( error, result ) => {
                      if ( error ) {
                        console.log( 'Registration finished with errors:', error, user );
                        // TODO: handle errors with user update after school creation
                      }
                      else {
                        this.redirectToConfirmationPage( userResult );
                      }
                    } );
                  }
                } );
              }
              else {
                this.redirectToConfirmationPage( userResult );
              }
            }
          } );
        }
        else {
          // TODO: handle errors with client validation
        }
      } );
    }
  }

  redirectToConfirmationPage( userResult ) {
    window.alert( 'Registration finished.  We will eventually redirect to the confirmation page now.' + userResult );
  }

  render() {
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
        if ( this.state.user.isTeacher() ) {
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
      <div className="registration-page">
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
