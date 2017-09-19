// Copyright 2017, University of Colorado Boulder
// Import client startup through a single index entry point

import './routes.js';
import {MOUNT_PATH} from '/imports/api/data/constants.js';

// Remove _m from path in the client window
window.onload = () => { window.history.replaceState( null, null, window.location.href.replace( MOUNT_PATH, '' ) ); };
