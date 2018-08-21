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
 */

/*
 * You'll call ApiConnect in the ways explained in BaseConnect, additionally providing a
 * reporter when you have one.
 *
 *     connect = new ApiConnect(this.$route)
 *
 * As explained there, it's not clear now that you would ever use sourceBase,
 * and that argument is probably going to be removed soon.
 */

import BaseConnect from '@/live-vue/base-connect'

export default class ApiConnect extends BaseConnect {
  constructor (reporter = null, sourceBase = null) {
    super(reporter, sourceBase, 'api') // set the specific api tag

    // here define any dynamic post-construction properties for BaseConnect
  }

  convertLiveVueDiv () {
    let sourceBase = document.getElementById('liveVue')
    if (sourceBase) {
      let source = sourceBase.innerText // decodes any encoded html

      let response = JSON.parse(source)
      this.apiLog('convertLiveVueDiv response is: ' + JSON.stringify(response))

      let dataResult = {}

      if (response.errors !== undefined) {
        // we've translated api or other errors as best can, to gql format
        // all elements may not be filled in, for element-api code faults
        let errstr = 'convertLiveVueDiv: web page server reports error: ' +
          response.errors.message + ', code: ' + response.errors.code +
          ', file: ' + response.errors.file + ', line: ' + response.errors.line
        this.reporter(errstr) // for a notifier if present, default console
        throw new Error('halted for error') // a hard stop, before components fail themselves
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

  /*
    * Direct element-api returns aren't structured with separate error returns,
    * so we adjust that returned structure for compatibility with gql here.
  */
  convertRemoteApi (response) {
    this.apiLog('convertRemoteApi data is: ' + JSON.stringify(response))

    if (response === undefined) {
      console.log('convertRemote: Empty data response')
      return null
    }

    let dataResult = {}

    // direct api responses are flat, but need to look like gql responses
    dataResult.data = response
    dataResult.errors = response.error
    dataResult.lvMeta = {}

    this.apiLog('convertRemote result is: ' + JSON.stringify(dataResult))
    return dataResult
  }

  okToUseDataDiv (fullResult) {
    // This will help if routes.js or live-vue settings are wrong
    if (fullResult.lvMeta.dataSourceType !== 'element-api') {
      console.log('api-connect expected element-api data, ignoring from: ' +
        fullResult.lvMeta.dataSourceType)
      return false // right away, it's not for this customer
    }

    let apiPattern = fullResult.lvMeta.dataApiPattern
    let ok = false

    if (fullResult.lvMeta.isLivePreview) {
      // n.b. this is quite like matching resolvedApiPattern() in Sources.php.
      // However, be very careful, as there are many adaptations to js.
      // In particular, even the re pattern differs, due to escapes
      let source = window.location.pathname
      let pattern = '(.*entries\\/)?([\\w-+]+)\\/?[\\d-]*([\\w-+]+)?'
      let re = new RegExp(pattern)
      let requestItems = re.exec(source)

      this.apiLog('requestItems: ' + JSON.stringify(requestItems))

      if (requestItems === null) {
        let msg = 'okToUseDataDiv: no proper uri match on: ' + source
        throw new Error(msg)
      }

      // we always have to assert the leading / in this branch, so apiPattern
      // can be common to both. See note in Sources.php as to why we couldn't
      // just re group it in.
      let requestPattern = requestItems[3].length === 0
        ? '/' + requestItems[2]
        : '/' + requestItems[2] + '/' + requestItems[3]

      this.apiLog('requestPattern: ' + requestPattern)

      ok = (apiPattern === requestPattern)

      this.apiLog(ok
        ? ('ok to use Live Vue div having: ' + apiPattern + ' vs ' + requestPattern)
        : ('not ok to use Live Vue div having: ' + apiPattern + ' vs ' + requestPattern))
    } else {
      ok = (apiPattern === window.location.pathname)
      this.apiLog(ok
        ? ('ok to use Live Vue div having: ' + apiPattern +
          ' vs request ' + window.location.pathname)
        : ('not ok to use Live Vue div having: ' + apiPattern +
          ' vs request ' + window.location.pathname))
    }

    return ok
  }
}
