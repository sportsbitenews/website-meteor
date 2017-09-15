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

import {USER_TYPES_ARRAY,USER_TYPES_CONSTANTS} from '/imports/api/users/users';
import {PUBLIC_ORIGIN} from '/imports/api/data/constants.js';

/**
 * Styles used in the modal dialog urging students not to register
 **/
const studentConfirmationStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '40px',
    transform: 'translate(-50%, -50%)',
    background: '#EEEEEE',
    border: '1px solid #000000',
    textAlign: 'center'
  }
};

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
    typesSelected[ USER_TYPES_ARRAY.indexOf( userType ) ] = !typesSelected[ USER_TYPES_ARRAY.indexOf( userType ) ];
    this.setState( { typesSelected } );
  }

  next( event ) {
    event.preventDefault();
    event.stopPropagation();


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
          else {
            this.props.next( user );
          }
        }
        else {
          this.setState( { errorMessages } );
        }
      } ).bind( this );
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
          style={studentConfirmationStyles}
          contentLabel="Example Modal">

          <div>Students do not need to register for a PhET account in order to use the PhET sims.</div>
          <br /><br />
          <a className="enabled button" href={ PUBLIC_ORIGIN + '/' + this.props.locale + '/simulations/category/new' }>PLAY WITH SIMS</a>
          <button className="disabled" onClick={() => this.props.next(this.state.user)}>CONTINUE ANYWAY</button>
        </Modal>
      </div>
    );
  }
}