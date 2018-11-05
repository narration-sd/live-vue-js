import config from '@/live-vue-js/config'

export default {
  liveAndPreviewMatch (introducer) {
    // life is simpler as well as more effective, in this third generation.

    // However, this multiple matcher, while helpful in many simple cases,
    // can't be used when params are present.

    // Explanation is in the notes on liveWithParamsMatch() below, and we
    // provide it and previewMatch() to make many more easier matchers.

    // We treat the introducer for slash so it always has a leading slash
    // and no trailing slash -- combination saves possible user tears
    introducer = '/' + this.stripLeadingTrailingSlashes(introducer)

    let matcher = '(.+/entries' + this.snakeToCamel(introducer) +
      '.*|' + introducer + '/?)'

    this.apiLog('liveAndPreviewMatch: ' + matcher)
    return matcher
  },

  liveWithParamsMatch (introducer, ...params) {
    // We can't make a multiple-route-type matcher due to path-to-regexp
    // limitations. It's used by Vue and React routers among others, and
    // does deliberate escapes when it modifies input match strings, quite
    // apparently filling out author-stated intentions by fully disallowing
    // multiple alternative matches in a single route, when there are params.

    // We can still help by providing previewMatch and this liveWithParamsMatch,
    // which can simplify building many preview and live routes.
    //
    // multiple params can be used if each ends with a '?' appropriately. This
    // is not automated, as you may want to make the last param non-optional
    // to limit the match.
    //
    // Params themselves can be just named, or include their paren'd own matcher,
    // which is required when they need to include paths with '-', for instance,
    // or when the param needs to include '/' for including /multiple/seg/ments.
    //
    // if you are writing for a route with no introducer,
    // use '', '/', or null for function call

    // Beyond what we can do here, you should just write an explicit path-to-regex
    // which is as detailed as you need for the live page.

    // We treat the introducer for slash so it always has a leading slash
    // and no trailing slash -- combination saves possible user tears

    if (introducer === null || introducer === '/' || introducer === '') {
      introducer = ''
    } else {
      introducer = '/' + this.stripLeadingTrailingSlashes(introducer)
    }

    let matcher = introducer

    this.apiLog('params: ' + params.length + ', ' + JSON.stringify(params))
    if (params.length > 0) {
      for (let param of params) {
        matcher += '/:' + param
      }
    }

    // add close with /? would fail, as path-to-regexp already optioning this

    this.apiLog('liveWithParamsMatch: ' + matcher)
    return matcher
  },

  previewMatch (introducer) {
    // See note above on liveWithParamsMatch for why we need this

    // We treat the introducer for slash so it always has a leading slash
    // and no trailing slash -- combination saves possible user tears
    introducer = '/' + this.stripLeadingTrailingSlashes(introducer)

    let matcher = '(.*/entries' + this.snakeToCamel(introducer) + '):discard(.*)/'

    this.apiLog('previewMatch: ' + matcher)
    return matcher
  },

  routerReport (to) {
    if (to.matched.length === 0) {
      const error = 'Error in router definitions: No matching route for path: ' + to.path
      throw new Error(error) // no notifier available unless route to page with it
    } else if (to.name === 'default') {
      this.routerLog('n.b.: Routing matched on default') // just a dev attention if useful
    } else {
      const name = to.name ? ('name: ' + to.name) : 'un-named'
      const match = to.matched[0].path
      this.routerLog('\nroute resolved on: ' + match + ', ' + name)
    }
  },

  urlParse (url) {
    // we could have used new URL(), except IE doesn't
    // we could have used a polyfill, except doesn't for all IE
    // thus traditional method; let the DOM do it. I ask you, in 2018...

    var parser = document.createElement('a')
    parser.href = url
    return parser
  },

  clearUrlParser (parser) {
    parser.parentNode.removeChild(parser)
  },

  getPagingQuery (url) {
    // returns the query if there is one, according to your paging query name
    // n.b. how paging is necessarilly handled is not simple. See the doc...

    let parser = this.urlParse(url)
    let queries = parser.search
    // this.clearUrlParser(parser)
    let queryName = config.pagingQueryName
    if (queryName === undefined) {
      queryName = 'page'
    }

    if (queries) {
      let re = new RegExp('[?&]' + queryName + '(=([^&#]*)|&|#|$)')
      let vals = re.exec(queries)

      return (vals && vals[2])
        ? '?' + queryName + '=' + vals[2]
        : ''
    } else {
      return ''
    }
  },

  snakeToCamel (str) {
    return str.replace(/(-\w)/g, function (m) { return m[1].toUpperCase() })
  },

  stripLeadingSlash (url) {
    return url.replace(/^\//, '')
  },

  stripTrailingSlash (url) {
    return url.replace(/\/$/, '')
  },

  stripLeadingTrailingSlashes (url) {
    return this.stripTrailingSlash(this.stripLeadingSlash(url))
  },

  // these are handy to keep console log clean when not developing
  // note that turning on apiLog in config will also enable devLog(),
  // which is used to log just high-level activities, especially in
  // child Connect classes. apiLog() unleashes a flood. Control
  // these via config/config.js, and rebuild for production change.

  devLog (msg) {
    if (config.lvDevMode || config.apiDevMode) {
      console.log(msg)
    }
  },

  apiLog (msg) {
    if (config.apiDevMode) {
      console.log(msg)
    }
  },

  routerLog (msg) {
    if (config.routerDevMode) {
      console.log(msg)
    }
  },

  getConfig () {
    return config
  },

  /*
   * this isn't required, but can handle several things that can go wrong in
   * Vue links. Likely, it's better to be clean about your link forms, unless
   * that itself becomes too demanding.
   *
   * It can useful where router-link would be asked to accept full url links,
   * which it actually doesn't. The correction to a normal <a></a> link also
   * avoids a nasty issue, that invalid router-links can make the browser hang,
   * through a Vue(router)-internal runaway or block that gives no console info.
   *
   * For relative links, it's assured that they begin with a slash, as if not,
   * router-link builds from the current path rather than the base url.
   *
   * You'd need to add helpers to your import, if not already there
   *
   *     import helpers from '@/live-vue-js/helpers.js'
   *
   * Then you could use it via something like this, which will form an <a> link
   * or <router-link> depending on what's required. Do not forget the disable
   * for eslint, or you'll be sorry...
   *
   *    <!-- eslint-disable-next-line vue/require-component-is -->
   *    <component v-bind="helpers.sanitizedLink(link.url)">{{ link.title }}</component>
   *
   *  For the basic idea, reference posts below:
   *
   *      here and https://github.com/vuejs/vue-router/issues/1280#issuecomment-353599914
   */

  sanitizedLink (url) {
    if (url.match(/^(http(s)?|ftp):\/\//)) {
      return {
        is: 'a',
        href: url,
        target: '_blank',
        rel: 'noopener'
      }
    }

    if (url[0] !== '/') {
      url = '/' + url
    }

    return {
      is: 'router-link',
      to: url
    }
  },

  isString (obj) { // it's robust
    return (Object.prototype.toString.call(obj) === '[object String]')
  },

  isEmpty (obj) {
    return Object.getOwnPropertyNames(obj).length === 0
  },

  /*
   * This routine is not normally in use for Live Vue, but can be very helpful to have
   * available in the kit for debugging, as it deals well with circular data references,
   * which often occur within Vuejs objects.
   *
   * The js-internal JSON.stringify(), on the other hand, will stack trace instead of
   * showing the content, on these.
   *
   * This code is courtesy of Guy Mograbi, https://stackoverflow.com/users/1068746/guy-mograbi,
   * via his StackExchange post https://stackoverflow.com/a/17773553/2113528
  */

  stringifyOnce (obj, replacer, indent) {
    let printedObjects = []
    let printedObjectKeys = []

    function printOnceReplacer (key, value) {
      if (printedObjects.length > 2000) { // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
        return 'object too long'
      }
      let printedObjIndex = false
      printedObjects.forEach(function (obj, index) {
        if (obj === value) {
          printedObjIndex = index
        }
      })

      if (key === '') { // root element
        printedObjects.push(obj)
        printedObjectKeys.push('root')
        return value
      } else if (printedObjIndex + '' !== 'false' && typeof (value) === 'object') {
        if (printedObjectKeys[printedObjIndex] === 'root') {
          return '(pointer to root)'
        } else {
          return '(see ' + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase() : typeof (value)) + ' with key ' + printedObjectKeys[printedObjIndex] + ')'
        }
      } else {
        let qualifiedKey = key || '(empty key)'
        printedObjects.push(value)
        printedObjectKeys.push(qualifiedKey)
        if (replacer) {
          return replacer(key, value)
        } else {
          return value
        }
      }
    }

    return JSON.stringify(obj, printOnceReplacer, indent)
  }
}
