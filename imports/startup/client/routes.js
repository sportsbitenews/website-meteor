import React from 'react';
import { mount } from 'react-mounter';

import { IndexPage } from '/imports/pages/index/index.js';
import { RegistrationPage } from '/imports/pages/register/register.js';


FlowRouter.route( '/', {
  action() {
    mount( IndexPage,
      { locale: 'en' }
    );
  }
} );

FlowRouter.route( '/:locale', {
  action() {
    mount( IndexPage,
      { locale: FlowRouter.getParam( 'locale' ) }
    );
  }
} );

FlowRouter.route( '/:locale/register', {
  action() {
    mount( RegistrationPage,
      { locale: FlowRouter.getParam( 'locale' ) }
    );
  }
} );
