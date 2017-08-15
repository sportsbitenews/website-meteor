// Copyright 2017, University of Colorado Boulder

/**
  * PhET Registration Page
  * @author Matt Pennington
  **/

import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Helmet from 'react-helmet';

import './register.css';


// SVG parameters for HeaderLine
const phetYellow = "#FCEE21";
const disabledGrey = "#AAAAAA";
const lineHeight = 35;
const strokeWidth = 1.5;

/**
  * Immutably changes the state of a React.Component to update the given parameter with the given value
  * @param {React.Component} self - object to update.  Required to have a state member object and a setState member function.
  * @param {string} parameterName
  * @param {object} newValue
  **/
function updateState( self, parameterName, newValue ) {
  const newState = self.state;
  newState[ parameterName ] = newValue;
  self.setState( newState );
}

/**
  * @param {boolean} enabled - if true the node is yellow otherwise it is grey
  * @param {boolean} active - if true the node is a paper airplane otherwise it is a cirle
  *
  * @return {component} - a horizontal line
  **/
function Node( props ) {
  const radius = ( lineHeight * .9 ) / 2;
  const innerRadius = .8 * radius;
  const diameter = 2 * radius;

  if ( props.active ) {
    return (
      <img src="/img/yellow_paper_airplane.png" alt="" aria-hidden="true"/>
    )
  }
  else if ( props.enabled ) {
    return (
      <svg height={ diameter } width={ diameter }>
        <circle cx={ radius } cy={ radius } r={ innerRadius } stroke={ phetYellow } strokeWidth={ strokeWidth } fill={ phetYellow } />
      </svg>
    );
  }
  else {
    return (
      <svg height={ diameter } width={ diameter }>
        <circle cx={ radius } cy={ radius } r={ innerRadius } stroke={ disabledGrey } strokeWidth={ strokeWidth } fillOpacity="0.0" />
      </svg>
    );
  }
}

/**
  * @param {boolean} enabled - if true the line is yellow otherwise it is grey
  *
  * @return {component} - a horizontal line
  **/
function Line( props ) {
  const width = 300;
  const start = 10;
  const end = width - ( start * 2 );

  if ( props.enabled ) {
    return (
      <svg height={ lineHeight } width={ width }>
        <line x1={ start } y1={ lineHeight / 2 } x2={ end } y2={ lineHeight / 2 } stroke={ phetYellow } strokeWidth={ strokeWidth } fill={ phetYellow } />
      </svg>
    );
  }
  else {
    return (
      <svg height={ lineHeight } width={ width }>
        <line x1={ start } y1={ lineHeight / 2 } x2={ end } y2={ lineHeight / 2 } stroke={ disabledGrey } strokeWidth={ strokeWidth } />
      </svg>
    );
  }
}

/**
  * @param {integer} page page number of the current location, should be in the range (1,3)
  *
  * @return {component} the dots, paper airplane, horizontal rules and labels at the top of the registration page
  **/
function HeaderLine( props ) {
  return (
    <div >
      <div>
        <Node enabled={ props.page > 0 } active={ props.page === 1 }/>
        <Line enabled={ props.page > 1 } />
        <Node enabled={ props.page > 1 } active={ props.page === 2 }/>
        <Line enabled={ props.page > 2 } />
        <Node enabled={ props.page > 2 } active={ props.page === 3 }/>
      </div>
      <div id="header-line-text">
        <span>Account Type</span>
        <span>Contact Info</span>
        <span>Additional Info</span>
      </div>
    </div>
  );
}

/**
  * @param {string} name - the name of the component, displayed in the label
  * @param {function} onChange - listener called when the checked state of this component changes
  *
  * @return {component} checkbox component with trailing label
  **/
function CheckBox(props) {
  return (
    <li>
      <label htmlFor={props.name}>
        <input type="checkbox" id={props.name} onChange={ props.onChange }/> {props.name}
      </label>
    </li>
  );
}

/**
  * @param {string} name - the name of the component, displayed in the label
  * @param {function} onChange - listener called when the text of this component changes
  *
  * @return {component} text input component with trailing label
  **/
function TextInput(props) {
  return (
    <span>
      <label htmlFor={props.name}>
         {props.name}
         <br />
        <input type="text" id={props.name} onChange={ props.onChange }/>
      </label>
    </span>
  );
}

/**
  * @param {string} name - the name of the component, displayed in the label
  * @param {function} onChange - listener called when the text of this component changes
  *
  * @return {component} text input component with trailing label
  **/
function Password(props) {
  return (
    <span>
      <label htmlFor={props.name}>
         {props.name}
         <br />
        <input type="password" id={props.name} onChange={ props.onChange }/>
      </label>
    </span>
  );
}

/**
  * Styles used in the modal dialog urging students not to register
  **/
