// Copyright 2017, University of Colorado Boulder

/**
 * Translated String Interface
 * @author Matt Pennington
 **/

 const ENGLISH_LOCALE = 'en';

 export default ( keys, locale, page ) => {
   page.setState( { stringsReady: false } );
   let stringData = {};

   // Get english strings for fallback
   if ( locale !== ENGLISH_LOCALE ) {
     locale = ENGLISH_LOCALE + ',' + locale;
   }

   HTTP.get(
     'http://192.168.56.101/services/translated-strings', {
       params: {
         keys: keys.join( ',' ),
         locale: locale
       }
     },
     ( error, result ) => {
       console.log(result);
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
