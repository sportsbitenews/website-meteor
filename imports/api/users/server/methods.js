// Copyright 2017, University of Colorado Boulder

// import {PUBLIC_ORIGIN} from '/imports/api/data/constants';
import {validate} from '/imports/api/users/users';

export const saveUser = ( user ) => {
  console.log(user);
  validate( user, ( errorMessages ) => {
    if ( errorMessages === null ) {
      console.log( 'Theoretically posting to wicket' );
      // HTTP.post(
      //   PUBLIC_ORIGIN + '/services/users',
      //   { data: user },
      //   ( error, result ) => {
      //     if ( error ) {
      //       console.log( 'Error adding user to the website:', error );
      //       //TODO: handle error
      //     }
      //     else if ( result.statusCode < 200 || result.statusCode > 299 ) {
      //       console.log( 'Unsuccessful attempt to add user to the website:', result.content );
      //       //TODO: handle error
      //     }
      //     else {
      //       // Success?
      //     }
      //   }
      // )
    }
    else {
      throw new Meteor.Error(
        'user.failedValidation',
        errorMessages
      );
    }
  } )
};