const studentConfirmationStyles = {
  content : {
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

// List of user types for the AccountTypePanel
const userTypes = [ 'Teacher', 'Pre-service Teacher', 'Teacher Educator/Coach', 'Student', 'Researcher', 'Translator', 'Parent', 'Other' ];

/**
  * @param {function} next Callback for moving to the next screen
  *
  * @return {React.Component} the first screen in the registration page activity
  **/
class AccountTypePanel extends React.Component {
  constructor() {
    super();
    this.state = {
      typesSelected: Array(userTypes.length).fill(false),
      dialogIsOpen: false,
      errorMessage: null
    }
  }

  updateTypesSelected( userType ) {
    const typesSelected = this.state.typesSelected;
    typesSelected[ userTypes.indexOf( userType ) ] = !typesSelected[ userTypes.indexOf( userType ) ];
    updateState( this, 'typesSelected', typesSelected );
  }

  next() {
    // If user only selects student, display confirmation dialg
    if ( this.state.typesSelected[ userTypes.indexOf( 'Student' ) ]
      && this.state.typesSelected.filter( ( i ) => { return i; } ).length === 1 ) {
      updateState( this, 'dialogIsOpen', true );
    }
    // If no type is selected add an error message
    else if ( this.state.typesSelected.filter( ( i ) => { return i; } ).length === 0 ) {
      updateState( this, 'errorMessage', 'Please select a type' );
    }
    // Otherwise continue to the next screen
    else {
      this.props.next()
    }
  }

  render() {
    const listItems = userTypes.map( (name) => {
      return <CheckBox key={ name } name={ name } onChange={ () => this.updateTypesSelected( name ) }/>;
    })

    return (
      <div>
        <div><span className="error">{ this.state.errorMessage ? '* ' : '' }</span>I am a...</div>
        <ul id={this.props.id + '-checkbox-list'}>
          {listItems}
        </ul>
        <span className="error">{ this.state.errorMessage ? this.state.errorMessage : '' }</span>
        <button className="enabled" onClick={ () => { this.next() } }>NEXT</button>

        <Modal
          isOpen={this.state.dialogIsOpen}
          style={studentConfirmationStyles}
          contentLabel="Example Modal">

          <div>Students do not need to register for a PhET account in order to use the PhET sims.</div><br /><br />
          <a className="enabled button" href="https://phet.colorado.edu/en/simulations/category/new">PLAY WITH SIMS</a>
          <button className="disabled" onClick={ this.props.next }>CONTINUE ANYWAY</button>
        </Modal>
      </div>
    );
  }
}

/**
  * @param {function} next Callback for moving to the next screen
  *
  * @return {React.Component} the second screen in the registration page activity
  **/
class ContactInfoPanel extends React.Component {
  render() {
    return (
      <div>
        <TextInput name="Primary Email address" />
        <TextInput name="Secondary Email address" />
        <TextInput name="Re-enter Primary Email address" />
        <br />
        <Password name="Password" />
        <Password name="Re-enter Password" />
        <br />
        <TextInput name="First Name" />
        <TextInput name="Last Name" />
        {/* <DateSelect name="Birthday(optional)" />
        <LocationSelect />
        <TextInput name="City" />
        <ZipCodeInput /> */}
        <span>

        </span>
        <br />
        <span>Email subsciptions</span>
        <CheckBox name="Receive PhET Emails" />
        <button className="enabled" onClick={ this.props.next }>NEXT</button>
      </div>
    );
  }
}

/**
  * @param {function} next Callback for moving to the next screen
  *
  * @return {React.Component} the third screen in the registration page activity
  **/
class AdditionalInfoPanel extends React.Component {
  render() {
    return (
      <div>
        <button className="enabled" onClick={ this.props.onClick }>REGISTER NOW</button>
      </div>
    );
  }
}

/**
  * TODO: implement this using iframe or ESI component or something from the wicket site
  * @return {component} the footer panel
  **/
function FooterPanel() {
  return <div>Hello from FooterPanel</div>;
}

/**
  * @return {React.Component} main class
  **/
class Layout extends React.Component {
  constructor() {
      super();
      this.state = {
        page: 1,
        types: [],
        primaryEmail: '',
        secondaryEmail: '',
        password: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        country: '',
        state: '',
        city: '',
        zipCode: '',
        twitterHandle: '',
        receiveEmail: true,
        organization: '',
        subjects: [],
        grades: [],
        teachingExperience: 0,
        phetExperience: null,
        school: '',
        deviceList: [],
        lmsList: [],
        curriculumProviderList: []
      }
  }

  handleNext() {
      let page = this.state.page;
      page += 1;
      if ( page > 3 ) {
        console.log( 'done' );
        // POST data to the website
        // Redirect user to the dest/home page
        return;
      }
      this.setState( { page } );
  }

  render() {
    let contentPanel;
    let headerText;
    switch ( this.state.page ) {
      case 1:
        headerText = 'Create Your PhET Account';
        contentPanel = <AccountTypePanel next={ () => { this.handleNext() } }/>;
        break;
      case 2:
        headerText = 'Tell Us About You';
        contentPanel = <ContactInfoPanel next={ () => { this.handleNext() } }/>;
        break;
      case 3:
        headerText = 'Tell Us About Your Organization';
        contentPanel = <AdditionalInfoPanel next={ () => { this.handleNext() } }/>;
        break;
      default:
        headerText = '';
        contentPanel = <div>Error in contentPanel index</div>;
    }

    return (
      <div>
        <Helmet>
          <title>Register</title>
        </Helmet>
        
        <div id="sign-in">
          <span>Already Registered?</span>
          { /* TODO: Handle locale and dest */ }
          <a className="button disabled" href="https://phet.colorado.edu/en/sign-in">SIGN IN</a>
        </div>

        <div id="header">
            <img src="/img/phet_registration_logo.png" alt="PhET Logo"/>
            <h1>{ headerText }</h1>
            <HeaderLine page={ this.state.page } />
        </div>

        <div id="content">
          { contentPanel }
        </div>

        <FooterPanel />
      </div>
    );
  }
}

export const RegistrationPage = ( { locale } ) => (
  <Layout locale={ locale } />
)
