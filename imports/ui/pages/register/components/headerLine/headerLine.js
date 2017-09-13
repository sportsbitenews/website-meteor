// Copyright 2017, University of Colorado Boulder

/**
 * Registration Page Progress Graphic
 * @author Matt Pennington
 **/

import React from 'react';

import {MOUNT_PATH} from '/imports/api/data/constants.js'

import './headerLine.css'

// SVG parameters
const phetYellow = "#FCEE21";
const disabledGrey = "#AAAAAA";
const lineHeight = 35;
const strokeWidth = 1.5;

/**
 * @param {boolean} props.enabled - if true the node is yellow otherwise it is grey
 * @param {boolean} props.active - if true the node is a paper airplane otherwise it is a cirle
 *
 * @return {component} - a horizontal line
 **/
function Node( props ) {
  const radius = ( lineHeight * .9 ) / 2;
  const innerRadius = .8 * radius;
  const diameter = 2 * radius;

  if ( props.active ) {
    return (
      <img src={ MOUNT_PATH + '/img/yellow_paper_airplane.png'} alt="" aria-hidden="true"/>
    )
  }
  else if ( props.enabled ) {
    return (
      <svg height={diameter} width={diameter}>
        <circle cx={radius} cy={radius} r={innerRadius} stroke={phetYellow} strokeWidth={strokeWidth} fill={phetYellow}/>
      </svg>
    );
  }
  else {
    return (
      <svg height={diameter} width={diameter}>
        <circle cx={radius} cy={radius} r={innerRadius} stroke={disabledGrey} strokeWidth={strokeWidth} fillOpacity="0.0"/>
      </svg>
    );
  }
}

/**
 * @param {boolean} props.enabled - if true the line is yellow otherwise it is grey
 *
 * @return {component} - a horizontal line
 **/
function Line( props ) {
  const width = 300;
  const start = 10;
  const end = width - ( start * 2 );

  if ( props.enabled ) {
    return (
      <svg height={lineHeight} width={width}>
        <line x1={start} y1={lineHeight / 2} x2={end} y2={lineHeight / 2} stroke={phetYellow} strokeWidth={strokeWidth} fill={phetYellow}/>
      </svg>
    );
  }
  else {
    return (
      <svg height={lineHeight} width={width}>
        <line x1={start} y1={lineHeight / 2} x2={end} y2={lineHeight / 2} stroke={disabledGrey} strokeWidth={strokeWidth}/>
      </svg>
    );
  }
}

/**
 * @param {integer} props.page - page number of the current location, should be in the range (1,3)
 *
 * @return {component} the dots, paper airplane, horizontal rules and labels at the top of the registration page
 **/
class Layout extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div>
          <Node enabled={this.props.page > 0} active={this.props.page === 1}/>
          <Line enabled={this.props.page > 1}/>
          <Node enabled={this.props.page > 1} active={this.props.page === 2}/>
          <Line enabled={this.props.page > 2}/>
          <Node enabled={this.props.page > 2} active={this.props.page === 3}/>
        </div>
        <div id="header-line-text">
          <span>Account Type</span>
          <span>Contact Info</span>
          <span>Additional Info</span>
        </div>
      </div>
    );
  }
}

export default HeaderLine = ( { locale, page } ) => {
  return (
    <Layout locale={locale} page={page}/>
  );
}
