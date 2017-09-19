// Copyright 2017, University of Colorado Boulder

/**
 * Schools server side publications
 * @author Matt Pennington
 **/

import {Meteor} from 'meteor/meteor';
import {Counts} from 'meteor/tmeasday:publish-counts';

import {Schools} from '../schools.js';

Meteor.publish( 'schools.public', ( search ) => {

  // Split the search string into tokens
  const searchTerms = search.toLowerCase().split( ' ' );
  const searchOptions = [];
  searchTerms.forEach( ( searchTerm ) => {
    searchOptions.push( {
      $or: [
        { name: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } },
        { name2: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } },
        { city: { $regex: searchTerm + '\.*', $options: 'i' } },
        { state: { $regex: searchTerm + '\.*', $options: 'i' } },
      ]
    } )

  } );

  console.log( 'search starting:', searchOptions );
  return Schools.find(
    {
      $or: [
        { validatedDate: { $exists: true } },
        { ncesId: { $exists: true } }
      ],
      $and: searchOptions
    }, {
      fields: Schools.publicFields,
      sort: { name: -1 },
      limit: 20
    }
  );
} );

Meteor.publish( 'schools.admin', ( searchOptions ) => {

  const searchParameters = [];
  const searchTerms = searchOptions.searchTerm.toLowerCase().split( ' ' );
  searchTerms.forEach( ( searchTerm ) => {
    searchParameters.push({
      $or: [
        { name: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } },
        { name2: { $regex: '\.*' + searchTerm + '\.*', $options: 'i' } },
      ]
    } )
  } );

  if ( searchOptions.city && searchOptions.city.length > 1 ) {
    searchParameters.push ( { city: { $regex: '\.*' + searchOptions.city + '\.*', $options: 'i' } } );
  }

  if ( searchOptions.state && searchOptions.state !== 'default' ) {
    searchParameters.push({ state: searchOptions.state });
  }

  if ( searchOptions.country && searchOptions.country !== 'default' ) {
    searchParameters.push({ country: searchOptions.country });
  }

  const searchLimits = {
    fields: Schools.adminFields,
    sort: { name: -1 },
    skip: parseInt( 20 * ( searchOptions.pageNumber - 1 ) ),
    limit: parseInt( 20 * searchOptions.pageNumber )
  };

  console.log( searchParameters, searchLimits );

  // Counts.publish( this, 'schools.admin_count', Schools.find( { $and: searchParameters }, null ) );
  return Schools.find( { $and: searchParameters }, searchLimits );
} );