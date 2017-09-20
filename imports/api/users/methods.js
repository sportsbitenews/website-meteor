// Copyright 2017, University of Colorado Boulder

import {Meteor} from 'meteor/meteor';

import {validate, User} from '/imports/api/users/users';

const Future = require( 'fibers/future' );

Meteor.methods( {
  'users.saveUser'( { user } ) {
    const future = new Future();
    user = new User( user );
    console.log('from method:', user);
    validate( user, ( errorMessages ) => {
      if ( errorMessages !== null ) {
        future.return( false );
        throw new Meteor.Error(
          'user.failedValidation',
          errorMessages
        );
      }

      if ( !this.isSimulation ) {
        import {saveUser} from '/imports/api/users/server/methods';
        saveUser( user, future );
      }
      else {
        future.return( true );
      }
    } );
    
    return future.wait();
  }
});
