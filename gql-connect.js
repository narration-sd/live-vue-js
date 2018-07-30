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

export default class GqlConnect extends BaseConnect {
  constructor (route = null, reporter = null, sourceBase = null) {
    super(route, reporter, sourceBase, 'gapi/query') // set the tag for gql query

    // here define any dynamic post-construction properties for BaseConnect
  }

  convertLiveVueDiv () {
    let sourceBase = document.getElementById('liveVue')
    if (sourceBase) {
      let source = sourceBase.innerText // decodes any encoded html

      let response = JSON.parse(source)
      super.apiLog('convertLiveVueDiv source is: ' + JSON.stringify(response))

      let dataResult = {}

      if (response.errors !== undefined) { // errors, in gql
        let errMsg = 'convertLiveVueDiv: original page server reports error: ' +
          JSON.stringify(response.errors)
        console.log(errMsg)
        this.reporter(response.error)
        throw new Error(errMsg)
      } else {
        dataResult = response
      }

      if (!dataResult) {
        this.devLog('convertLiveVueDiv: Empty data response')
        return null
      }

      this.apiLog('convertLiveVueDiv response is: ' + JSON.stringify(dataResult))

      return dataResult
    } else {
      this.devLog('no source div, trying remote api')
      return null // because we signal with this, so remote can get called
    }
  }

  convertRemoteApi (response) {
    this.apiLog('convertRemoteApi gql data is: ' + JSON.stringify(response))

    let dataResult = {}

    if (response.errors !== undefined) {
      let errMsg = 'convertRemoteApi: gql server reports: ' +
        // this.dataUrl +
        ': ' + JSON.stringify(response.errors)
      throw new Error(errMsg)
    } else {
      dataResult = response.data
    }

    if (this.isEmpty(dataResult)) {
      throw new Error('convertRemoteApi: gql Empty data response')
    }

    this.apiLog('convertRemoteApi gql result is: ' + JSON.stringify(dataResult))

    return dataResult
  }

  okToUseDataDiv (dataResult) {
    return (dataResult.lvMeta.dataSourceType === 'gapi' &&
      dataResult.lvMeta.dataSource === this.dataQuery)
  }

  dataQueryNormalize (dataQuery) {
    this.apiLog('gql dataQuery to normalize: ' + dataQuery)
    dataQuery = '?script=' + dataQuery
    return dataQuery
  }
}
