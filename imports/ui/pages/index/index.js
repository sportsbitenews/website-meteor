// Copyright 2017, University of Colorado Boulder

/**
 * PhET Index Page
 * @author Matt Pennington
 *
 * @typedef {Object} React.Component
 * @property {function} setState
 *
 * @typedef {Object} component - a jsx component
 **/

import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import {createContainer} from 'meteor/react-meteor-data'

import './index.css';

// import '../../../api/strings/server/strings.js'

class IndexPage extends Component {
  constructor( props ) {
    super( props );
    const keys = [
      'home_interactiveSimulations',
      'home_simulationsDelivered',
      'home_playWithSims',
      'home_whatIsPhet',
      'home_whatIsPhet_description',
      'home_about_news',
      'helpCenterString_gettingStarted_41_answer',
      'nav_iPad',
      'home_whatIsPhet_buzzwords',
    ];
    console.log( this.props.locale );
    window.props = this.props;
    this.locale = 'en';
  }

  renderTranslatedString( key ) {
    console.log( 'translating: ' + key );
    const value = this.props[ key ][ 0 ] ? this.props[ key ][ 0 ][ this.locale ] : '';
    console.log( key + ': ' + value );
    return value;
  }


  render() {
    return (
      <div className="container">
        <header>
          <img id="main-image-index-page" src="/img/front.png" alt={this.renderTranslatedString( 'title' )}/>
          <h1 dangerouslySetInnerHTML={{ __html: this.renderTranslatedString( 'title' ) }}/>
          <h2 dangerouslySetInnerHTML={{ __html: this.renderTranslatedString( 'subtitle' ).replace( '{0}', '360' ) }}/>
        </header>
        <div className="content">
          <div className="column">
            <div id="video-rotator"></div>
            <div id="play-sims" className="phet-button"><span dangerouslySetInnerHTML={{ __html: this.renderTranslatedString( 'playButton' ) }}/>
            </div>
          </div>
          <div className="column">
            <h3 dangerouslySetInnerHTML={{ __html: this.renderTranslatedString( 'whatIsPhet' ) }}/>
            <p dangerouslySetInnerHTML={{ __html: this.renderTranslatedString( 'aboutPhet' ) }}/>
            <img alt={this.renderTranslatedString( 'buzzwords' )}/>
          </div>
          <div className="column">
            <h3 dangerouslySetInnerHTML={{ __html: this.renderTranslatedString( 'whatsNew' ) }}/>
            <p dangerouslySetInnerHTML={{ __html: this.renderTranslatedString( 'appDescription' ) }}/>
            <img alt={this.renderTranslatedString( 'iPad' )}/>
          </div>
        </div>
      </div>
    );
  }
}

IndexPage.propTypes = {
  title: PropTypes.array.isRequired,
  subtitle: PropTypes.array.isRequired,
  playButton: PropTypes.array.isRequired,
  whatIsPhet: PropTypes.array.isRequired,
  aboutPhet: PropTypes.array.isRequired,
  whatsNew: PropTypes.array.isRequired,
  appDescription: PropTypes.array.isRequired,
  iPad: PropTypes.array.isRequired,
  locale: PropTypes.string,
};

// export default createContainer( () => {
//   return {
//     title: Strings.find( { key: 'home_interactiveSimulations' } ).fetch(),
//     subtitle: Strings.find( { key: 'home_simulationsDelivered' } ).fetch(),
//     playButton: Strings.find( { key: 'home_playWithSims' } ).fetch(),
//     whatIsPhet: Strings.find( { key: 'home_whatIsPhet' } ).fetch(),
//     aboutPhet: Strings.find( { key: 'home_whatIsPhet_description' } ).fetch(),
//     whatsNew: Strings.find( { key: 'home_about_news' } ).fetch(),
//     appDescription: Strings.find( { key: 'helpCenterString_gettingStarted_41_answer' } ).fetch(),
//     iPad: Strings.find( { key: 'nav_iPad' } ).fetch(),
//     buzzwords: Strings.find( { key: 'home_whatIsPhet_buzzwords' } ).fetch(),
//   };
// }, IndexPage );
