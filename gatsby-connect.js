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

import GqlConnect from './gql-connect'
import helpers from './helpers.js'
import axios from 'axios'

export default class GatsbyConnect extends GqlConnect {

  constructor (reporter = null, sourceBase = null, sourceTag = 'gapi/query') {
    super(reporter, sourceBase, sourceTag) // we could override the tag

    // here define any dynamic post-construction properties
    // required, beyond those provided by BaseConnect
  }

  rearrangeData (fullResult) {
    // now revise this into shape gatsby expects
    let cardsData = fullResult.data.cards
    fullResult = {
      data: {
        craftql: {
          cards: cardsData
        }
      }
    }

    return fullResult
  }

  validateLiveVueDiv (response, haltOnError = true) {
    // these are usually similar but differing, for inheriting connects
    // response is possibly null in some uses, hence the check

    if (response && response.errors !== undefined) { // errors, in gql
      let errMsg = 'validateLiveVueDiv: original page server reports error: ' +
        helpers.htmlStringify(response.errors)
      this.reporter(errMsg)
      helpers.devLog(errMsg)
      if (haltOnError) {
        throw new Error(errMsg) // a hard stop, before components fail themselves
      }
      return null
    }
    helpers.apiLog('validateLiveVueDiv response is: ' + JSON.stringify(response))

    return this.rearrangeData(response)
  }
}
