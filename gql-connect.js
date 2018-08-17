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

export default class GqlConnect extends BaseConnect {
  constructor (reporter = null, sourceBase = null) {
    super(reporter, sourceBase, 'gapi/query') // set the tag for gql query

    // here define any dynamic post-construction properties for BaseConnect

    this.requestUri = this.formRequestUri()
  }

  convertLiveVueDiv () {
    let sourceBase = document.getElementById('liveVue')
    if (sourceBase) {
      let source = sourceBase.innerText // decodes any encoded html

      let response = JSON.parse(source)
      super.apiLog('convertLiveVueDiv source is: ' + JSON.stringify(response))

      let fullResult = {}

      if (response.errors !== undefined) { // errors, in gql
        let errMsg = 'convertLiveVueDiv: original page server reports error: ' +
          JSON.stringify(response.errors)
        console.log(errMsg)
        this.reporter(response.error)
        throw new Error(errMsg)
      } else {
        fullResult = response
      }

      if (!fullResult) {
        this.devLog('convertLiveVueDiv: Empty data response')
        return null
      }
      this.apiLog('convertLiveVueDiv response is: ' + JSON.stringify(fullResult))

      return fullResult
    } else {
      this.devLog('no source div, trying remote api')
      return null // because we signal with this, so remote can get called
    }
  }

  convertRemoteApi (response) {
    this.apiLog('convertRemoteApi gql data is: ' + JSON.stringify(response))

    let fullResult = {}

    if (response.errors !== undefined) {
      let errMsg = 'convertRemoteApi: gql server reports: ' +
        // this.dataUrl + ': ' +
        JSON.stringify(response.errors)
      throw new Error(errMsg)
    } else {
      fullResult = response
    }

    if (this.isEmpty(fullResult)) {
      throw new Error('convertRemoteApi: gql Empty data response')
    }
    this.apiLog('convertRemoteApi gql result is: ' + JSON.stringify(fullResult))

    return fullResult
  }

  okToUseDataDiv (fullResult) {
    if (fullResult.lvMeta.dataSourceType !== 'gapi') {
      console.log('gql-connect received div data instead from: ' +
        fullResult.lvMeta.dataSourceType)
      return false // right away, it's not for this customer
    }

    this.requestUri = this.formRequestUri()

    let apiPattern = fullResult.lvMeta.dataApiPattern
    let ok = false

    // n.b. we could be using this for actual Live Vue/Prevue, or
    // equally for Live Vue's no-round-trip speedup on spa opening

    // handy to base error reporting if we make this a dynamic property
    this.requestPattern = '?script=' + this.dataQuery + '&uri=' + this.requestUri

    ok = (apiPattern === this.requestPattern)

    this.devLog(ok
      ? ('ok to use Live Vue div having: ' + apiPattern +
        ' vs ' + this.requestPattern)
      : ('not ok to use Live Vue div having: ' + apiPattern +
        ' vs ' + this.requestPattern))

    return ok
  }

  formRequestUri () {
    let source = window.location.pathname.substr(1) // lose the slash, for match
    // see notes in Sources.php resolvedGapiPattern, as we are using a
    // simplest pattern here for reason, with changed approach if need more
    // but really, again, all these need to go to explode with small regexes
    let pattern = '([\\d-]+)?([\\w-]+)$'
    let re = new RegExp(pattern)
    let requestItems = re.exec(source)
    let lastIndex = requestItems.length - 1

    this.apiLog('requestItems: ' + JSON.stringify(requestItems))
    let requestUri = requestItems[lastIndex].length === 0
      ? '(missing)'
      : requestItems[lastIndex]
    this.apiLog('formRequestUri: requestUri is: ' + requestUri)

    return requestUri
  }

  dataQueryNormalize (dataQuery) {
    this.apiLog('gql dataQuery to normalize: ' + dataQuery)
    let path = window.location.pathname.substr(1) // lose the slash, for match
    dataQuery = '?script=' + dataQuery + '&uri=' + path
    this.apiLog('normalized query: ' + dataQuery)
    return dataQuery
  }
}
