// Copyright 2017, University of Colorado Boulder


/**
 * PhET Users
 * @author Matt Pennington
 *
 * @typedef {Object} ErrorMessages
 * @property {String} fieldName - there is one member for each field that has an error
 *
 * @callback validationCallback
 * @param {User} user - a member of the class defined by this file
 * @param {ErrorMessages} errors - this parameter will be null if the user passed the current validation step
 **/

import Locations from '../data/countryState';
import {PUBLIC_ORIGIN} from '../data/constants';

export const USER_TYPES_CONSTANTS = {
  TEACHER: 'Teacher',
  PRE_SERVICE_TEACHER: 'Pre-service Teacher',
  TEACHER_EDUCATOR_COACH: 'Teacher Educator/Coach',
  STUDENT: 'Student',
  RESEARCHER: 'Researcher',
  TRANSLATOR: 'Translator',
  PARENT: 'Parent',
  OTHER: 'Other'
};

export const USER_TYPES_ARRAY = [
  USER_TYPES_CONSTANTS.TEACHER,
  USER_TYPES_CONSTANTS.PRE_SERVICE_TEACHER,
  USER_TYPES_CONSTANTS.TEACHER_EDUCATOR_COACH,
  USER_TYPES_CONSTANTS.STUDENT,
  USER_TYPES_CONSTANTS.RESEARCHER,
  USER_TYPES_CONSTANTS.TRANSLATOR,
  USER_TYPES_CONSTANTS.PARENT,
  USER_TYPES_CONSTANTS.OTHER
];

export const SUBJECTS_CONSTANTS = {
  GENERAL_SCIENCES: 'General Sciences',
  ASTRONOMY: 'Astronomy',
  EARTH_SCIENCE: 'Earth Science',
  BIOLOGY: 'Biology',
  PHYSICS: 'Physics',
  CHEMISTRY: 'Chemistry',
  MATH: 'Math',
  OTHER: 'Other'
};

export const SUBJECTS_ARRAY = [
  SUBJECTS_CONSTANTS.GENERAL_SCIENCES,
  SUBJECTS_CONSTANTS.ASTRONOMY,
  SUBJECTS_CONSTANTS.EARTH_SCIENCE,
  SUBJECTS_CONSTANTS.BIOLOGY,
  SUBJECTS_CONSTANTS.PHYSICS,
  SUBJECTS_CONSTANTS.CHEMISTRY,
  SUBJECTS_CONSTANTS.MATH,
  SUBJECTS_CONSTANTS.OTHER
];

export const GRADES_CONSTANTS = {
  ELEMENTARY: 'Elementary (K-5)',
  MIDDLE: 'Middle (6-8)',
  HIGH: 'High (9-12)',
  UNIVERSITY: 'University',
  OTHER: 'Other'
};

export const GRADES_ARRAY = [
  GRADES_CONSTANTS.ELEMENTARY,
  GRADES_CONSTANTS.MIDDLE,
  GRADES_CONSTANTS.HIGH,
  GRADES_CONSTANTS.UNIVERSITY,
  GRADES_CONSTANTS.OTHER
];

export const EXPERIENCE_LEVELS_CONSTANTS = {
  NEW: 'New User',
  OCCASIONAL: 'Occasional User (I\'ve used a few sims)',
  EXPERIENCED: 'Experienced User (I regularly use sims)',
  POWER: 'Power User (I tell everyone about PhET)'
};

export const EXPERIENCE_LEVELS_ARRAY = [
  EXPERIENCE_LEVELS_CONSTANTS.NEW,
  EXPERIENCE_LEVELS_CONSTANTS.OCCASIONAL,
  EXPERIENCE_LEVELS_CONSTANTS.EXPERIENCED,
  EXPERIENCE_LEVELS_CONSTANTS.POWER
];

/**
 * @param {Array} candidate
 * @param {Array} model
 * @returns {boolean} - returns true if candidate is a subset of model
 */
const arrayIsValid = ( candidate, model ) => {
  let isValid = true;
  if ( candidate.length && candidate.length > 0 ) {
    candidate.forEach( ( type ) => {
      if ( model.includes( type ) ) {
        isValid = false;
      }
    } );
  }
  else {
    isValid = false;
  }

  return isValid;
};

export default class User {
  constructor() {
    this.types = [];
    this.primaryEmail = '';
    this.secondaryEmail = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.country = '';
    this.state = '';
    this.city = '';
    this.zipCode = '';
    this.twitterHandle = '';
    this.receiveEmail = true;
    this.organization = '';
    this.subjects = [];
    this.grades = [];
    this.teachingExperience = 0;
    this.phetExperience = null;
    this.school = '';
    this.deviceList = [];
    this.lmsList = [];
    this.curriculumProviderList = [];
  }

  /**
   * Checks if this user is valid.  If validation fails at any step, the callback is called.
   *
   * @param {validationCallback} callback
   */
  validate( callback ) {
    this.validateAccountTypes( ( user, errorMessages ) => {
      if ( errorMessages === null ) {
        this.validateContactInfo( ( user, errorMessages ) => {
          if ( errorMessages === null ) {
            this.validateAdditionalInfo( callback );
          }
          else {
            callback( user, errorMessages );
          }
        } );
      }
      else {
        callback( user, errorMessages );
      }
    } );
  }

