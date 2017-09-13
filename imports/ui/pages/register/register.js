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

import SchoolSelector from '/imports/ui/components/schools/selector.js';
import FooterPanel from '/imports/ui/components/footer/footer.js';
import Strings from '/imports/api/strings/strings.js';
import Locations from '/imports/api/data/countryState.js';

import HeaderLine from './components/headerLine/headerLine.js';
import AccountTypePanel from './components/accountType.js';
import ContactInfoPanel from './components/contactInfo.js';
import OrganizationPanel from './components/organization.js';
import ClassroomPanel from './components/classroom.js';


import {PUBLIC_ORIGIN, MOUNT_PATH} from '/imports/api/data/constants.js';

import './register.css';

// List of user types for the AccountTypePanel
export const USER_TYPES = [ 'Teacher', 'Pre-service Teacher', 'Teacher Educator/Coach', 'Student', 'Researcher', 'Translator', 'Parent', 'Other' ];

export const SUBJECTS = [ "General Sciences", "Astronomy", "Earth Science", "Biology", "Physics", "Chemistry", "Math", "Other" ];
export const GRADES = [ "Elementary (K-5)", "Middle (6-8)", "High (9-12)", "University", "Other" ];
export const EXPERIENCE_LEVELS = [ "New User", "Occasional User (I've used a few sims)", "Experienced User (I regularly use sims)", "Power User (I tell everyone about PhET)" ]

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
      types: [],
      primaryEmail: '',
      secondaryEmail: '',
      password: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      twitterHandle: '',
      receiveEmail: true,
      organization: '',
      SUBJECTS: [],
      GRADES: [],
      teachingExperience: 0,
      phetExperience: null,
      school: '',
      deviceList: [],
      lmsList: [],
      curriculumProviderList: []
    }
  }

  switchLocale( locale ) {
    window.history.pushState(null, null, window.location.pathname.replace( '/' + this.state.locale + '/', '/' + locale + '/' ) );
    this.setState( {
      locale: locale,
      getString: Strings( registrationStrings, locale, this )
    } )
  }

  handleNext( userData ) {
    let newState = this.state;

    switch( newState.page ) {
      case 1:
        newState.types = userData.types;
        break;
      case 2:
        newState.primaryEmail = userData.primaryEmail;
        newState.secondaryEmail = userData.secondaryEmail;
        newState.password = userData.password;
        newState.firstName = userData.firstName;
        newState.lastName = userData.lastName;
        newState.country = userData.country;
        newState.state = userData.state;
        newState.city = userData.city;
        newState.zipCode = userData.zipCode;
        newState.twitterHandle = userData.twitterHandle;
        newState.receiveEmail = userData.receiveEmail;
        break;
      case 3:
        console.log( 'done' );
        // POST data to the website
        // Redirect user to the dest/home page
        return;
      default:
        break;
    }
    newState.page += 1;
    this.setState( newState );
  }

  render() {
    let contentPanel;
    let headerText;
    switch( this.state.page ) {
      case 1:
        headerText = 'Create Your PhET Account';
        contentPanel = <AccountTypePanel next={this.handleNext.bind(this)}/>;
        break;
      case 2:
        headerText = 'Tell Us About You';
        contentPanel = <ContactInfoPanel next={this.handleNext.bind(this)}/>;
        break;
      case 3:
        if ( this.state.types.indexOf( 'Teacher' ) >= 0 || this.state.types.indexOf( 'Pre-service Teacher' ) >= 0 ) {
          headerText = 'Tell Us About Your Classroom';
          contentPanel = <ClassroomPanel next={this.handleNext.bind(this)}/>;
        }
        else {
          headerText = 'Tell Us About Your Organization';
          contentPanel = <OrganizationPanel next={this.handleNext.bind(this)}/>;
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

// export const RegistrationPage = ( { locale } ) => {
//   return (
//     <Layout locale={locale}/>
//   );
// }
