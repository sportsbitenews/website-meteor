// Copyright 2017, University of Colorado Boulder

/**
 * Translated String Interface
 * @author Matt Pennington
 **/

import {PUBLIC_ORIGIN, ENGLISH_LOCALE} from '/imports/api/data/constants.js'

export default ( keys, locale, page ) => {
  page.setState( { stringsReady: false } );
  let stringData = {};

  // Get english strings for fallback
  if ( locale !== ENGLISH_LOCALE ) {
    locale = ENGLISH_LOCALE + ',' + locale;
  }

  HTTP.get(
    PUBLIC_ORIGIN + '/services/translated-strings', {
      params: {
        keys: keys.join( ',' ),
        locale: locale
      }
    },
    ( error, result ) => {
      console.log( result );
      stringData = result.data;
      page.setState( { stringsReady: true } );
    }
  );

  return ( key ) => {
    const ts = stringData[ key ]
    if ( ts ) {
      return ts[ locale ] ? ts[ locale ] : ts[ ENGLISH_LOCALE ];
    }
    else {
      return '';
    }
  }
}
