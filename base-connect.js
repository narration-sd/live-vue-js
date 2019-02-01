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

import axios from 'axios'
import config from '../config/live-vue.js'
import helpers from '../live-vue-js/helpers.js'

/*
 * The design premise of the Connect objects is to easily replace
 * existing calls such as $http.get(), also transparently providing
 * Live Vue data when the app is run in Craft Live liveVue. As well,
 * comprehensive error handling is implemented, along with a default
 * modal notifier, providing confident app presentation.
 *
 * General app startup speed is often improved, as Live Vue
 * similarly provides primary initial data along with the app page
 * in many cases, cutting down the number of wire calls.
 *
 * More general data calls are provided as well, in particular for
 * remote GraphQL servers, or for mutations.
 *
 * BaseConnect provides these portions of the architecture, while
 * data composition is unified by subclasses with their own
 * conversion routines, so that apps can see the same data with any
 * error reporting structure with various possible sources.
 *
 * The provided ApiConnect and GqlConnect classes provide for present
 * element-api and CraftQL sources with this transparency for apps.
 *
 * The config/live-vue.js file provides configuration, in particular
 *
 * n.b. You may notice an ample distribution of conditional console logging,
 * the apiLog(), and devLog() calls. These and the presence of
 * LVHelpers.stringifyOnce() can be very useful in developing a fresh Connect type.
 * You can turn them on and off in the config/live-vue.js file. In practice,
 * it's often useful to only turn on dev logging, and then edit a useful
 * apiLot to use devLog, while you need to see that result. Remember
 * to npm run build when you are changing these for staging or production,
 * and afterwards to clean up logging changes and again build for completed work.
 *
 *  For usage and details, please refer to the documentation.
 */

export default class BaseConnect {

  constructor (reporter = null, sourceBase = null, sourceTag = null) {

    // this package makes much use of JS dynamic properties, beginning here...

    this.dataSrcType = 'liveVue' // fundamental at present; allowed to be altered by child
    if (!sourceTag) {
      throw new Error('Attempting to create BaseConnect directly; must instead use children.')
    } else {
      this.sourceTag = sourceTag // defines source type
    }

    if (!sourceBase || !helpers.isString(sourceBase)) {
      // the isString() check defends against unintended possibilities
      if (!config.sourceBase) {
        // not to have set sourceBase can be normal, but if you are going to use
        // webpack devServer or change sources, setSourceBase() will arrange it
        // over this default to the page's server.
        let parsed = helpers.urlParse(window.location)
        sourceBase = parsed.protocol + '//' + parsed.host // these parts
      } else {
        // as noted, you don't want usually to have provided this either
        sourceBase = helpers.stripTrailingSlash(config.sourceBase)
      }
    }

    this.dataApi = helpers.stripTrailingSlash(sourceBase) + '/'
    if (sourceTag) { // child provides if source uses, such as api, gapi, etc.
      this.dataApi += helpers.stripTrailingSlash(sourceTag) + '/'
    }

    helpers.apiLog('dataApi: ' + this.dataApi)

    this.pagingQuery = helpers.getPagingQuery(window.location.href)
    helpers.apiLog('pagingQuery: ' + JSON.stringify(this.pagingQuery))

    // reporter can be a nice ux modal etc., while we provide a simple default
    this.reporter = (reporter !== null) ? reporter : this.consoleReporter

    this.lvMeta = null

    // n.b. there cam be other dynamic properties from methods or children

  }

  // ----- This section holds the usage api for Connects ----- //

  // The first two calls, pull() and get(), are the primary interface.

  // pull() is the common replacement for $http.get(), as it provides all
  // Live Vue abilities, automatically switching from hidden div to wire api
  // calls when required. It provides easier semantics, along with automatic
  // error handling which includes the ability to raise custom reporter responses
  // such as modal alerts, when these are made available in the constructor.

  pull (dataQuery, appDataSaver, ...extraParams) {
    this.dataQuery = dataQuery
    helpers.apiLog('pull dataQuery: ' + dataQuery)

    // for later feature or children; spread so zero or multiple possible
    this.extraParams = extraParams

    let fullResult = null
    fullResult = this.liveVue(dataQuery)

    if (fullResult) { // belt and suspenders, clear semantics
      appDataSaver(fullResult) // no need for Promise on direct from div
    } else {
      helpers.devLog('Connect.pull: making data call on server, as conditioned or configured')
      this.formDataUrl()
      this.pullFromServer(appDataSaver)
    }
  }

