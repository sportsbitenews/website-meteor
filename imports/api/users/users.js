// Copyright 2017, University of Colorado Boulder


/**
 * PhET Users
 * @author Matt Pennington
 *
 * @typedef {Object} ErrorMessages
 * @property {String} fieldName - there is one member for each field that has an error
 *
 * @callback validationCallback
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
      if ( !model.includes( type ) ) {
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
   * @returns {boolean} - true if user is considered a classroom teacher
   */
  isTeacher() {
    return this.types.indexOf( USER_TYPES_CONSTANTS.TEACHER ) >= 0 || this.types.indexOf( USER_TYPES_CONSTANTS.PRE_SERVICE_TEACHER ) >= 0;
  }
}

/**
 * Checks if this user is valid.  If validation fails at any step, the callback is called.
 *
 * @param {User} user
 * @param {validationCallback} callback
 */
export const validate = ( user, callback ) => {
  validateAccountTypes( user, ( errorMessages ) => {
    if ( errorMessages === null ) {
      validateContactInfo( user, ( errorMessages ) => {
        if ( errorMessages === null ) {
          validateAdditionalInfo( callback );
        }
        else {
          callback( errorMessages );
        }
      } );
    }
    else {
      callback( errorMessages );
    }
  } );
};

/**
 * @param {User} user
 * @param {validationCallback} callback
 */
export const validateAdditionalInfo = ( user, callback ) => {
  user.isTeacher() ? validateClassroom( user, callback ) : validateOrganization( user, callback );
};

/**
 * Checks if user.types is an array with non-zero length and all members of the array are members of USER_TYPES_CONSTANTS
 *
 * @param {User} user
 * @param {validationCallback} callback
 */
export const validateAccountTypes = ( user, callback ) => {
  callback( arrayIsValid( user.types, USER_TYPES_ARRAY ) ? null : { types: 'Please select at least one type.' } )
};

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
 * @param {User} user
 * @param {validationCallback} callback
 */
export const validateContactInfo = ( user, callback ) => {
  let errorMessages = {};

  if ( !( user.primaryEmail.indexOf( '@' ) > 0 ) || user.primaryEmail.length < 5 ) {
    errorMessages.primaryEmail = 'Please enter a valid email address';
  }
  else if ( user.primaryEmail !== user.confirmEmail ) {
    errorMessages.confirmEmail = 'Please confirm email address';
  }

  if ( user.secondaryEmail.length > 0 && ( !( user.secondaryEmail.indexOf( '@' ) > 0 ) || user.secondaryEmail.length < 5 ) ) {
    errorMessages.secondaryEmail = 'Please enter a valid secondary email address';
  }

  if ( user.password.length < 8 ) {
    errorMessages.password = 'Password should be at least 8 characters';
  }
  else if ( user.password !== user.confirmPassword ) {
    errorMessages.confirmPassword = 'Please confirm password';
  }

  if ( user.firstName.length <= 0 ) {
    errorMessages.firstName = 'Please enter your first name';
  }

  if ( user.lastName.length <= 0 ) {
    errorMessages.lastName = 'Please enter your last name';
  }

  if ( user.country === 'default' || Locations.countries.indexOf( user.country ) < 0 ) {
    errorMessages.country = 'Please select a country';
  }
  else if ( user.state === 'default' || Locations.states[ Locations.countries.indexOf( user.country ) ].indexOf( user.state ) < 0 ) {
    errorMessages.state = 'Please select a state or province';
  }

  if ( user.city.length <= 0 ) {
    errorMessages.city = 'Please enter a city';
  }

  if ( user.country === 'United States' && user.zipCode.length != 5 ) {
    errorMessages.zipCode = 'Please enter your 5 digit zip code';
  }

  validateEmail( user, errorMessages, true, callback );
};

/**
 * @param {User} user
 * @param {ErrorMessages} errorMessages
 * @param {boolean} isValidatingPrimaryEmail
 * @param {validationCallback} callback
 */
export const validateEmail = ( user, errorMessages, isValidatingPrimaryEmail, callback ) => {
  HTTP.get(
    PUBLIC_ORIGIN + '/services/users',
    {
      params: {
        email: user[ isValidatingPrimaryEmail ? 'primaryEmail' : 'secondaryEmail' ]
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

      if ( isValidatingPrimaryEmail && user.secondaryEmail ) {
        validateEmail( user, errorMessages, false, callback );
      }
      else {
        callback( Object.keys( errorMessages ).length === 0 && errorMessages.constructor === Object ? null : errorMessages );
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
 * @param {User} user
 * @param {validationCallback} callback
 */
export const validateOrganization = ( user, callback ) => {
  const errorMessages = {};

  if ( typeof user.organization === 'string' && user.organization.length <= 0 ) {
    errorMessages.organization = 'Please enter your organization';
  }

  if ( !arrayIsValid( user.subjects, SUBJECTS_ARRAY ) ) {
    errorMessages.subjects = 'Please select a subject';
  }

  if ( !arrayIsValid( user.grades, GRADES_ARRAY ) ) {
    errorMessages.grades = 'Please select a grade';
  }

  user.teachingExperience = parseInt( user.teachingExperience );
  if ( isNaN( user.teachingExperience ) || user.teachingExperience < 0 || user.teachingExperience > 100 ) {
    errorMessages.teachingExperience = 'Please enter a number between 0 and 100';
  }

  if ( EXPERIENCE_LEVELS_ARRAY.indexOf( user.phetExperience ) < 0 ) {
    errorMessages.phetExperience = 'Please indicate your experience with PhET Simulations';
  }

  callback( Object.keys( errorMessages ).length === 0 && errorMessages.constructor === Object ? null : errorMessages );
};

/**
 * @param {User} user
 * @param {validationCallback} callback
 */
export const validateClassroom = ( user, callback ) => {
  const errorMessages = {};
  callback( Object.keys( errorMessages ).length === 0 && errorMessages.constructor === Object ? null : errorMessages );
};