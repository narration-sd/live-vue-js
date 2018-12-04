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
import axios from 'axios'

export default class GqlConnect extends BaseConnect {

  constructor (reporter = null, sourceBase = null, sourceTag = 'gapi/query') {
    super(reporter, sourceBase, sourceTag) // we could override the tag

    // here define any dynamic post-construction properties
    // required, beyond those provided by BaseConnect
  }
  // postDirect() allows you to send your GraphQL query and variables directly
  // in JSON to a compliant server. It has the advantage of displaying
  // errors with the Connect reporter, consistently with Live Vue calls.
  // It will use POST, and either a server you specify with setSourceBase()
  // or as default, one you have provided in config.

  // postDirect() is straightforward as it doesn't need to do data conversions
  // or signature validations, while it does continue to support any kind of
  // result reporting. It's available only on Connects which can post
  // their own queries -- presently GraphQl

  postDirect (queryJson, appDataSaver, headers = null, ...extraParams) {
    this.dataQuery = queryJson

    // for later feature or children; spread so zero or multiple possible
    this.extraParams = extraParams

    // tokens?
    let requestConfig = headers
      ? { headers: headers }
      : {}

    helpers.devLog('postDirect: data call on ' +
      this.dataApi + ' for ' + JSON.stringify(this.dataQuery))
    helpers.apiLog('postDirect: requestConfig: ' + JSON.stringify(requestConfig))

    axios.post(this.dataApi, this.dataQuery, requestConfig)
      .then((fullResult) => {
        if (fullResult.data.errors) {
          this.reporter('postDirect Error: ' + JSON.stringify(fullResult.data.errors))
        }
        helpers.devLog('postDirect: successful from ' + this.dataApi)
        helpers.apiLog('postDirect fullResult: ' + JSON.stringify(fullResult))
        appDataSaver(fullResult.data)
      })
      .catch((error) => {
        let errMsg = this.reportAxios(this.dataApi, error, 'postDirect')
        this.reporter(errMsg)
      })
  }

  // These are small but important, and unique to gql-connect: they install
  // literal GraphQL script and headers, so that base Connect will use them,
  // when you want to call a Gql server with specific query code.

  setGqlDirectQuery (query) {
    this.gqlQuery = query
    this.noDataQueryOk = true
  }

  setGqlDirectHeaders (headers) {
    this.gqlHeaders = headers
  }

  validateLiveVueDiv (response, haltOnError = true) {
    // these are usually similar but differing, for inheriting connects

    if (haltOnError && response.errors !== undefined) { // errors, in gql
      let errMsg = 'validateLiveVueDiv: original page server reports error: ' +
        JSON.stringify(response.errors)
      this.reporter(errMsg)
      throw new Error(errMsg) // a hard stop, before components fail themselves
    }
    helpers.apiLog('validateLiveVueDiv response is: ' + JSON.stringify(response))

    return response
  }

  convertRemoteApi (response) {
    helpers.apiLog('convertRemoteApi: data is: ' + JSON.stringify(response))

    let fullResponse = {}

    if (response.errors !== undefined) {
      let errMsg = 'convertRemoteApi: gql server reports: ' +
        JSON.stringify(response.errors)
      helpers.devLog(response.errors)
      throw new Error(errMsg)
    } else {
      fullResponse = response
    }
    helpers.apiLog('convertRemoteApi gql result is: ' + JSON.stringify(fullResponse))

    return fullResponse
  }

  // okToUseDataDiv() is not required as of prior use check set/getDivDataUsed(),
  // but as we've done the work, it's likely to useful for helping correct
  // initial routing or Settings errors.
  okToUseDataDiv (divContent, haltOnError = true) {
    if (divContent.lvMeta.dataSourceType !== 'gapi') {
      helpers.devLog('gql-connect expected gapi data, ignoring from: ' +
        divContent.lvMeta.dataSourceType)
      return false // right away, it's not for this customer
    }

    let requestSignature = this.formRequestSignature()
    let apiPattern = divContent.lvMeta.dataSignature
    let ok = false

    // n.b. we would be using this for actual Live Vue/Prevue, or
    // equally for Live Vue's no-round-trip speedup on spa opening
    let matchableQuery = this.matchableQuery(this.dataQuery)
    let requestPattern = '?' + matchableQuery + '&uri=' + requestSignature

    ok = (apiPattern === requestPattern)

    // we don't check this if not ok, as there may be an error
    // left over in the div from a previous served app page load
    if (ok && haltOnError && divContent.errors !== undefined) { // errors, in gql
      let errMsg = 'okToUseDataDiv: server div reports error: ' +
        JSON.stringify(divContent.errors)
      this.reporter(errMsg)
      // a hard stop, before components fail themselves
      helpers.devLog(errMsg)
      throw new Error('halted with stack trace for error message')
    }

    helpers.apiLog('okToUseDataDiv: ' +
      (ok ? '' : 'Not ') + 'ok to use Live Vue div marked: ' +
      apiPattern + ' vs request ' + requestPattern)

    return ok
  }

  matchableQuery (fullQuery) {
    if (this.isLivePreview()) {
      // no params need apply; the Live Vue is determined by edit url only
      let parts = fullQuery.split('&')
      return parts[0] // just the script
    } else {
      // there can be params, but we don't want flags
      let params = fullQuery.split('&')
      let nonFlagParams = ''

      for (let param of params) {
        switch (param) {
          case 'directUri':
            continue
          default:
            nonFlagParams += nonFlagParams
              ? '/' + param
              : param
        }
      }

      return nonFlagParams
    }
  }

  formRequestSignature () {
    let source = window.location.pathname

    if (source === '/') {
      return source // special case matched in php Sources
    }

    // otherwise, we carry on with simplest possible signature extractor
    // one may trust that the alternative, solving with full or even split
    // case regex, goes out of bounds rapidly...

    // source wants to be bare for all match comparisons
    source = helpers.stripLeadingTrailingSlashes(source)

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
    dataQuery = '?' + dataQuery

    if (this.skipUri !== undefined && this.skipUri) {
      dataQuery += '&skipUri' // visible flag for no uri; not used by LV plugin
    } else {
      dataQuery += '&uri=' + path
    }

    helpers.apiLog('normalized query: ' + dataQuery)
    return dataQuery
  }
}
