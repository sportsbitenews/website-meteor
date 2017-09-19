// Copyright 2017, University of Colorado Boulder

/**
 * Schools server side publications
 * @author Matt Pennington
 **/

import {Meteor} from 'meteor/meteor';

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