  // liveVue() is the heart of Connect's data retrieval from Craft, via
  // the Live Vue plugin's hidden data div. Fundamentally, it provides the
  // information from each edit moment's Live liveVue for JS app screen update.
  //
  // Thus it's also true that you may use it for a quick way to Live Vue
  // enable a current component with Live liveVue, via a aimple if-else
  // on its data return, which will be null if Live Vue isn't present.
  // You'd configure the Connect so it passes only Live Vue in this case.
  //
  // However, going this way, you'd miss the element-api and CraftQL
  // integration of Connect.pull(), along with its easy call/callback
  // framework including comprehensive error reporting and notifier.

  // For performance, you'd equally miss the acceleration: Live Vue's inclusion
  // of first-screen data with the page that holds your Vue etc. component,
  // instead accumulating the latency of a second round-trip ajax call at some
  // time point in the component's own initiation.

  // for liveVue() to work independently, you'll need to pass in the
  // dataQuery identifying the gql Script or api/endpoint

  liveVue (dataQuery) {

    let checkSignature = true
    let rawResult = this.convertLiveVueDiv()

    if (this.divDataUsed()) {
      helpers.devLog('liveVue: bypass properly, as any server div data already used')
      return null
    }

    if (!rawResult) {
      helpers.devLog('liveVue: bypass normally, as no server data div present')
      return null
    }

    if (!this.isLivePreview()) {
      this.setDivDataUsed() // no stale data from a prior accelerated page load please
    }

    if (dataQuery) {
      this.dataQuery = dataQuery // for use in solo liveVue (legacy pattern)
      this.formDataUrl() // needs to be done first to enable pageQuery checks
    } else if (!this.noDataQueryOk) {
      // Generally, we don't want to allow the div without a matchable dataQuery.
      // We do need to skip this check with calls which wouldn't involve dataQuery,
      // as a GqlGonnect direct call. In those circumstances, set this.noDataQueryOk

      throw new Error('Attempted liveVue() without a dataQuery to match')
    }

    if (this.dataSrcType && this.dataSrcType === 'liveVue') {

      helpers.apiLog('retrieving liveVue div, with meta for decisioning, if present')

      this.lvMeta = rawResult && rawResult.lvMeta
        ? rawResult.lvMeta
        : null

      // pre-conversion situations handled and logged...

      if (config.directExceptPreview && (!this.lvMeta || !this.lvMeta.isLivePreview)) {
        helpers.devLog('direct pull as configured, since not previewing in Live Vue')
        return null
      } else if (this.lvMeta && this.lvMeta.skipLiveVueDiv) {
        helpers.devLog('acceleration disabled for ' + this.dataQuery +
          this.pagingQuery + ' -- using direct data call on server')
        return null
      }

      helpers.dataLog('data for ' +
        (dataQuery === null ? '(direct query) ' : dataQuery) +
        this.pagingQuery +
        ' from Live Vue div: ' + JSON.stringify(rawResult))

      // now we convert accordingly, and act on return
      // an Exception will be thrown if div reports errors, so we can move directly

      if (!checkSignature) {
        helpers.devLog('Live Vue div data trusted without signature check')
        let fullResult = this.validateLiveVueDiv(rawResult, false)
        // discovery on gatsby
        // now revise this into shape gatsby expects
        let cardsData = fullResult.data.cards
        fullResult = {
          data: {
            craftql: {
              cards: cardsData
            }
          }
        }
        // end discovery on gatsby

        helpers.apiLog('data from Live Vue div w/o signature ck: ' +
          JSON.stringify(fullResult))
        return fullResult
      } else if (this.okToUseDataDiv(rawResult)) {
        let fullResult = this.validateLiveVueDiv(rawResult, true)
        helpers.devLog('successful using Live Vue div data for ' +
          dataQuery + this.pagingQuery)
        // discovery on gatsby
        // now revise this into shape gatsby expects
        let cardsData = fullResult.data.cards
        fullResult = {
          data: {
            craftql: {
              cards: cardsData
            }
          }
        }
        // end discovery on gatsby
        return fullResult
      } else if (this.isLivePreview()) {
        this.validateLiveVueDiv(rawResult, true) // error out here first if not
        let errMsg = 'div doesn\'t have data for ' + this.dataQuery +
          this.pagingQuery +
          ' (mismatch with ' + this.lvMeta.dataSignature + ' -- are routes or endpoints correct?)'
        this.reporter(errMsg)
        throw new Error(errMsg)
      } else {
        helpers.devLog('Connect.liveVue: indicating div doesn\'t have data for ' +
          this.dataQuery + this.pagingQuery)
        return null
      }
    }
  }

