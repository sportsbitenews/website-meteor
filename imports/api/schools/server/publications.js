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

Meteor.publish( 'schools.public', ( search ) => {

  // Split the search string into tokens
  const searchTerms = search.toLowerCase().split( ' ' );
  const searchOptions = [];
  searchTerms.forEach( ( searchTerm ) => {
    searchOptions.push( { name: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } } );
    searchOptions.push( { name2: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } } );
    searchOptions.push( { city: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } } );
    searchOptions.push( { state: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } } );
  } );

  return Schools.find(
    {
      enabled: { $eq: true },
      $or: searchOptions
    }, {
      fields: Schools.publicFields,
      sort: { name: -1 },
      limit: 20
    }
  );

} );

Meteor.publish( 'schools.admin', ( search, pageNumber ) => {
  // Split the search string into tokens
  const searchTerm = search.toLowerCase();

  return Schools.find(
    {
      $or: [
        { name: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } },
        { name2: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } },
        { city: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } },
        { state: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } }
      ]

    }, {
      fields: Schools.adminFields,
      sort: { name: -1 },
      skip: ( 20 * ( pageNumber - 1 ) ),
      limit: ( 20 * pageNumber )
    }
  );
} );
