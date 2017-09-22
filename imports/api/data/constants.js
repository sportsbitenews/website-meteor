// Copyright 2017, University of Colorado Boulder

/**
 * Website Constants
 * @author Matt Pennington
 **/

import {Meteor} from 'meteor/meteor';

let origin;

if ( Meteor.isClient ) {
  origin = window.location.origin;

// If origin contains a port number, strip it out.  For local deployment.
  const secondColon = origin.indexOf( ':', origin.indexOf( ':' ) + 1 );
  if ( secondColon !== -1 ) {
    origin = origin.substr( 0, secondColon );
  }
}
if ( Meteor.isServer ) {
  origin = 'http://127.0.0.1';
}


export const PUBLIC_ORIGIN = origin;
export const MOUNT_PATH = '/_m';
export const ENGLISH_LOCALE = 'en';
  