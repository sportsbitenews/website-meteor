// Copyright 2017, University of Colorado Boulder

import {Meteor} from 'meteor/meteor';

Meteor.methods( {
  'users.saveUser'( { user } ) {
    if ( this.isSimulation ) {
      validate( user, ( errorMessages ) => {
        if ( errorMessages !== null ) {
          throw new Meteor.Error(
            'user.failedValidation',
            errorMessages
          );
        }
      } );
    }
    else {
      import {saveUser} from '/imports/api/user';
      saveUser( user );
    }
  }
});