  // use Connect.get() only when you want to force a wire call to
  // an api, while keeping the advantage of Connect's error handling,
  // error reporter with optional notifier, and data conversion.
  //
  // get() provides the same call semantics and automatic error handling
  // as pull does. Because pull() will effectively work as a get() when
  // there's no div data, or after it's been first used, probably you
  // won't often need get(). It's here for completeness.

  get (dataQuery, appDataSaver, ...extraParams) {
    this.dataQuery = dataQuery

    // for later feature or children; spread so zero or multiple possible
    this.extraParams = extraParams

    helpers.apiLog('base-connect.get: data call on ' + this.dataApi)
    this.formDataUrl()
    this.pullFromServer(appDataSaver)
  }

  // This is useful to substitute a config'd or default sourceBase.
  // Be sure to set sourceTag if apropos, even '' to prevent one.
  setSourceBase (url, sourceTag = null) {

    this.dataApi = helpers.stripTrailingSlash(url) + '/'
    if (sourceTag === null && this.sourceTag) {
      // child provides if source uses, such as api, gapi, etc.
      this.dataApi += helpers.stripTrailingSlash(this.sourceTag) + '/'
    } else if (sourceTag) {
      // but in this case substitute for what child has, can be ''
      this.dataApi += helpers.stripTrailingSlash(sourceTag) + '/'
    }

    helpers.apiLog('setSourceBase: dataApi: ' + this.dataApi)
  }

  // --- Connect utilities -- //

  // These provide values from Live Vue lvMeta, whenever possible.
  // These are available when the Live Vue div is present, thus defaults.

  // Data is actual Live liveVue, which is a fact that can be used to halt
  // movement or other action during this edit, such as carousel rotation.
  // Also holding current position could be useful, and could be provided
  // via Vuex combined with npm vuex-persist. Or, Craft Solo could be
  // implemented, to provide more general focus ability -- and then
  // any persistence scheme would need to recognize this.
  isLivePreview () {
    let lvMeta = this.getLvMeta()
    // note use of double-!, around js abso peculiar truthy treatement of null
    return lvMeta && lvMeta.isLivePreview
  }

  dataSourceType () {
    let lvMeta = this.getLvMeta()
    return lvMeta.dataSourceType
  }

  persistTimeFence () {
    let lvMeta = this.getLvMeta()
    return lvMeta ? lvMeta.persistTimeFence : 600
  }

  browserHandle404 () {
    return this.pageErrorHandler() === 'browser'
  }

  pageErrorHandler () {
    let lvMeta = this.getLvMeta()
    return lvMeta ? lvMeta.pageErrorHandler : 'browser'
  }

  getLvMeta () { // basis, and could be used for other lvMeta
    if (!this.lvMeta) {
      // develop lvMeta; as ever, each kind of connect must provide
      let rawResult = this.convertLiveVueDiv()
      let validResult = this.validateLiveVueDiv(rawResult, false)
      this.lvMeta = validResult && validResult.lvMeta !== undefined
        ? rawResult.lvMeta
        : null
    }
    // well, using the js peculiarity undefined/falsey
    return this.lvMeta || null
  }

  // Data is via div, while may or not be a Live Vue liveVue
  // not normally used, but provided for completeness
  isLiveVueDataDelivery () {
    return this.getLvMeta() !== null
  }

  // ---- these methods must be defined in actual Connect classes inheriting from BaseConnect ----

  validateLiveVueDiv (haltOnError = true) {
    console.log('BaseConnect: NO LIVE VALIDATION')
    throw new Error('BaseConnect: must provide actual validateLiveVueDiv() in inheriting Connect class...')
  }

  convertRemoteApi () {
    console.log('BaseConnect: NO REMOTE CONVERSION')
    throw new Error('BaseConnect: must provide actual convertRemoteApi() in inheriting Connect class...')
  }

