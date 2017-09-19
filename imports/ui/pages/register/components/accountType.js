// Copyright 2017, University of Colorado Boulder

/**
 * PhET Registration Page - Account Type Panel
 * @author Matt Pennington
 *
 * @typedef {Object} React.Component
 * @property {function} setState
 *
 * @typedef {Object} component - a jsx component
 **/

import React from 'react';
import Modal from 'react-modal';

import CheckBox from './checkBox.js';
import { ModalStyle } from './modalStyle.js'

import {USER_TYPES_ARRAY,USER_TYPES_CONSTANTS} from '/imports/api/users/users';
import {PUBLIC_ORIGIN} from '/imports/api/data/constants.js';

/**
 * @param {function} next Callback for moving to the next screen
 *
 * @return {React.Component} the first screen in the registration page activity
 **/
export default class AccountTypePanel extends React.Component {
  constructor() {
    super();
    this.state = {
      typesSelected: new Array( USER_TYPES_ARRAY.length ).fill( false ),
      dialogIsOpen: false,
      errorMessage: null
    }
  }

  updateTypesSelected( userType ) {
    const typesSelected = this.state.typesSelected;
    const index = USER_TYPES_ARRAY.indexOf( userType );
    typesSelected[ index ] = !typesSelected[ index ];
    this.setState( { typesSelected } );
  }

  next( event ) {
    event.preventDefault();
    event.stopPropagation();

    this.setState( { errorMessages: null } );

    if ( this.state.typesSelected.filter( ( i ) => { return i; } ).length === 0 ) {
      this.setState( { errorMessages: { types: 'Please select a type' } } );
    }
    else {
      this.state.typesSelected.forEach( ( isSelected, index ) => {
        if ( isSelected ) {
          this.props.user.types.push( USER_TYPES_ARRAY[ index ] );
        }
      } );

      this.props.user.validateAccountTypes( ( user, errorMessages ) => {
        if ( errorMessages === null ) {
          // If user only selects student, display confirmation dialog
          if ( user.types.length === 1 && user.types[0] === USER_TYPES_CONSTANTS.STUDENT ) {
            this.setState( { dialogIsOpen: true, user } );
          }
          // If no error and user selects at least one non-student type, forward to next screen
          else {
            this.props.next( user );
          }
        }
        // If there is an error show it and scroll to the top
        else {
          window.scrollTo( 0, 340 );
          this.setState( { errorMessages } );
        }
      } );
    }
  }

  render() {
    const listItems = USER_TYPES_ARRAY.map( ( name ) => {
      return (
        <li key={name}>
          <CheckBox name={name} onChange={() => this.updateTypesSelected( name )}/>
        </li>
      );
    } );

    return (
      <div>
        <form onSubmit={ this.next.bind( this ) }>
          <div><span className="error">{this.state.errorMessages && this.state.errorMessages.types ? '* ' : ''}</span>I am a...</div>
          <ul id={this.props.id + '-checkbox-list'}>
            {listItems}
          </ul>
          <span className="error">{this.state.errorMessages && this.state.errorMessages.types}</span>
          <button className="enabled" type="submit">NEXT</button>
        </form>


        <Modal
          isOpen={this.state.dialogIsOpen}
          style={ModalStyle}
          contentLabel="Student confirmation">

          <div>Students do not need to register for a PhET account in order to use the PhET sims.</div>
          <br /><br />
          <a className="enabled button" href={ PUBLIC_ORIGIN + '/' + this.props.locale + '/simulations/category/new' }>PLAY WITH SIMS</a>
          <button className="disabled" onClick={() => this.props.next(this.state.user)}>CONTINUE ANYWAY</button>
        </Modal>
      </div>
    );
  }
}