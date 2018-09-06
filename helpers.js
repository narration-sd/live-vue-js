import config from '@/live-vue/config'

export default class LVHelpers {
  // n.b. we stick with having this as a instantiated cbject class, rather
  // than static, as we want two things: that further development can override
  // methods, and to not expand requirement for ES6 abilities which aren't
  // supported for example by Microsoft browsers. First follows second.

  // Thus, use these via e.g.
  //     import LVHelpers from '@/live-vue/helpers.js'
  //     let helpers = new LVHelpers()
  //     let foo = helpers.someFunc(fooOriginal)

  // To use in a template, see notes on sanitizedLink() below

  snakeToCamel (str) {
    return str.replace(/(-\w)/g, function (m) { return m[1].toUpperCase() })
  }

  directAndEditMatchesFor (introducer, item = null) {
    // The purpose here is to provide a matcher that recognizes both the direct
    // and editing pathinfo, for many given routes, accounting for the Craft
    // entry path changes between snake and camel case.

    // Matches created should function with both Vue and React, as their routers
    // use the same regex-based engine, path-to-regexp. Path-to-regexp provides
    // a 'helpered' environment, thus not allowing some otherwise useful regex
    // abilities. This accounts for the workable if not entirely precise method
    // used here.

    // This routine will operate for most route matches. It will not for empty
    // or non-introduced paths, so use regular regex matches without this routine
    // for the non-edit version of those:  specifically the home page, and paths
    // which are read entirely from / root, without a marking introducer. You
    // may like to use this routine to generate match for the edit route of these.

    // The introducer should be specified with leading slash, if softeners are
    // present to account for inconsistencies. The item should be specified if
    // there is one expected by the component launched by the route. See the
    // examples in the documentation.

    let itemMatch = item
      ? ':' + item + '([\\w-]+)?' + ':discard(.*)'
      : ':discard(.*)'

    // treat the introducer for slash so it always has a leading slash
    introducer = '/' + this.stripLeadingSlash(introducer)
    // and no trailing slash -- combination saves possible user tears
    introducer = this.stripTrailingSlash(introducer)

    let matcher = '(.+/entries' + this.snakeToCamel(introducer) +
      '/[\\d-]*|' + introducer + '/)' + itemMatch

    this.routerLog('matcher: ' + matcher)

    return matcher
  }

  previewMatch (introducer) {
    // life is simpler as well as more effective, in this third generation

    // treat the introducer for slash so it always has a leading slash
    introducer = '/' + this.stripLeadingSlash(introducer)
    // and no trailing slash -- combination saves possible user tears
    introducer = this.stripTrailingSlash(introducer)

    let matcher = '(.*/entries' + this.snakeToCamel(introducer) + ')/'

    this.routerLog('previewMatch: ' + matcher)
    return matcher
  }

  liveAndPreviewMatch (introducer) {
    // life is simpler as well as more effective, in this third generation

    // treat the introducer for slash so it always has a leading slash
    introducer = '/' + this.stripLeadingSlash(introducer)
    // and no trailing slash -- combination saves possible user tears
    introducer = this.stripTrailingSlash(introducer)

    let matcher = '(.+/entries' + this.snakeToCamel(introducer) +
      '.*|' + introducer + '/?)'

    this.routerLog('liveAndPreviewMatch: ' + matcher)
    return matcher
  }

  urlParse (url) {
    // we could have used new URL(), except IE doesn't
    // we could have used a polyfill, except doesn't for all IE
    // thus traditional method; let the DOM do it. I ask you, in 2018...

    var parser = document.createElement('a')
    parser.href = url
    return parser
  }

  clearUrlParser (parser) {
    parser.parentNode.removeChild(parser)
  }

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
  }

  stripLeadingSlash (url) {
    return url.replace(/^\//, '')
  }

  stripTrailingSlash (url) {
    return url.replace(/\/$/, '')
  }

  // these are handy to keep console log clean when not developing
  // note that turning on apiLog in config will also enable devLog(),
  // which is used to log just high-level activities, especially in
  // child Connect classes. apiLog() unleashes a flood. Control
  // these via config/config.js, and rebuild for production change.

  devLog (msg) {
    if (config.lvDevMode || config.apiDevMode) {
      console.log(msg)
    }
  }

  apiLog (msg) {
    if (config.apiDevMode) {
      console.log(msg)
    }
  }

  routerLog (msg) {
    if (config.routerDevMode) {
      console.log(msg)
    }
  }

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
   *     import Helpers from '@/live-vue/helpers'
   *
   * Then you can make this available, as part of your component data:
   *
   *      data () {
   *        return {
   *          helpers: new Helpers()
   *        }
   *      }
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
  }

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
   *
   * to  use it anywhere, just include the reference this way, and retrieve a string lising
   * by calling stringifyOnce(yourVariable); e.g. console.log(stringifyOnce(yourVar)
   *
   *     import stringifyOnce from '@/live-vue/stringify-once'
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
