// Copyright 2017, University of Colorado Boulder

/**
 * Data wrapper for School Selector with autocomplete function
 * @author Matt Pennington
 **/

import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import SchoolSelector from './selector.js';

import {Schools} from '/imports/api/schools/schools.js';

export default SchoolSelectorContainer = createContainer( () => {
  const channelHandle = Meteor.subscribe( 'schools.public' );
  const loading = !channelHandle.ready();
  const findSchools = ( search ) => { Schools.find( { $text: { $search: search } } ) };
  return {
    loading,
    findSchools
  };
}, SchoolSelector );