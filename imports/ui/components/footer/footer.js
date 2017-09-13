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

    console.log('footer constructor');
    // Allows the footer panel to change the locale and set the iframe height
    window.addEventListener( 'message', ( message ) => {
      try {
        message = JSON.parse( message.data );
      }
      catch ( e ) {
        return;
      }

      if ( message.switchLocale ) {
        window.history.pushState( '', '', window.location.pathname.replace( this.state.locale, message.switchLocale ) );
        this.props.switchLocale( message.switchLocale );
      }

      // if ( message.setHeight ) {
      //   this.setState( { height: message.setHeight } );
      // }
    } );

    // this.state = { height: '100%' };
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
