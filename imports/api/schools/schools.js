// Copyright 2017, University of Colorado Boulder

/**
 * Schools Collection
 * @author Matt Pennington
 **/

import {Mongo} from 'meteor/mongo';
import 'meteor/aldeed:collection2';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// class SchoolsCollection extends Mongo.Collection {
//   insert( school, callback, language = 'en' ) {
//     return super.insert( school, callback );
//   }
//
//   remove( selector, callback ) {
//     return super.remove( selector, callback );
//   }
// }

export const Schools = new Mongo.Collection( 'schools' );

// Deny all client-side updates since we will be using methods to manage this collection
Schools.deny( {
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
} );

Schools.schema = new SimpleSchema( {
  _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  ncesId: { type: String, optional: true },
  name: { type: String },
  name2: { type: String, optional: true },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  validatedDate: { type: Date, optional: true },
  phetUser: { type: Number, optional: true },
  editDate: { type: Date, optional: true },
  parent: { type: String, regEx: SimpleSchema.RegEx.Id, optional: true }
} );

Schools.attachSchema( Schools.schema );

// This represents the keys from Schools objects that should be published
// to the client. If we add secret properties to School objects, don't list
// them here to keep them private to the server.
Schools.publicFields = {
  name: 1,
  name2: 1,
  city: 1,
  state: 1,
  country: 1,
  validatedDate: 1
};

Schools.adminFields = {
  _id: 1,
  ncesId: 1,
  name: 1,
  name2: 1,
  city: 1,
  state: 1,
  country: 1,
  enabled: 1,
  phetUser: 1
};

// Schools.helpers( {
//   isPrivate() {
//     return !this.enabled;
//   },
//   // isLastPublicList() {
//   //   const publicListCount = Schools.find( { userId: { $exists: false } } ).count();
//   //   return !this.isPrivate() && publicListCount === 1;
//   // },
//   // editableBy( userId ) {
//   //   if ( !this.userId ) {
//   //     return true;
//   //   }
//   //
//   //   return this.userId === userId;
//   // }
// } );
