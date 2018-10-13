/*
 * @link           https://narrationsd.com/
 * @copyright Copyright (c) 2018 Narration SD
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * GraphGL returns are orderly, with data and errors sections, also our lvMeta
 *
 * You'll call GqlConnect in the ways explained in BaseConnect, additionally providing a
 * reporter when you have one.
 *
 *     connect = new GqlConnect(this.$route)
 *
 * As explained there, it's not clear now that you would ever use sourceBase,
 * and that argument is probably going to be removed soon.
 */

import BaseConnect from './base-connect'
import helpers from '@/live-vue-js/helpers.js'

export default class GqlConnect extends BaseConnect {

  constructor (reporter = null, sourceBase = null) {
    super(reporter, sourceBase, 'gapi/query') // set the tag for gql query

    // here define any dynamic post-construction properties
    // required, beyond those provided by BaseConnect
  }

  convertLiveVueDiv () {
    let sourceBase = document.getElementById('liveVue')
    if (sourceBase) {
      let source = sourceBase.innerText // decodes any encoded html

      let response = JSON.parse(source)
      helpers.apiLog('convertLiveVueDiv source is: ' + JSON.stringify(response))

      let fullResult = {}

      if (response.errors !== undefined) { // errors, in gql
        let errMsg = 'convertLiveVueDiv: original page server reports error: ' +
          JSON.stringify(response.errors)
        this.reporter(errMsg)
        throw new Error('halted for error') // a hard stop, before components fail themselves
      } else {
        fullResult = response
      }

      if (!fullResult) {
        helpers.devLog('convertLiveVueDiv: Empty data response')
        return null
      }
      helpers.apiLog('convertLiveVueDiv response is: ' + JSON.stringify(fullResult))

      return fullResult
    } else {
      helpers.devLog('no source div, trying remote api')
      return null // because we signal with this, so remote can get called
    }
  }

  convertRemoteApi (response) {
    helpers.apiLog('convertRemoteApi gql data is: ' + JSON.stringify(response))

    let fullResult = {}

    if (response.errors !== undefined) {
      let errMsg = 'convertRemoteApi: gql server reports: ' +
        JSON.stringify(response.errors)
      throw new Error(errMsg)
    } else {
      fullResult = response
    }

    if (this.isEmpty(fullResult)) {
      throw new Error('convertRemoteApi: gql Empty data response')
    }
    helpers.apiLog('convertRemoteApi gql result is: ' + JSON.stringify(fullResult))

    return fullResult
  }

  okToUseDataDiv (fullResult) {
    // This will help if routes.js or live-vue settings are wrong
    if (fullResult.lvMeta.dataSourceType !== 'gapi') {
      console.log('gql-connect expected gapi data, ignoring from: ' +
        fullResult.lvMeta.dataSourceType)
      return false // right away, it's not for this customer
    }

    let requestSignature = this.formRequestSignature()
    let apiPattern = fullResult.lvMeta.dataApiPattern
    let ok = false

    // n.b. we would be using this for actual Live Vue/Prevue, or
    // equally for Live Vue's no-round-trip speedup on spa opening
    let requestPattern = '?script=' + this.dataQuery + '&uri=' + requestSignature

    ok = (apiPattern === requestPattern)

    helpers.devLog((ok ? '' : 'Not ') + 'ok to use Live Vue div having: ' +
      apiPattern + ' vs request ' + requestPattern)

    return ok
  }

  formRequestSignature () {
    let source = window.location.pathname

    if (source === '/') {
      return source // special case matched in php Sources
    }

    // otherwise, we carry on with simplest possible signture extractor
    // trust that solving with full or even split case regex goes out of
    // bounds rapidly...

    source = source.substr(1) // lose the slash, for match

    let pattern = '(?:\\d+-)(.*)'

    let segments = source.split('/')
    let requestSignature = null

    // a first segment that matches will contain the edit handle, if this is edit
    for (let segment of segments) {
      let re = new RegExp(pattern) // or it would advance each time
      let segmentItems = re.exec(segment)
      helpers.apiLog('segment: ' + segment + ', segmentItems: ' + JSON.stringify(segmentItems))
      if (segmentItems) {
        requestSignature = segmentItems[1] // [1] is the second portion of the match
        break
      }
    }

    if (!requestSignature) { // then it's not an edit
      requestSignature = source // so take the full path for the signature
    }

    helpers.apiLog('formRequestSignature: result is: ' + requestSignature)

    return requestSignature
  }

  dataQueryNormalize (dataQuery) {
    helpers.apiLog('gql dataQuery to normalize: ' + dataQuery)
    let path = window.location.pathname.substr(1) // lose the slash, for match
    dataQuery = '?script=' + dataQuery

    if (this.skipUri !== undefined && this.skipUri) {
      dataQuery += '&skipUri' // visible for unset uri -- not used by Live Vue plugin
    } else {
      dataQuery += '&uri=' + path
    }

    helpers.apiLog('normalized query: ' + dataQuery)
    return dataQuery
  }
}
