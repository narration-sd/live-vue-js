// ScrollMemNonEs6.js -- A small library to do own scroll memory positioning
// It's decomposed from an ES6-React module version, for proper use with Craft and Twig

function getPageKey () {
  // this is tagged in a Gatsby-like way but our own variant, for clarity and lack of collisions
  return '%%live-vue-pos' + '|' + window.location.pathname;
}

function rememberPosition (e) {
  window.sessionStorage.setItem(getPageKey(),
    JSON.stringify([ window.scrollX, window.scrollY ]));
}

function scrollSetUpPositioning () {
  window.addEventListener('unload', this.rememberPosition);
}

function scrollTakeDownPositioning () {
  window.removeEventListener('unload', this.rememberPosition);
}

function scrollSetRememberedPosition () {
  try {
    const currentPosition = JSON.parse(window.sessionStorage.getItem(getPageKey()));
    if (currentPosition && Array.isArray(currentPosition)) {
      // uncomment for troubleshooting
      // console.log('scrolling to: ' + JSON.stringify(currentPosition));
      window.scrollTo(currentPosition[0], currentPosition[1]);
    }
  } catch (e) {
    // uncomment for troubleshooting
    // console.log('no currentPosition yet: ' + e);
  }
}
