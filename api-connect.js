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
 * By subclassing BaseConnect, we can make connector objects for any
 * web-provided source.
 *
 * ApiConnect handles Craft element-api sources, converting the response
 * formats so that element-api and GraphQL can be used transparently in
 * browser applications.
 *
 * As expected, possible use of Live Vue div is verified.  Refer to BaseConnect,
 * for details of automatic handling for Live Vue vs. direct calls.
 *
 * You'll call ApiConnect in the ways explained in BaseConnect, additionally providing a
 * reporter when you have one.
 *
 *     connect = new ApiConnect(this.$route)
 *
 * As explained there, it's not clear now that you would ever use sourceBase,
 * and that argument is probably going to be removed soon.
 */

import BaseConnect from '@/live-vue-js/base-connect'
import helpers from '@/live-vue-js/helpers.js'

export default class ApiConnect extends BaseConnect {

  constructor (reporter = null, sourceBase = null) {
    super(reporter, sourceBase, 'api') // set the specific api tag

    // here define any dynamic post-construction properties
    // required, beyond those provided by BaseConnect
  }

  validateLiveVueDiv (response, haltOnError = true) {
    // these are usually similar but differing, for inheriting connects

    if (haltOnError && response.error !== undefined) {

      // we've translated api or other errors as best can, to gql format
      // all elements may not be filled in, for element-api code faults

      let errMsg = 'convertLiveVueDiv: web page server reports error: ' +
        response.error.message + ', code: ' + response.error.code +
        ', file: ' + response.error.file + ', line: ' + response.error.line
      this.reporter(errMsg) // for a notifier if present, default console
      throw new Error(errMsg) // a hard stop, before components fail themselves
    } else if (!response) {
      helpers.devLog('convertLiveVueDiv: Empty data response')
      return null
    }

    helpers.apiLog('convertLiveVueDiv response is: ' + JSON.stringify(response))
    return response
  }

  /*
    * Direct element-api returns aren't structured with separate error returns,
    * so we adjust that returned structure for compatibility with gql here.
  */
  convertRemoteApi (response) {
    helpers.apiLog('convertRemoteApi data is: ' + JSON.stringify(response))

    if (response === undefined) {
      console.log('convertRemote: Empty data response')
      return null
    }

    let dataResult = {}

    dataResult = response
    dataResult.lvMeta = {}

    helpers.apiLog('convertRemote result is: ' + JSON.stringify(dataResult))
    return dataResult
  }

  okToUseDataDiv (fullResult, haltOnError = true) {
    if (!fullResult) {
      helpers.devLog('okToUseDataDiv: Empty data response')
      return null
    }
    // This will help if routes.js or live-vue settings are wrong
    if (fullResult.lvMeta.dataSourceType !== 'element-api') {
      helpers.apiLog('api-connect expected element-api data, ignoring from: ' +
        fullResult.lvMeta.dataSourceType)
      return false // right away, it's not for this customer
    }

    let apiPattern = fullResult.lvMeta.dataApiPattern
    let ok = false
    let requestSignature = this.formRequestSignature(fullResult)

    ok = (apiPattern === requestSignature)

    if (ok && haltOnError && fullResult.error !== undefined) { // errors, in gql
      let errMsg = 'convertLiveVueDiv: original page server reports error: ' +
        JSON.stringify(fullResult.error)
      this.reporter(errMsg)
      // a hard stop, before components fail themselves
      throw new Error('halted with stack trace for error message above')
    }

    helpers.devLog((ok ? '' : 'Not ') + 'ok to use Live Vue div having: ' +
      apiPattern + ' vs request ' + requestSignature)

    return ok
  }

  formRequestSignature (fullResult) {
    let requestSignature = ''

    if (fullResult.lvMeta.isLivePreview) {
      // n.b. this is quite like matching resolvedApiPattern() in Sources.php.
      // However, be very careful, as there are many adaptations to js.
      // In particular, even the re pattern differs, due to escapes
      let source = window.location.pathname
      let pattern = '(.*entries\\/)?([a-zA-Z-]+)\\/?[\\d-]*([a-zA-Z-+]+)?'
      let re = new RegExp(pattern)
      let requestItems = re.exec(source)

      // this discovery, apropos for apiLog? But a hint to other Connect dev...
      helpers.apiLog('lv requestItems: ' + JSON.stringify(requestItems))

      if (requestItems === null) {
        let msg = 'okToUseDataDiv: no proper uri match on: ' + source
        throw new Error(msg)
      }

      // we always have to assert the leading / in this branch, so apiPattern
      // can be common to both. See note in Sources.php as to why we couldn't
      // just re group it in.
      requestSignature = requestItems[3].length === 0
        ? '/' + requestItems[2]
        : '/' + requestItems[2] + '/' + requestItems[3]

      requestSignature += this.pagingQuery

    } else {
      let source = window.location.pathname
      requestSignature = source // funny, es6, and eslint even more, about assigns

      if (source !== '/') { // home page is fine as is
        // drop any /digit[s] paging extension, and any ?-introduced query like debug
        let pattern = '((\\/[a-zA-Z-]+)+)([/\\d]+)?'
        let re = new RegExp(pattern)
        let requestItems = re.exec(source)

        helpers.apiLog('non-lv requestItems: ' + JSON.stringify(requestItems))

        if (requestItems === null) {
          let msg = 'okToUseDataDiv: no proper uri match on: ' + source
          throw new Error(msg)
        }

        requestSignature = requestItems[1] + this.pagingQuery
      }
    }

    helpers.apiLog('requestSignature: ' + requestSignature)
    return requestSignature
  }

  dataQueryNormalize (dataQuery) {
    helpers.apiLog('api dataQuery to normalize: ' + dataQuery)
    dataQuery = dataQuery + this.pagingQuery // not empty when there is one
    helpers.apiLog('normalized query: ' + dataQuery)
    return dataQuery
  }
}
