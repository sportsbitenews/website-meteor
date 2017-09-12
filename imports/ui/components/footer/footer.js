// Copyright 2017, University of Colorado Boulder

/**
 * FooterPanel Component
 * @author Matt Pennington
 **/

import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';

import { PUBLIC_ORIGIN } from '/imports/api/data/constants.js';

/**
 * @return {React.Component} the footer panel
 **/
export class FooterPanel extends React.Component {
  constructor() {
    super();
    this.state = { height: '100%' };
  }

  render() {
    // Allows the footer panel to change the locale
    window.addEventListener( 'message', ( message ) => {
      console.log( message );
      message = JSON.parse( message.data );
      if ( message.switchLocale ) {
        window.history.pushState("","",window.location.pathname.replace( this.state.locale, message.switchLocale));
        this.setState({locale});
        this.props.switchLocale( locale );
      }

      if ( message.setHeight ) {
        this.setState( { height: message.setHeight } );
      }
    } );

    return (
      <iframe
        className="footer"
        style={ { height: this.state.height, overflow:'visible' } }
        src={ PUBLIC_ORIGIN + '/' + this.props.locale + '/footer' }
        height={ this.state.height }
        scrolling="no"
        frameBorder="0"
      />
    );
  }
}

export default FooterPanel;
