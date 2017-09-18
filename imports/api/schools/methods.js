// Copyright 2017, University of Colorado Boulder

import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import 'meteor/aldeed:collection2';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {DDPRateLimiter} from 'meteor/ddp-rate-limiter';

import {Schools} from './schools.js';

const SCHOOL_ID_ONLY = new SimpleSchema( {
  schoolId: Schools.simpleSchema().schema( '_id' )
} ).validator( { clean: true, filter: false } );

export const insert = new ValidatedMethod( {
  name: 'schools.insert',
  validate: new SimpleSchema( {
    language: {
      type: String
    }
  } ).validator(),
  run( { language } ) {
    return Schools.insert( {}, null, language );
  }
} );

export const enable = new ValidatedMethod( {
  name: 'schools.enable',
  validate: SCHOOL_ID_ONLY,
  run( { schoolId } ) {
    // if (!this.userId) {
    //   throw new Meteor.Error('schools.makePrivate.notLoggedIn',
    //     'Must be logged in to make private schools.');
    // }

    const school = Schools.findOne( schoolId );

    // if ( school.isLastPublicList() ) {
    //   throw new Meteor.Error( 'schools.makePrivate.lastPublicList',
    //     'Cannot make the last public school private.' );
    // }

    Schools.update( schoolId, {
      $set: { enabled: true }
    } );
  }
} );

export const disable = new ValidatedMethod( {
  name: 'schools.disable',
  validate: SCHOOL_ID_ONLY,
  run( { schoolId } ) {
    Schools.update( schoolId, {
      $set: { enabled: false }
    } );
  }
} );

export const updateName = new ValidatedMethod( {
  name: 'schools.updateName',
  validate: new SimpleSchema( {
    schoolId: Schools.simpleSchema().schema( '_id' ),
    newName: Schools.simpleSchema().schema( 'name' )
  } ).validator( { clean: true, filter: false } ),
  run( { schoolId, newName } ) {
    // const school = Schools.findOne( schoolId );

    // if ( !school.editableBy( this.userId ) ) {
    //   throw new Meteor.Error( 'schools.updateName.accessDenied',
    //     'You don\'t have permission to edit this school.' );
    // }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Schools.update( schoolId, {
      $set: { name: newName }
    } );
  }
} );

export const remove = new ValidatedMethod( {
  name: 'schools.remove',
  validate: SCHOOL_ID_ONLY,
  run( { schoolId } ) {
    // const school = Schools.findOne( schoolId );
    //
    // if ( !school.editableBy( this.userId ) ) {
    //   throw new Meteor.Error( 'schools.remove.accessDenied',
    //     'You don\'t have permission to remove this school.' );
    // }
    //
    // // XXX the security check above is not atomic, so in theory a race condition could
    // // result in exposing private data
    //
    // if ( school.isLastPublicList() ) {
    //   throw new Meteor.Error( 'schools.remove.lastPublicList',
    //     'Cannot delete the last public school.' );
    // }

    Schools.remove( schoolId );
  }
} );

// Get school of all method names on Schools
const SCHOOLS_METHODS = _.pluck( [
  insert,
  enable,
  disable,
  updateName,
  remove
], 'name' );

if ( Meteor.isServer ) {
  // Only allow 5 school operations per connection per second
  DDPRateLimiter.addRule( {
    name( name ) {
      return _.contains( SCHOOLS_METHODS, name );
    },

    // Rate limit per connection ID
    connectionId() { return true; }
  }, 5, 1000 );
}
