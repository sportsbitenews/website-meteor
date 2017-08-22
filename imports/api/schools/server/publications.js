// Copyright 2017, University of Colorado Boulder

/**
 * Schools server side publications
 * @author Matt Pennington
 **/

import {Meteor} from 'meteor/meteor';

import {Schools} from '../schools.js';

Meteor.publish( 'schools.public', function schoolsPublic( search ) {
  console.log( 'search:' + search );
  return Schools.find( {
    enabled: { $eq: true },
    name: { $regex: '\.*' + search + '\.*', $options: 'i' }
  }, {
    fields: Schools.publicFields
  } );
} );

Meteor.publish( 'schools.admin', function schoolsAdmin() {
  return Schools.find( {
    // userId: this.userId,
  }, {
    fields: Schools.adminFields
  } );
} );