  okToUseDataDiv (fullResult) {
    // this is no longer an error, as of get/setDivDataUsed(). As it is implemented
    // for the children GqlConnect and ApiConnect, its signature comparison could
    // be helpful in initial setup for Settings and routes.
    helpers.apiLog('if okToUseDataDiv() present, could be helpful for setup errors...')
  }

  // ---- the following can be over-ridden for certain inheriting Connect classes ----

  dataQueryNormalize (dataQuery) {
    // for element-api, as an example, this is no-op.
    // others such as gql-connect may override
    return dataQuery
  }

  // postDirect() is available for Connects which can send actual
  // queries, such as GqlConnect.

  postDirect (queryJson, appDataSaver, headers = null, ...extraParams) {
    throw new Error('BaseConnect: postDirect() not available for ' +
      ' the inheriting Connect class in use...check your type...')
  }

  // ---- the following are considered internal routines for Connect itself ----

  convertLiveVueDiv (haltOnError = true) {
    let sourceBase = document.getElementById('liveVue')
    if (sourceBase) {
      let source = sourceBase.innerText // decodes any encoded html

      let response = JSON.parse(source)
      helpers.apiLog('convertLiveVueDiv source is: ' + JSON.stringify(response))
      return response
    } else {
      helpers.apiLog('BaseConnect: no source div, trying remote api')
      return null // because we signal with this, so remote can get called
    }
  }

  pullFromServer (appDataSaver, usePostForApi = false) {
    this.setDivDataUsed() // safety for all possible paths

    if (this.gqlQuery === undefined) {
      this.getOnlineApiData(this.dataUrl, usePostForApi)
        .then(fullResult => {
          helpers.devLog('pullFromServer: successful from ' + this.dataUrl)
          helpers.dataLog('pullFromServer fullResult: ' + JSON.stringify(fullResult))
          appDataSaver(fullResult)
        })
        .catch(error => {
          helpers.devLog('pullFromServer: ' + error)
          this.reporter(error.toString())
        })
    } else {
      let headers = this.gqlHeaders === undefined
        ? null
        : this.gqlHeaders

      this.postDirect(this.gqlQuery, appDataSaver, headers)
    }
  }

  formDataUrl () {
    this.composedQuery = this.composeQuery()
    this.dataUrl = this.dataApi + this.composedQuery
    helpers.apiLog('formDataUrl: dataUrl: ' + this.dataUrl)
  }

  composeQuery () {
    // This is handling for multiple ways of specifying the query,
    // appropriate to particular apis.

    // The first thing we do is handle a pathAdd, which would be
    // passed via the component pull() or get() from a router prop,
    // having been generated from a route rule

    let pathAdd = this.pathAdd
      ? helpers.stripTrailingSlash(this.pathAdd) + '/'
      : ''
    helpers.apiLog('composeQuery: original dataQuery: ' + this.dataQuery)

    // stripping the preceding number code if present from path passed from router
    // we also apply pathAdd if that was present in the router rule
    let re = /([0-9]+-)(.*)/
    let matched = re.exec(this.dataQuery)
    let dataQuery = !matched || typeof matched[2] === 'undefined'
      ? this.dataQuery
      : pathAdd + matched[2]

    helpers.apiLog('composeQuery: basis dataQuery plus any pathAdd: ' + dataQuery)

    // connection type subclasses can provide individualization by over-riding dataQueryNormalize
    dataQuery = this.dataQueryNormalize(dataQuery)

    helpers.apiLog('composeQuery: normalized dataQuery: ' + dataQuery)

    // if the endpoint wasn't part of the dataApi, prefix it
    dataQuery = this.dataEndpoint
      ? this.dataEndpoint + dataQuery
      : dataQuery

    helpers.apiLog('composeQuery: completed dataQuery: ' + dataQuery)
    return dataQuery
  }