  /**
   * @param {validationCallback} callback
   */
  validateAdditionalInfo( callback ) {
    this.isTeacher() ? this.validateClassroom( callback ) : this.validateOrganization( callback );
  }

  /**
   * Checks if user.types is an array with non-zero length and all members of the array are members of USER_TYPES_CONSTANTS
   *
   * @param {validationCallback} callback
   */
  validateAccountTypes( callback ) {
    callback( this, arrayIsValid( this.types, USER_TYPES_ARRAY ) ? null : { types: 'Please select at least one type.' } )
  }

  /**
   * Members validated:
   *   primaryEmail
   *   secondaryEmail
   *   password
   *   firstName
   *   lastName
   *   country
   *   state
   *   city
   *   zipCode
   *   twitterHandle
   *   receiveEmail
   *
   * @param {validationCallback} callback
   */
  validateContactInfo( callback ) {
    let errorMessages = {};

    if ( !( this.primaryEmail.indexOf( '@' ) > 0 ) || this.primaryEmail.length < 5 ) {
      errorMessages.primaryEmail = 'Please enter a valid email address';
    }
    else if ( this.primaryEmail !== this.confirmEmail ) {
      errorMessages.confirmEmail = 'Please confirm email address';
    }

    if ( this.secondaryEmail.length > 0 && ( !( this.secondaryEmail.indexOf( '@' ) > 0 ) || this.secondaryEmail.length < 5 ) ) {
      errorMessages.secondaryEmail = 'Please enter a valid secondary email address';
    }

    if ( this.password.length < 8 ) {
      errorMessages.password = 'Password should be at least 8 characters';
    }
    else if ( this.password !== this.confirmPassword ) {
      errorMessages.confirmPassword = 'Please confirm password';
    }

    if ( this.firstName.length <= 0 ) {
      errorMessages.firstName = 'Please enter your first name';
    }

    if ( this.lastName.length <= 0 ) {
      errorMessages.lastName = 'Please enter your last name';
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

    if ( this.country === 'United States' && this.zipCode.length != 5 ) {
      errorMessages.zipCode = 'Please enter your 5 digit zip code';
    }

    this.validateEmail( errorMessages, true, callback );
  }

  /**
   * @param {ErrorMessages} errorMessages
   * @param {boolean} isValidatingPrimaryEmail
   * @param {validationCallback} callback
   */
  validateEmail( errorMessages, isValidatingPrimaryEmail, callback ) {
    HTTP.get(
      PUBLIC_ORIGIN + '/services/users',
      {
        params: {
          email: this[ isValidatingPrimaryEmail ? 'primaryEmail' : 'secondaryEmail' ]
        }
      },
      ( error, result ) => {
        if ( error ) {
          console.log( 'err:', error );
          return;
        }

        if ( result.data.userExists && result.data.userExists === 'true' ) {
          if ( isValidatingPrimaryEmail ) {
            errorMessages.primaryEmail = 'This email address has already been registered. Please check your inbox for a confirmation email.';
          }
          else {
            errorMessages.secondaryEmail = 'This email address has already been registered. Please choose a different address.';
          }
        }

        if ( isValidatingPrimaryEmail && this.secondaryEmail ) {
          this.validateEmail( errorMessages, false, callback );
        }
        else {
          callback( this, Object.keys( errorMessages ).length === 0 && errorMessages.constructor === Object ? null : errorMessages );
        }
      }
    );
  }

  /**
   * Members validated:
   * organization
   * subjects
   * grades
   * phetExperience
   * teachingExperience
   *
   * @param {validationCallback} callback
   */
  validateOrganization( callback ) {
    const errorMessages = {};

    if ( typeof this.organization === 'string' && this.organization.length <= 0 ) {
      errorMessages.organization = 'Please enter your organization';
    }

    if ( !arrayIsValid( this.subjects, SUBJECTS_ARRAY ) ) {
      errorMessages.subjects = 'Please select a subject';
    }

    if ( !arrayIsValid( this.grades, GRADES_ARRAY ) ) {
      errorMessages.grades = 'Please select a grade';
    }

    this.teachingExperience = parseInt( this.teachingExperience );
    if ( isNaN( this.teachingExperience) || this.teachingExperience < 0 || this.teachingExperience > 100 ) {
      errorMessages.teachingExperience = 'Please enter a number between 0 and 100';
    }

    if ( EXPERIENCE_LEVELS_ARRAY.indexOf( this.phetExperience ) < 0 ) {
      errorMessages.phetExperience = 'Please indicate your experience with PhET Simulations';
    }

    callback( this, Object.keys( errorMessages ).length === 0 && errorMessages.constructor === Object ? null : errorMessages );
  }

  /**
   * @param {validationCallback} callback
   */
  validateClassroom( callback ) {
    const errorMessages = {};
    callback( this, Object.keys( errorMessages ).length === 0 && errorMessages.constructor === Object ? null : errorMessages );
  }

  /**
   * @returns {boolean} - true if user is considered a classroom teacher
   */
  isTeacher() {
    return this.types.indexOf( USER_TYPES_CONSTANTS.TEACHER ) >= 0 || this.types.indexOf( USER_TYPES_CONSTANTS.PRE_SERVICE_TEACHER ) >= 0;
  }
}

