import config from '@/live-vue/config'

export default class LVHelpers {
  // n.b. we stick with making this a instantiated cbject class, rather than
  // static, as we want two things: that further development can override
  // methods, and to not expand requirement for ES6 abilities which aren't
  // supported for example by Microsoft browsers. First follows second.

  // Thus, use these via e.g.
  //     import LVHelpers from '@/live-vue/helpers.js'
  //     helpers = new LVKelpers()
  //     let foo = helpers.someFunc(fooOriginal)

  // *todo* also in doc: every jot and tittle -- e.g. why the + vs * on last part

  snakeToCamel (str) {
    return str.replace(/(-\w)/g, function (m) { return m[1].toUpperCase() })
  }

  directAndEditMatchesFor (marker, introducer) {
    // This function allows having only one entry for both runtime and edit
    // routes, when there is enough information in the paths.
    //
    // For home pages and their edit, or other cases like this, you'll simply provide a
    // route config for each, in the normal way.
    //
    // What we are interested in here is only the tail of the path -- after
    // a marker. However, the marker and its predecessors can occur in two
    // differing ways: in snake-case naturally (from runtime call), or in
    // camelCase (from edit), where it will also be prefixed by an admin
    // introducer we don't care to know, plus '/entries'.
    //
    // These factors guide this matcher, which in turn is used within
    // vue-router, which in turn operates with the path-to-regexp library,
    // intending to be helpful to easier routing matches. This doesn't allow
    // all normal regex abilities, but does provide its own special named
    // element forms which can be used as if 'or' matchers.
    //
    // https://forbeslindesay.github.io/express-route-tester/ set to 2.0 version
    // can be very useful in working out such a matcher.

    let matcher =
      ':discard1(' + marker + '/?)?' + // '(' +
      ':discard2(/[\\w\\d-]+/entries' + this.snakeToCamel(marker) + '/?)?' +
      ':' + (introducer || 'discard3') + '([\\w\\d-]+)+'
    this.routerLog('matcher: ' + matcher)

    return matcher
  }

  urlParse (url) {
    // we could have used new URL(), except IEdoesn't
    // we could have used a polyfill, except doesn'tforallIE
    // thus tradional method; let the DOM do it. I ask you, in 2018...

    var parser = document.createElement('a')
    parser.href = url
    return parser
  }

  routerLog (msg) {
    if (config.routerDevMode) {
      console.log(msg)
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
