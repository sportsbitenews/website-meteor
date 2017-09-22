// Copyright 2017, University of Colorado Boulder

import fs from 'fs';

import {Meteor} from 'meteor/meteor';

import {Schools} from '/imports/api/schools/schools.js';
import '/imports/api/schools/methods.js';
import '/imports/api/schools/server/publications.js';

import {stateStringMapUS} from '/imports/api/data/countryState.js';

import '/imports/api/users/server/methods.js';
import '/imports/api/users/methods.js';


// If the database is empty on server start, create some sample data.
Meteor.startup( () => {

  // Allow CORS - does not appear to be needed as everything will respond to https://phet.colorado.edu/
  // WebApp.connectHandlers.use( function( req, res, next ) {
  //   console.log( req );
  //   res.setHeader( "Access-Control-Allow-Origin", "*" );
  //   return next();
  // } );

  // Read initial data in if this is the first installation
  if ( Schools.find().count() < 10 && fs.existsSync( '/data/share/website-meteor/private/schools.new.json' ) ) {
    const data = JSON.parse( fs.readFileSync( '/data/share/website-meteor/private/schools.new.json' ) );
    const out = [];
    data.forEach( ( oldSchool ) => {
      out.push( {
        ncesId: oldSchool.ID,
        name: oldSchool.Name,
        name2: oldSchool.Name2,
        city: oldSchool.City,
        state: stateStringMapUS[ oldSchool.State.toUpperCase() ] ? stateStringMapUS[ oldSchool.State.toUpperCase() ] : oldSchool.State,
        country: 'USA'
      } )
    } );
    out.forEach( ( school ) => {
      try {
        Schools.insert( school );
      }
      catch( error ) {
        console.log( error.message, school );
      }
    } );
  }
} );
