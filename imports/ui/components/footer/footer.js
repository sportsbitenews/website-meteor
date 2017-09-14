// Copyright 2017, University of Colorado Boulder

/**
 * FooterPanel Component
 * @author Matt Pennington
 **/

import React from 'react';

import {PUBLIC_ORIGIN} from '/imports/api/data/constants.js';

/**
 * @return {React.Component} the footer panel
 **/
export default class FooterPanel extends React.Component {
  constructor() {
    super();

    // Allows the footer panel to change the locale reactively
    window.addEventListener( 'message', ( message ) => {
      try {
        message = JSON.parse( message.data );
      }
      catch ( e ) {
        return;
      }

      // Handle locale switch
      if ( message.switchLocale ) {
        window.history.pushState( '', '', window.location.pathname.replace( this.props.locale, message.switchLocale ) );
        this.props.switchLocale( message.switchLocale );
      }
      // Handle anchor click
      else if ( message.navigate ) {
        if ( message.navigate.endsWith( 'footer' ) ) {
          const locale = message.navigate.substr( 1, message.indexOf( '/', 1 ) - 1 );
          this.props.switchLocale( locale );
        }
        else {
          window.location = message.navigate;
        }
      }
    } );
  }

  render() {
    return (
      <iframe
        className="footer"
        src={ PUBLIC_ORIGIN + '/' + this.props.locale + '/footer' }
        scrolling="no"
        frameBorder="0"
      />
    );
  }
}
