// Copyright 2017, University of Colorado Boulder

/**
 * Schools server side publications
 * @author Matt Pennington
 **/

import {Meteor} from 'meteor/meteor';

import {Schools} from '../schools.js';

const stateStringMap = {
  "AL": "alabama",
  "AK": "alaska",
  "AS": "american samoa",
  "AZ": "arizona",
  "AR": "arkansas",
  "CA": "california",
  "CO": "colorado",
  "CT": "connecticut",
  "DE": "delaware",
  "DC": "district of columbia",
  "FM": "federated states of micronesia",
  "FL": "florida",
  "GA": "georgia",
  "GU": "guam",
  "HI": "hawaii",
  "ID": "idaho",
  "IL": "illinois",
  "IN": "indiana",
  "IA": "iowa",
  "KS": "kansas",
  "KY": "kentucky",
  "LA": "louisiana",
  "ME": "maine",
  "MH": "marshall islands",
  "MD": "maryland",
  "MA": "massachusetts",
  "MI": "michigan",
  "MN": "minnesota",
  "MS": "mississippi",
  "MO": "missouri",
  "MT": "montana",
  "NE": "nebraska",
  "NV": "nevada",
  "NH": "new hampshire",
  "NJ": "new jersey",
  "NM": "new mexico",
  "NY": "new york",
  "NC": "north carolina",
  "ND": "north dakota",
  "MP": "northern mariana islands",
  "OH": "ohio",
  "OK": "oklahoma",
  "OR": "oregon",
  "PW": "palau",
  "PA": "pennsylvania",
  "PR": "puerto rico",
  "RI": "rhode island",
  "SC": "south carolina",
  "SD": "south dakota",
  "TN": "tennessee",
  "TX": "texas",
  "UT": "utah",
  "VT": "vermont",
  "VI": "virgin islands",
  "VA": "virginia",
  "WA": "washington",
  "WV": "west virginia",
  "WI": "wisconsin",
  "WY": "wyoming"
};

Meteor.publish( 'schools.public', function schoolsPublic( search ) {
  console.log( 'search:' + search );

  const schools = Schools.find( {
    enabled: { $eq: true }
  }, {
    fields: Schools.publicFields
  } ).fetch();

  // Split the search string into tokens
  const searchTerms = search.split( ' ' );

  // We search the database for schools that have words that include the search terms
  // Each school is assigned a score based on the number of terms matched
  return schools.reduce( ( filteredSchools, school ) => {
    let score = 0;
    for ( let i in searchTerms ) {
      if ( school.Name.toLowerCase().indexOf( searchTerms[ i ].toLowerCase() ) >= 0
           || school.Name2.toLowerCase().indexOf( searchTerms[ i ].toLowerCase() ) >= 0
           || school.City.toLowerCase().indexOf( searchTerms[ i ].toLowerCase() ) >= 0
           || ( stateStringMap[ school.State ] && stateStringMap[ school.State ].toLowerCase().indexOf( searchTerms[ i ].toLowerCase() ) >= 0 ) ) {
        score++;
      }
    }
    if ( score > 0 ) {
      filteredSchools.push( { score, school } );
    }
    return filteredSchools;
  }, [] )

  // Sort by score descending, then by school.Name alphabetically
    .sort( ( a, b ) => {
      if ( a.score !== b.score ) {
        return b.score - a.score;
      }
      else {
        return a.school.Name.toLowerCase().localeCompare( b.school.Name.toLowerCase() );
      }
    } )

    // We only return the first N schools, some search terms could have ~100K results
    .slice( 0, 20 )

    // The recipient doesn't care about the search score, we return the schools in sorted form only
    .filter( ( item ) => { return item.school; } );
} );

// Meteor.publish( 'schools.admin', function schoolsAdmin() {
//   return Schools.find( {}, {
//     fields: Schools.adminFields
//   } );
// } );
