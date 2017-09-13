// Copyright 2017, University of Colorado Boulder


import {Meteor} from 'meteor/meteor';
// import WebApp from 'meteor/webapp';

import {Schools} from '/imports/api/schools/schools.js';

import '/imports/api/schools/server/publications.js';
import '/imports/api/schools/methods.js';


// If the database is empty on server start, create some sample data.
Meteor.startup( () => {

  // Allow CORS
  // WebApp.connectHandlers.use( function( req, res, next ) {
  //   console.log( req );
  //   res.setHeader( "Access-Control-Allow-Origin", "*" );
  //   return next();
  // } );

  if ( Schools.find().count() === 0 ) {
    const data = [
      {
        "ncesId": "20018000053",
        "name": "Abbott Loop Elementary",
        "name2": "Anchorage School District",
        "city": "Anchorage",
        "state": "Alaska",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20051000311",
        "name": "Academy Charter School",
        "name2": "Matanuska-Susitna Borough School District",
        "city": "Palmer",
        "state": "Alaska",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "A0100441",
        "name": "ACADEMY OF HIGHER LEARNING MLS",
        "name2": "",
        "city": "STERLING",
        "state": "Alaska",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20001000080",
        "name": "Adak School",
        "name2": "Aleutian Region School District",
        "city": "Adak",
        "state": "Alaska",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20018000054",
        "name": "Airport Heights Elementary",
        "name2": "Anchorage School District",
        "city": "Anchorage",
        "state": "Alaska",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20048000180",
        "name": "Akhiok School",
        "name2": "Kodiak Island Borough School District",
        "city": "Akhiok",
        "state": "Alaska",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20000400579",
        "name": "Akiachak School",
        "name2": "Yupiit School District",
        "city": "Akiachak",
        "state": "Alaska",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20000400624",
        "name": "Akiak School",
        "name2": "Yupiit School District",
        "city": "Akiak",
        "state": "Alaska",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }
    ];

    data.forEach( ( school ) => { Schools.insert( school ) } );
  }


  Schools._ensureIndex( {
    "name": "text",
    "name2": "text",
    "city": "text",
    "state": "text",
  } );
} );
