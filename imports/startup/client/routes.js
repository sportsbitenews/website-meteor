// Copyright 2017, University of Colorado Boulder

/**
 * PhET Application Router
 * @author Matt Pennington
 *
 **/

import React from 'react';
import { mount } from 'react-mounter';

import RegistrationPage from '/imports/ui/pages/register/register.js';

import { MOUNT_PATH } from '/imports/api/data/constants';

FlowRouter.route( '/:locale/register', {
  action() {
    HTTP.get(
      MOUNT_PATH + '/services/users',
      {},
      ( error, result )=> {
        console.log(result, result.data);
        const data = JSON.parse( result.data );
        const isSignedIn = data.signedIn === "true";

        if ( isSignedIn ) {
          console.log( 'already signed in' );
          window.location = MOUNT_PATH;
        }
        else {
          console.log( 'not signed in' );
          mount( RegistrationPage,
            {
              locale: FlowRouter.getParam( 'locale' ),
              dest: FlowRouter.getQueryParam( 'dest' )
            }
          );
        }
      }
    );
  }
} );

