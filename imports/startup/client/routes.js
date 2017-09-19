// Copyright 2017, University of Colorado Boulder

/**
 * PhET Application Router
 * @author Matt Pennington
 *
 **/

import React from 'react';
import {mount} from 'react-mounter';

import RegistrationPage from '/imports/ui/pages/register/register.js';
import SchoolsAdministrationPage from '/imports/ui/pages/admin/schools/schools.js';

import {PUBLIC_ORIGIN} from '/imports/api/data/constants';

// TODO: abstract authentication such that this file does not need to change when users are migrated to Mongo

FlowRouter.route( '/admin/schools', {
  action() {
    HTTP.get(
      PUBLIC_ORIGIN + '/services/users',
      {},
      ( error, result )=> {
        const isSignedIn = result.data && result.data.signedIn === "true";
        const isTeamMember = result.data && result.data.isTeamMember === "true";

        if ( isSignedIn && isTeamMember ) {
          console.log( 'already signed in' );
          mount( SchoolsAdministrationPage );

        }
        else {
          console.log( 'not signed in' );
          window.location = PUBLIC_ORIGIN + '/404'
        }
      }
    );
  }
} );

FlowRouter.route( '/:locale/register', {
  action() {
    HTTP.get(
      PUBLIC_ORIGIN + '/services/users',
      {},
      ( error, result )=> {
        const isSignedIn = result.data && result.data.signedIn === "true";
        const locale = FlowRouter.getParam( 'locale' );
        const dest = FlowRouter.getQueryParam( 'dest' );

        if ( isSignedIn ) {
          console.log( 'already signed in' );
          window.location = PUBLIC_ORIGIN + decodeURIComponent( dest );
        }
        else {
          console.log( 'not signed in' );
          mount( RegistrationPage, { locale, dest } );
        }
      }
    );
  }
} );