  getOnlineApiData (src, usePost = false) {
    // Here we isolate the axios call in case we want to use
    // another communication library later.

    // Keep in mind that this code is all Promise based, so responses
    // or errors responses occur asynchronously, some time after.
    // This routine returns the promise for those results.

    // BaseConnect's reporter allows providing your own alert
    // handling component, such as a modal alert.

    // n.b. response.data is axios's 'data', not a data element from api

    // also n.b. the method of error handling here is due to just how
    // Promises work. Chaining itself, somewhat elegant. Handling errors
    // in chains, not so much.  An alternative will probably be substituted
    // here, but this functions for the present.

    // The copious commenting helps understanding, especially by explaining
    // axios errors, which are also not the most clear or complete. Color
    // coding in your editor will allow separating code from comments. The
    // unpleasant layout throughout you can blame on 'new standard' Lint
    // defaults...

    // *todo* verified possible for later, and then lose the get from function name
    // also would/will need headers? But we cover auth in scripts so far
    // while args and signatures would have to be different as well, as
    // this path is used for Live Vue both live and liveVue
    // const method = usePost
    //   ? this.postOnlineApiData
    //   : this.getOnlineApiData

    let errMsg = null
    helpers.devLog('getOnlineApiData: src: ' + src)

    return axios.get(src)
      .catch((error) => {
        let errMsg = this.reportAxios(src, error, 'getOnlineApiData')
        throw new Error(errMsg)
      })
      .then(response => {
        if (response) {
          helpers.devLog('Converting')
          return this.convertRemoteApi(response.data)
        } else {
          throw new Error('getOnlineApiData: empty response from ' + src)
        }
      })
      .catch(error => {
        if (!errMsg) {
          errMsg = 'getOnlineApiData: ' + src + ': ' + error
        }

        // We always want to stop activity, so that no consequences
        // develop in components, and with a highlighted console
        // message for clarity, which an uncaught throw here does.
        throw new Error(errMsg)
      })
  }

  reportAxios (server, error, routine) {
    let errMsg = null
    let errExplain = ''
    helpers.devLog('reportAxios: full error: ' + JSON.stringify(error))

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errMsg = ' response: ' + JSON.stringify(error.response.data)
      errMsg += ', status: ' + error.response.status
      if (errMsg.indexOf('Template not found') >= 0) {
        errExplain = '<br><br>(this usually indicates you\'re missing or have misnamed the api endpoint for this request, thus Craft has reverted to looking for a template)'
      }
      errMsg += errExplain
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser.
      if (error.message.indexOf('ERR_CERT_AUTHORITY_INVALID') >= 0) {
        // this path probably won't work, as browser is the one to give
        // this message at present, but nice if it will in future
        errExplain = '<br><br>(your browser rejects the server certificate (ERR_CERT_AUTHORITY_INVALID) -- do you need to enable a .test or other local url for it?)'
      } else {
        errExplain = ' <br><br>(Is your data server up and healthy? Checking console log, does it allow CORS access, via config/live-vue.php allowedOrigins if direct access? CORS error can also occur if the request api endpoint is missing or mismatched.<br><br>If console indicates ERR_CERT_AUTHORITY_INVALID, do you need to enable a .test or other local url?)'
      }
      errMsg = 'Error: ' + error.message + errExplain +
        (error.request.length > 0 ? (' Request: ' + JSON.stringify(error.request)) : '')
    } else {
      // Something happened in setting up the request that triggered an Error
      errMsg = 'Error: ' + error
    }

    errMsg = routine + ': connection failed from ' +
      server + ', ' + errMsg

    return 'Connection Error: ' + errMsg
  }

  // --- some utilities,  ---

  // haltOnUnexpectedEmpty() could be used by an app where missing a specific
  // data content in a response would be an error. It was originally intended
  // to be automatic, but can't be so in practicality, as Connect response
  // can have named items that could be properly or improperly empty.
  //
  // Remember that only an item contained, not the full response is checkable,
  // either for gql or api.  And, be sure to provide an appropriate message...
  haltOnUnexpectedEmpty (dataResult, errMsg, force = false) {
    // Normally, react only if it's a Live liveVue. But a given app could
    // call this with force to indicate unusual bad situations...
    if (force ||
      (this.isLivePreview() &&
        (dataResult === undefined || dataResult.length === 0))) {
      helpers.apiLog(errMsg)
      this.reporter(errMsg)
      throw new Error(errMsg)
    }
  }

  // *todo* this may well be a better way forward than signature checks...

  divDataUsed () {
    return window.liveVueDivDataUsed !== undefined && window.liveVueDivDataUsed
  }

  setDivDataUsed () {
    window.liveVueDivDataUsed = true // else it's undefined, due to reload
  }

  // this is a call for appDataSaver to use when a Vuex store is present
  storeAppData (context, fullResult) {
    context.commit('setAppData', fullResult)
  }

  // this is the default reporter, if one isn't defined for the initial
  // Connect object construction
  consoleReporter (error) {
    console.log('defaultReporter: ' + error)
  }
}
