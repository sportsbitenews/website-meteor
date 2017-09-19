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

  return Schools.find(
    {
      $and: [
        
        { city: { $regex: '\.*' + searchOptions.city + '\.*', $options: 'i' } },
        { state: searchOptions.state },
        { country: searchOptions.country }
      ]
    }, {
      fields: Schools.adminFields,
      sort: { name: -1 },
      skip: ( 20 * ( searchOptions.pageNumber - 1 ) ),
      limit: ( 20 * searchOptions.pageNumber )
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

  return Schools.find(
    {
      $and: [

        { city: { $regex: '\.*' + searchOptions.city + '\.*', $options: 'i' } },
        { state: searchOptions.state },
        { country: searchOptions.country }
      ]
    }, {
      fields: Schools.adminFields,
      sort: { name: -1 },
      skip: ( 20 * ( searchOptions.pageNumber - 1 ) ),
      limit: ( 20 * searchOptions.pageNumber )
    }
  );
} );
