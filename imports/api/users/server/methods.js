// Copyright 2017, University of Colorado Boulder

// import {PUBLIC_ORIGIN} from '/imports/api/data/constants';
import {validate} from '/imports/api/users/users';
const Future = Npm.require('fibers/future');

export const saveUser = ( user ) => {
  console.log(user);
  const future = new Future();
  validate( user, ( errorMessages ) => {
    if ( errorMessages === null ) {
      console.log( 'Theoretically posting user to wicket' );
      future.return( {user:'123456'} );
      // HTTP.post(
      //   PUBLIC_ORIGIN + '/services/users',
      //   {
      //     data: user
      //     // TODO: add authorization code for local server api call
      //   },
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
      // future.return( false );
      throw new Meteor.Error(
        'user.failedValidation',
        errorMessages
      );
    }
  } );
  return future.wait();
};


export const addSchool = ( userId, schoolId ) => {
  const future = new Future();
  if ( userId && schoolId ) {
    // TODO: replace with call to wicket
    console.log( 'Theoretically updating user in wicket' );
    future.return( true );
  }
  else {
    future.return( false );
  }
  return future.wait();
};