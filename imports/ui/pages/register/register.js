// Copyright 2017, University of Colorado Boulder

/**
 * PhET Registration Page
 * @author Matt Pennington
 *
 * @typedef {Object} React.Component
 * @property {function} setState
 *
 * @typedef {Object} component - a jsx component
 **/

// TODO: implement translatability

import React from 'react';
import Modal from 'react-modal';
import Helmet from 'react-helmet';

import SchoolSelector from '/imports/ui/components/schools/selector.js';

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
      <img src="/img/yellow_paper_airplane.png" alt="" aria-hidden="true"/>
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
function HeaderLine( props ) {
  return (
    <div>
      <div>
        <Node enabled={props.page > 0} active={props.page === 1}/>
        <Line enabled={props.page > 1}/>
        <Node enabled={props.page > 1} active={props.page === 2}/>
        <Line enabled={props.page > 2}/>
        <Node enabled={props.page > 2} active={props.page === 3}/>
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
 * @param {string} props.name - the name of the component, displayed in the label
 * @param {function} props.onChange - listener called when the checked state of this component changes
 *
 * @return {component} checkbox component with trailing label
 **/
function CheckBox( props ) {
  return (
    <li>
      <label htmlFor={props.name}>
        <input type="checkbox" id={props.name} onChange={props.onChange}/> {props.name}
      </label>
    </li>
  );
}

/**
 * @param {string} props.name - the name of the component, displayed in the label
 * @param {function} props.onChange - listener called when the text of this component changes
 *
 * @return {component} text input component with trailing label
 **/
function TextInput( props ) {
  return (
    <span>
      <label htmlFor={props.name}>
         {props.name}
        <br />
        <input type="text" id={props.name} onChange={props.onChange}/>
      </label>
    </span>
  );
}

/**
 * @param {string} props.name - the name of the component, displayed in the label
 * @param {function} props.onChange - listener called when the text of this component changes
 *
 * @return {component} text input component with trailing label
 **/
function Password( props ) {
  return (
    <span>
      <label htmlFor={props.name}>
         {props.name}
        <br />
        <input type="password" id={props.name} onChange={props.onChange}/>
      </label>
    </span>
  );
}

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
      typesSelected: new Array( userTypes.length ).fill( false ),
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
      this.props.next( { types: this.state.typesSelected } )
    }
  }

  render() {
    const listItems = userTypes.map( ( name ) => {
      return <CheckBox key={name} name={name} onChange={() => this.updateTypesSelected( name )}/>;
    } );

    return (
      <div>
        <div><span className="error">{this.state.errorMessage ? '* ' : ''}</span>I am a...</div>
        <ul id={this.props.id + '-checkbox-list'}>
          {listItems}
        </ul>
        <span className="error">{this.state.errorMessage ? this.state.errorMessage : ''}</span>
        <button className="enabled" onClick={() => { this.next() }}>NEXT</button>

        <Modal
          isOpen={this.state.dialogIsOpen}
          style={studentConfirmationStyles}
          contentLabel="Example Modal">

          <div>Students do not need to register for a PhET account in order to use the PhET sims.</div>
          <br /><br />
          <a className="enabled button" href="https://phet.colorado.edu/en/simulations/category/new">PLAY WITH SIMS</a>
          <button className="disabled" onClick={() => this.props.next({types: this.state.typesSelected})}>CONTINUE ANYWAY</button>
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
  constructor() {
    super();
    this.state = {
      primaryEmail: '',
      confirmEmail: '',
      secondaryEmail: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      twitterHandle: '',
      receiveEmail: true,
      errorMessage: ''
    }
  }

  next() {
    let errorMessage = '';

    if ( !( this.state.primaryEmail.indexOf( '@' ) > 0 ) || this.state.primaryEmail.length < 5 ) {
      errorMessage += "Please enter a valid email address<br />";
    }
    else if ( this.state.primaryEmail !== this.state.confirmEmail ) {
      errorMessage += "Please confirm email address<br />";
    }

    if ( this.state.secondaryEmail.length > 0 && ( !( this.state.secondaryEmail.indexOf( '@' ) > 0 ) || this.state.secondaryEmail.length < 5 ) ) {
      errorMessage += "Please enter a valid secondary email address<br />";
    }

    //TODO: check if either email already exists in the database

    if ( this.state.password.length < 8 ) {
      errorMessage += "Password should be at least 8 characters<br />";
    }
    else if ( this.state.password !== this.state.confirmPassword ) {
      errorMessage += "Please confirm password<br />";
    }

    if ( this.state.firstName.length <= 0 ) {
      errorMessage += "Please enter your first name<br />";
    }

    if ( this.state.lastName.length <= 0 ) {
      errorMessage += "Please enter your last name<br />";
    }

    if ( this.state.country.length <= 0 ) {
      errorMessage += "Please select a country<br />";
    }

    if ( this.state.state.length <= 0 ) {
      errorMessage += "Please select a state or province<br />";
    }

    if ( this.state.city.length <= 0 ) {
      errorMessage += "Please enter a city<br />";
    }

    if ( this.state.country === 'United States' && this.state.zipCode.length != 5 ) {
      errorMessage += "Please enter your 5 digit zip code<br />";
    }

    if ( errorMessage !== '' ) {
      //TODO: handle error
      console.log(errorMessage);
      this.setState( { errorMessage } );
      return;
    }

    this.props.next( {
      primaryEmail: this.state.primaryEmail,
      secondaryEmail: this.state.secondaryEmail,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      country: this.state.country,
      state: this.state.state,
      city: this.state.city,
      zipCode: this.state.zipCode,
      twitterHandle: this.state.twitterHandle,
      receiveEmail: this.state.receiveEmail,
      showEmailHelper: false
    } );
  }

  render() {
    return (
      <div className="contact_info_panel">
          <div>
            <label>
              <span>Primary Email address</span>
              <input type="text" value={ this.state.primaryEmail } onChange={ (event) => { this.setState( { primaryEmail: event.target.value } ); } }/>
            </label>
            <label>
              <span>Re-enter Primary Email address</span>
              <input type="text" value={ this.state.confirmEmail } onChange={ (event) => { this.setState( { confirmEmail: event.target.value } ); } }/>
            </label>
          </div>
          <div>
            <label>
              <span style={{float: 'left'}}>Secondary Email address (optional)</span>
              <span style={{float: 'right', color: 'navy'}} onClick={ () => { this.setState( { showEmailHelper: !this.state.showEmailHelper } ); } }>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </span>
              <input type="text" value={ this.state.secondary } onChange={ (event) => { this.setState( { secondary: event.target.value } ); } }/>
              { this.state.showEmailHelper
                ? <div className="helper_label">To ensure you can always access your account, we recommend adding a second personal email address</div>
                : ''
              }
            </label>
          </div>
          <div>
            <label>
              <span>Password</span>
              <input type="password" value={ this.state.password } onChange={ (event) => { this.setState( { password: event.target.value } ); } }/>
            </label>
            <label>
              <span>Confirm Password</span>
              <input type="password" value={ this.state.confirmPassword } onChange={ (event) => { this.setState( { confirmPassword: event.target.value } ); } }/>
            </label>
          </div>
          <div></div>
          <div>
            <label>
              <span>First Name</span>
              <input type="text" value={ this.state.firstName } onChange={ (event) => { this.setState( { firstName: event.target.value } ); } }/>
            </label>
          </div>
          <div>
            <label>
              <span>Last Name</span>
              <input type="text" value={ this.state.lastName } onChange={ (event) => { this.setState( { lastName: event.target.value } ); } }/>
            </label>
          </div>
          <hr />
          <div>
            <label>
              <span>Country</span>
              {/*TODO: populate with all countries */}
              <select value={ this.state.country } onChange={ (event) => { this.setState( { country: event.target.value } ); } }>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Mexico">Mexico</option>
                <option value="Brazil">Brazil</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              <span>State/Province</span>
              {/*TODO: populate with all states and update based on country */}
              <select value={ this.state.state } onChange={ (event) => { this.setState( { state: event.target.value } ); } }>
                <option value="Colorado">Colorado</option>
                <option value="California">California</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Disarray">Disarray</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              <span>City</span>
              <input type="text" value={ this.state.city } onChange={ (event) => { this.setState( { city: event.target.value } ); } }/>
            </label>
          </div>
          <div>
          <label>
            {/*TODO: hide if country !== USA */}
            <span>Zip code</span>
            <input type="text" value={ this.state.zipCode } onChange={ (event) => { this.setState( { zipCode: event.target.value } ); } }/>
          </label>
        </div>
        <div>
          <label>
            <div><i className="fa fa-twitter" aria-hidden="true"></i>Twitter Handle (optional)</div>
            <span className="twitter_input"><input type="text" value={ this.state.twitterHandle } onChange={ (event) => { this.setState( { twitterHandle: event.target.value } ); } }/></span>
          </label>
        </div>
        <div></div>
        <div>
          <div className="email_header">Email Subscriptions</div>
          <label>
            <input type="checkbox" checked={this.state.receiveEmail} onChange={ (event) => { this.setState( { receiveEmail: event.target.value } ); } } />
            <label className="checkbox_label">Receive PhET Emails</label>
          </label>
        </div>

          <button className="enabled" onClick={this.next.bind(this)}>NEXT</button>
      </div>


    );
  }
}

/**
 * @param {function} next Callback for moving to the next screen
 *
 * @return {React.Component} the third screen in the registration page activity
 **/
class OrganizationPanel extends React.Component {
  handleSchool(){}
  render() {
    return (
      <div>
        <button className="enabled" onClick={this.props.onClick}>REGISTER NOW</button>
      </div>
    );
  }
}

/**
 * @param {function} next Callback for moving to the next screen
 *
 * @return {React.Component} the third screen in the registration page activity
 **/
class ClassroomPanel extends React.Component {
  handleSchool(){}
  render() {
    return (
      <div>
        <SchoolSelector onClick={this.handleSchool}/>
        <button className="enabled" onClick={this.props.onClick}>REGISTER NOW</button>
      </div>
    );
  }
}

/**
 * TODO: implement this using iframe or ESI component or something from the wicket site
 * @return {component} the footer panel
 **/
function FooterPanel() {
  // TODO: export FooterPanel as component from wicket app
  return <div></div>;
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

  handleNext( userData ) {
    let newState = this.state;

    switch( newState.page ) {
      case 1:
        newState.types = userData.types;
        break;
      case 2:
        newState.primaryEmail = userData.primaryEmail;
        newState.secondaryEmail = userData.secondaryEmail;
        newState.password = userData.password;
        newState.firstName = userData.firstName;
        newState.lastName = userData.lastName;
        newState.country = userData.country;
        newState.state = userData.state;
        newState.city = userData.city;
        newState.zipCode = userData.zipCode;
        newState.twitterHandle = userData.twitterHandle;
        newState.receiveEmail = userData.receiveEmail;
        break;
      case 3:
        console.log( 'done' );
        // POST data to the website
        // Redirect user to the dest/home page
        return;
        break;
      default:

    }
    newState.page += 1;
    this.setState( newState );
  }

  render() {
    let contentPanel;
    let headerText;
    switch( this.state.page ) {
      case 1:
        headerText = 'Create Your PhET Account';
        contentPanel = <AccountTypePanel next={this.handleNext.bind(this)}/>;
        break;
      case 2:
        headerText = 'Tell Us About You';
        contentPanel = <ContactInfoPanel next={this.handleNext.bind(this)}/>;
        break;
      case 3:
        if ( this.state.types.indexOf( 'Teacher' ) >= 0 || this.state.types.indexOf( 'Pre-service Teacher' ) >= 0 ) {
          headerText = 'Tell Us About Your Organization';
          contentPanel = <OrganizationPanel next={this.handleNext.bind(this)}/>;
        }
        else {
          headerText = 'Tell Us About Your Classroom';
          contentPanel = <ClassroomPanel next={this.handleNext.bind(this)}/>;
        }
        break;
      default:
        headerText = '';
        contentPanel = <div>Error in contentPanel index</div>;
    }

    return (
      <div>
        <Helmet>
          <title>Register</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        </Helmet>

        <div id="sign-in">
          <span>Already Registered?</span>
          {/* TODO: Handle locale and dest */}
          <a className="button disabled" href="https://phet.colorado.edu/en/sign-in">SIGN IN</a>
        </div>

        <div id="header">
          <img src="/img/phet_registration_logo.png" alt="PhET Logo"/>
          <h1>{headerText}</h1>
          <HeaderLine page={this.state.page}/>
        </div>

        <div id="content">
          {contentPanel}
        </div>

        <FooterPanel />
      </div>
    );
  }
}

export const RegistrationPage = ( { locale } ) => (
  <Layout locale={locale}/>
);
