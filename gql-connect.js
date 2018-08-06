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
 * GraphGL returns are orderly, with data, errors, and meta sections, also our lvMeta
 * Thus for this app we return the data section itself, rather than the whole result
 * as with element-api, which treats element data as nameless arrayed objects. It's a
 * one-line difference, but must be correct.
 */

import BaseConnect from './base-connect'
import LVHelpers from '@/live-vue/helpers.js'

let helpers = new LVHelpers()

export default class GqlConnect extends BaseConnect {
  constructor (route = null, reporter = null, sourceBase = null) {
    super(route, reporter, sourceBase, 'gapi/query') // set the tag for gql query

    // here define any dynamic post-construction properties for BaseConnect

    this.requestUri = this.formUri()
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
        // this.dataUrl +
        ': ' + JSON.stringify(response.errors)
      throw new Error(errMsg)
    } else {
      fullResult = response
    }

    if (this.isEmpty(fullResult)) {
      throw new Error('convertRemoteApi: gql Empty data response')
    }

    this.devLog('convertRemoteApi gql result is: ' + JSON.stringify(fullResult))

    return fullResult
  }

  okToUseDataDiv (fullResult) {
    if (fullResult.lvMeta.dataSourceType !== 'gapi') {
      console.log('gql-connect received div data instead from: ' +
        fullResult.lvMeta.dataSourceType)
      return false // right away, it's not for this customer
    }

    this.devLog('route: ' + helpers.stringifyOnce(this.router.currentRoute))
    this.requestUri = this.formUri()

    let apiPattern = fullResult.lvMeta.dataApiPattern
    let ok = false

    fullResult.lvMeta.isLivePreview = true

    if (fullResult.lvMeta.isLivePreview) {
      let requestPattern = '?script=' + this.dataQuery + '&uri=' + this.requestUri
      this.devLog('requestPattern: ' + requestPattern)

      ok = (apiPattern === requestPattern)

      this.devLog(ok
        ? ('ok to use Live Vue div having: ' + apiPattern + ' vs ' + requestPattern)
        : ('not ok to use Live Vue div having: ' + apiPattern + ' vs ' + requestPattern))
    } else {
      ok = false
      this.apiLog('not ok to use direct return as if Live Vue div, on: ' + apiPattern)
    }

    return ok
    //
    //
    // this.devLog('okToUseDataDiv: ' + this.dataQuery +
    //   ' vs ' + fullResult.lvMeta.dataSource)
    // return (fullResult.lvMeta.dataSourceType === 'gapi' &&
    //   fullResult.lvMeta.dataSource === this.dataQuery)
  }

  formUri () {
    let source = this.router.currentRoute.path
    this.devLog('formUri: source: ' + source)

    // see notes in Sources.php resolvedGapiPattern, as we are using a
    // simplest pattern here for reason, with changed approach if need more
    let pattern = '([\\d-]+)?([\\w-]+)$'
    let re = new RegExp(pattern)
    let requestItems = re.exec(source)
    let lastIndex = requestItems.length - 1

    this.devLog('requestItems: ' + JSON.stringify(requestItems))
    let requestUri = requestItems[lastIndex].length === 0
      ? '(missing)'
      : requestItems[lastIndex]
    return requestUri
  }

  dataQueryNormalize (dataQuery) {
    this.apiLog('gql dataQuery to normalize: ' + dataQuery)
    dataQuery = '?script=' + dataQuery + '&uri=' + this.requestUri
    this.devLog('normalized query: ' + dataQuery)
    this.devLog('route avail: ' + this.route.params.pageURI)
    return dataQuery
  }
}
