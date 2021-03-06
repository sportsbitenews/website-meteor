// Copyright 2017, University of Colorado Boulder

import {Meteor} from 'meteor/meteor';

import {User} from '/imports/api/users/users';


Meteor.methods( {
  'users.saveUser'( { user } ) {
    user = new User( user );
    console.log( 'from method:', user );
    if ( !this.isSimulation ) {
      import {saveUser} from '/imports/api/users/server/methods';
      return saveUser( user );
    }
    else {
      return ( true );
    }
  },
  
  'users.addSchool'( { userId, schoolId } ) {
    if ( !this.isSimulation ) {
      import {addSchool} from '/imports/api/users/server/methods';
      return addSchool( userId, schoolId );
    }
    else {
      return ( true );
    }
  }
} );
