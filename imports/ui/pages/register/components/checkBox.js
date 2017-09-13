// Copyright 2017, University of Colorado Boulder

/**
 * PhET Registration Page - CheckBox
 * @author Matt Pennington
 **/

/**
 * @param {string} props.name - the name of the component, displayed in the label
 * @param {function} props.onChange - listener called when the checked state of this component changes
 *
 * @return {component} checkbox component with trailing label
 **/
const CheckBox = ( props ) => {
  return (
    <label htmlFor={ props.name }>
      <input
        type="checkbox"
        id={ props.name }
        onChange={ props.onChange }
        defaultChecked={ props.checked }
      />
      { props.name }
    </label>
  );
};

export default CheckBox;