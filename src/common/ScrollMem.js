// A small module  to do own scroll memory positioning,
// sharable between Live Vue Js implementations

function getPageKey () {
  // this is tagged in a Gatsby-like way but our own variant, for clarity and lack of collisions
  return '%%live-vue-pos' + '|' + window.location.pathname
}

function rememberPosition (e) {
  window.sessionStorage.setItem(getPageKey(),
    JSON.stringify([ window.scrollX, window.scrollY ]))
}

export default {

  setUp () {
    window.addEventListener('unload', rememberPosition)
  },

  takeDown () {
    window.removeEventListener('unload', rememberPosition)
  },

  remember () {
    try {
      const currentPosition = JSON.parse(window.sessionStorage.getItem(getPageKey()))
      if (currentPosition && Array.isArray(currentPosition)) {
        // uncomment for troubleshooting
        // console.log('scrolling to: ' + JSON.stringify(currentPosition))
        window.scrollTo(currentPosition[0], currentPosition[1])
      }
    } catch (e) {
      // uncomment for troubleshooting
      console.log('no currentPosition yet: ' + e)
    }
  }
}
