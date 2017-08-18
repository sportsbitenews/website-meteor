// Copyright 2017, University of Colorado Boulder


import { Meteor } from 'meteor/meteor';
import { Schools } from '/imports/api/schools/schools.js';

import '/imports/api/schools/server/publications.js';
import '/imports/api/schools/methods.js';


// if the database is empty on server start, create some sample data.
Meteor.startup( () => {
  if ( Schools.find().count() === 0 ) {
    const data = [
      {
        "ncesId": "20018000053",
        "name": "Abbott Loop Elementary",
        "name2": "Anchorage School District",
        "city": "Anchorage",
        "state": "AK",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20051000311",
        "name": "Academy Charter School",
        "name2": "Matanuska-Susitna Borough School District",
        "city": "Palmer",
        "state": "AK",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "A0100441",
        "name": "ACADEMY OF HIGHER LEARNING MLS",
        "name2": "",
        "city": "STERLING",
        "state": "AK",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20001000080",
        "name": "Adak School",
        "name2": "Aleutian Region School District",
        "city": "Adak",
        "state": "AK",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20018000054",
        "name": "Airport Heights Elementary",
        "name2": "Anchorage School District",
        "city": "Anchorage",
        "state": "AK",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20048000180",
        "name": "Akhiok School",
        "name2": "Kodiak Island Borough School District",
        "city": "Akhiok",
        "state": "AK",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20000400579",
        "name": "Akiachak School",
        "name2": "Yupiit School District",
        "city": "Akiachak",
        "state": "AK",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }, {
        "ncesId": "20000400624",
        "name": "Akiak School",
        "name2": "Yupiit School District",
        "city": "Akiak",
        "state": "AK",
        "country": "United States of America",
        "enabled": true,
        "phetUser": -1
      }
    ];

    data.forEach( (school) =>{ Schools.insert( school ) } );
  }

  
  Schools._ensureIndex({
      "name": "text",
      "name2": "text",
      "city": "text",
      "state": "text",
    });
} );
