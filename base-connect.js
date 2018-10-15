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
import config from '@/live-vue-js/config.js'
import helpers from '@/live-vue-js/helpers.js'

/*
 * The design premise of the Connect objects is to easily replace
 * existing $http.get() calls while transparently providing momentary
 * Live Vue data when the app is run in Craft Live Preview.
 *
 * General app startup speed is also often improved, as Live Vue
 * similarly provides primary initial data along with the app page
 * in many cases, cutting down the number of actual wire calls.
 *
 * Additionally, wire error handling is internal, simplifying app code
 * and easy use of a common Reporter mechanism such as an alert component,
 * if that's provided. A default Reporter writes errors to the browser
 * console.
 *
 * BaseConnect provides these portions of the architecture, while
 * data composition is unified by subclasses with their own
 * conversion routines, so that apps can see the same data with any
 * error reporting structure with various possible sources.
 *
 * The provided ApiConnect and GqlConnect classes provide for present
 * element-api and GraphQL sources with this transparency for apps.
 *
 * The config/config.js file provides configuration, in particular
 *
 * n.b. You may notice an ample distribution of conditional console logging,
 * the apiLog(), and devLog() calls. These and the presence of
 * LVHelpers.stringifyOnce() can be very useful in developing a fresh Connect type.
 * You can turn them on and off in the config/config.js file -- remember
 * to npm run build when you are changing these for staging or production.
*/

/*
 * n.b. You very probably don't want to set sourceBase. If you do, then api or
 * GraphQL queries will operate only on that url -- and thus won't occur on the
 * actual Craft Site as expected for multi-site. It's provided mainly as legacy,
 * and may soon go out.
 *
 * Also, sourceTag is for internal-use only. It will remain.
 *
 *
 * Thus, usual usage for any of the Connects, given usual $route on compo ent, is:
 *     connectVar = new Api/GqlConnect(this.$route)
 * or
 *     connectVar = new Api/GqlConnect(this.$route, this.report)
 *
 *     where reporter would be your failure reporting method, usually calling
 *     up a modal alert component for the information. If you don't provide one,
 *     fail reports will just go to the browser console automatically.
 *
 * n.b. further: For the case where there's a separated api or gql server, it's
 * poasible to set a config.sourceBase. If you do that, you'll need to pass Site
 * informationyourself, and use it in the query, so that you get the correct data.
 * This should be automatic within Live View itself, as the altered data is given
 * based already on the Site actually being edited.
 */
export default class BaseConnect {

