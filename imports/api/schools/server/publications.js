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

  // Split the search string into tokens
  const searchTerms = search.split( ' ' ).map( (term) => {return term.toLowerCase()});

  const searchOptions = [];
  searchTerms.forEach( ( term ) => {
    searchOptions.push( { name: { $regex: '\.*' + term + '\.*', $options: 'i' } } );
    searchOptions.push( { name2: { $regex: '\.*' + term + '\.*', $options: 'i' } } );
    searchOptions.push( { city: { $regex: '\.*' + term + '\.*', $options: 'i' } } );
    searchOptions.push( { state: { $regex: '\.*' + term + '\.*', $options: 'i' } } );
  } );

  return Schools
    // We search the database for schools that have words that include the search terms
    .find( {
      enabled: { $eq: true },
      $or: searchOptions
    }, {
      fields: Schools.publicFields
    } )

    // Convert Mongo Cursor to Object
    .fetch()

    // Each school is assigned a score based on the number of terms matched
    .map( ( filteredSchools, school ) => {
      let score = 0;

      const name = school.name.toLowerCase();
      const name2 = school.name2.toLowerCase();
      const city = school.city.toLowerCase();
      const state = school.state.toLowerCase();

      searchTerms.forEach( ( term ) => {
        if ( name.indexOf( term ) >= 0 ) { score++; }
        if ( name2.indexOf( term ) >= 0 ) { score++; }
        if ( city.indexOf( term ) >= 0 ) { score++; }
        if ( state.indexOf( term ) >= 0 ) { score++; }
      } );
      return { score, school };
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
