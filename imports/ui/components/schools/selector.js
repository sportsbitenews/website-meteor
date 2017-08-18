// Copyright 2017, University of Colorado Boulder

/**
 * School Selector with autocomplete function
 * @author Matt Pennington
 *
 **/

import React from 'react';

import {Schools} from '/imports/api/schools/schools.js';

export default class SchoolSelector extends React.Component {
  constructor() {
    super();
  }

  getState() {
    return Schools.find();
  }

  render() {
    return (
      <div>
        <button onClick={() => this.props.onClick(this.getState())}>Click ME!</button>
      </div>
    );
  }
}