  constructor (reporter = null, sourceBase = null, sourceTag = null) {

    this.dataSrcType = 'liveVue' // fundamental at present; allowed to be altered by child
    this.sourceTag = sourceTag // we use it elsewhere

    if (!sourceBase || !this.isString(sourceBase)) {

      if (!config.sourceBase) {
        // not to have set this argument is normal
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
    this.reporter = (reporter !== null) ? reporter : this.consoleReport

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
    this.formDataUrl() // needs to be done first to enable pageQuery checks

    if (this.dataSrcType && this.dataSrcType === 'liveVue') {

      helpers.apiLog('retrieving liveVue div, with meta for decisioning, if present')

      // an Exception will be thrown if div reports errors, so we can move directly
      let fullResult = this.convertLiveVueDiv() // try for LiveVue div, first

      if ((fullResult)) {
        // we'd like this always, when it exists
        this.lvMeta = fullResult.lvMeta
      }

      if (config.directExceptPreview && !fullResult.lvMeta.isLivePreview) {
        helpers.devLog('direct pull as configured, since not editing in Live Vue')
        this.pullFromApi(appDataSaver)
      } else if (fullResult && this.okToUseDataDiv(fullResult)) {
        helpers.devLog('successful using Live Vue div data for ' +
          dataQuery + this.pagingQuery)
        helpers.apiLog('data for ' + dataQuery + this.pagingQuery +
          ' from Live Vue div: ' + JSON.stringify(fullResult))
        appDataSaver(fullResult)
      } else {
        helpers.devLog('div doesn\'t have data for ' + dataQuery +
          this.pagingQuery + ' -- trying api data call on server')
        this.pullFromApi(appDataSaver)
      }
    } else {
      helpers.devLog('making immediate data call on server, as configured')
      this.pullFromApi(appDataSaver)
    }
  }

  // pull() is the primary call form replacing $http.get()

  // use Connect.get() only when you want to force a  wire call to
  // the Live Vue presentation of an api, with its meta information
  // and data conversion. Use direct() below to call an api with
  // no interventioni, just presenting appDataSaver with raw json.
  //
  // get() provides the same call semantics and automatic error handling
  // as pull does.

  get (dataQuery, appDataSaver, ...extraParams) {
    this.dataQuery = dataQuery

    // for later feature or children; spread so zero or multiple possible
    this.extraParams = extraParams

    helpers.devLog('get data call on server for ' +
      this.dataQuery + ', due to Connect.get()')
    this.formDataUrl()
    this.pullFromApi(appDataSaver)
  }

  // direct() allows you to send your query and variables directly
  // in JSON to a compliant server. It has the advantage of displaying
  // errors with the Connect reporter, consistently with Live Vue calls.
  // It will use POST as default, and a server you specify in config
  // unless the server parameter is filled in.
  //
  // direct() replaces $http.get() for raw, with the Connect advantages

  direct (queryJson, appDataSaver, headers = null, ...extraParams) {
    // direct() is straightforward as it doesn't need to do data conversions
    // or signature validations, while it does continue to support any kind of
    // result reporting. Likely we don't ever want to do this except via POST

    this.dataQuery = queryJson

    // for later feature or children; spread so zero or multiple possible
    this.extraParams = extraParams

    // we don't add anything to the dataApi in this case,
    // but don't forget to set it before this connect.direct() call

    // tokens?
    let requestConfig = headers
      ? { headers: headers }
      : {}

    helpers.devLog('Connect:direct: data call on ' +
      this.dataApi + ' for ' + JSON.stringify(this.dataQuery))
    helpers.apiLog('requestConfig: ' + JSON.stringify(requestConfig))

    const reporter = this.reporter // avoid a tricky case of this, stripped class?

    axios.post(this.dataApi, this.dataQuery, requestConfig)
      .then(function (response) {
        if (response.data.errors) {
          reporter('Api Error: ' + JSON.stringify(response.data.errors))
        }
        appDataSaver(response)
      })
      .catch(function (error) {
        reporter('Connection Error: ' + error.toString())
      })
  }

  // Normally you won't need this, as it's set automatically from the
  // current site url, or occasionally from live-vue-js/config's sourceBase
  // However, for setup aids, test utilities, etc., can be handy
  setSourceBase (url, addTag = true) {

    this.dataApi = helpers.stripTrailingSlash(url) + '/'
    if (addTag && this.sourceTag) { // child provides if source uses, such as api, gapi, etc.
      this.dataApi += helpers.stripTrailingSlash(this.sourceTag) + '/'
    }

    helpers.apiLog('dataApi: ' + this.dataApi)
  }

  // this also can be useful for test utilities, and not normally

  setSkipUri () {
    // means don't make uri part of signature, when Live-vue plugin won't
    this.skipUri = true
  }

  // These calls provide values from Live Vue lvMeta, whenever possible.
  // These are available when the Live Vue div is present, thus defaults.

  isLiveVueDelivery () {
    return this.getLvMeta() !== null
  }

  isLivePreview () {
    let lvMeta = this.getLvMeta()
    return lvMeta && lvMeta.isLivePreview
  }

  persistTimeFence () {
    let lvMeta = this.getLvMeta()
    return lvMeta ? lvMeta.persistTimeFence : 600
  }

  pageErrorHandler () {
    let lvMeta = this.getLvMeta()
    return lvMeta ? lvMeta.pageErrorHandler : 'browser'
  }

  browserHandle404 () {
    return this.pageErrorHandler() === 'browser'
  }

  getLvMeta () { // can be used for other lvMeta
    if (!this.lvMeta) {
      this.convertLiveVueDiv(false) // develop lvMeta; each kind of connect must provide
      console.log('lvMeta: ' + this.lvMeta)
    }
    return this.lvMeta || null // idiom on undefined
  }

  // ---- these methods must be defined in actual Connect classes inheriting from BaseConnect ----

  convertLiveVueDiv (haltOnError = true) {
    console.log('BaseConnect: NO LIVE CONVERSION')
    throw new Error('BaseConnect: must provide actual converLiveVueDiv() in inheriting Connect class...')
  }

  convertRemoteApi () {
    console.log('BaseConnect: NO REMOTE CONVERSION')
    throw new Error('BaseConnect: must provide actual convertRemoteApi() in inheriting Connect class...')
  }

  okToUseDataDiv (fullResult) {
    console.log('BaseConnect: NO DATA DIV VALIDATION')
    throw new Error('BaseConnect: must provide actual okToUseDataDiv() ' +
      ' in inheriting Connect class...')
  }

  // ---- the following can be over-ridden for certain inheriting Connect classes ----

  dataQueryNormalize (dataQuery) {
    // for element-api, as an example, this is no-op.
    // others such as gql-connect may override
    return dataQuery
  }

  // ---- the following are considered internal routines for Connect itself ----

  pullFromApi (appDataSaver, usePost = false) {
    this.getOnlineApiData(this.dataUrl, usePost)
      .then(fullResult => {
        helpers.devLog('pullFromAp: successful from ' + this.dataUrl)
        helpers.apiLog('pullFromApi fullResult: ' + JSON.stringify(fullResult))
        appDataSaver(fullResult)
      })
      .catch(error => {
        helpers.devLog('pullFromApi: ' + error)
        this.reporter(error.toString())
      })
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
    // this path is used for Live Vue both live and preview
    // const method = usePost
    //   ? this.postOnlineApiData
    //   : this.getOnlineApiData

    let errMsg = null
    helpers.devLog('getOnlineApiData: src: ' + src)

    return axios.get(src)
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errMsg = ' data: ' + JSON.stringify(error.response.data)
          errMsg += ', status: ' + error.response.status
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser,
          // while an instance of http.ClientRequest in node.js
          errMsg = 'Error: ' + error.message + ' (is your data server down?' +
            (error.request.length > 0 ? (' Request: ' + JSON.stringify(error.request)) : '')
        } else {
          // Something happened in setting up the request that triggered an Error
          errMsg = 'Error: ' + error
        }

        errMsg = 'getOnlineApiData: connection failed from ' +
          src + ', ' + errMsg

        throw new Error(errMsg)
      })
      .then(response => {
        if (response) {
          helpers.apiLog('Converting')
          return this.convertRemoteApi(response.data)
        } else {
          throw new Error('getOnlineApiData: empty response from ' + src)
        }
      })
      .catch(error => {
        if (!errMsg) {
          errMsg = 'getOnlineApiData ' + src + ': ' + error
        }

        // We always want to stop activity, so that no consequences
        // develop in components, and with a highlighted console
        // message for clarity, which an uncaught throw here does.
        throw new Error(errMsg)
      })
  }

  // --- some utilities,  ---

  // this is a call for appDataSaver to use when a Vuex store is present
  storeAppData (context, fullResult) {
    context.commit('setAppData', fullResult)
  }

  isString (obj) { // it's robust
    return (Object.prototype.toString.call(obj) === '[object String]')
  }

  isEmpty (obj) {
    return Object.getOwnPropertyNames(obj).length === 0
  }

  // this is the default reporter, if one isn't defined for the initial
  // Connect object construction
  consoleReport (error) {
    console.log('defaultReporter: ' + error)
  }
}
