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

  // *todo* also in doc: every jot and tittle -- the + vs * on last part

  snakeToCamel (str) {
    return str.replace(/(-\w)/g, function (m) { return m[1].toUpperCase() })
  }

  directAndEditMatchesFor (arg, arg2) {
    // let ret = '(/.*/entries/)?' + arg
    // let ret = '(/.*/entries' + snakeToCamel(arg) + ')?(' + arg + ')?' + (arg2 || '.*')
    // let ret = '(/.*/entries' + snakeToCamel(arg) + ')?(' +
    //   '/?[\\d-]*' + arg + ')?' +
    //   ('/?' + (arg2 || '.*'))

    // *todo* besides making object after housecleaning, see that it works for
    // pagings, news, etc.. -- longer paths. Doc how this employs
    // https://forbeslindesay.github.io/express-route-tester/ on 2.9 version,
    // and special forms of vue-router's path-to-regexp', not ordinary regex,
    // and then why it's overall optional. But you could add your own.

    let ret = // '/(' +
      ':foo(' + arg + '/?)?' + // '(' +
      ':wut(/[\\w\\d-]+/entries' + this.snakeToCamel(arg) + '/?)?' +
      // ':foo(' + arg + '):wut(/[\\w\\d-]+/entries' + snakeToCamel(arg) // + '/' +
      ':' + (arg2 || 'dummy') + '([\\w\\d-]+)+'
    // ':foo(' + arg + '/?)?' + // '(' +
    // ':wut(/[\\w\\d-]+/entries' + snakeToCamel(arg) + ')?' +
    // // ':foo(' + arg + '):wut(/[\\w\\d-]+/entries' + snakeToCamel(arg) // + '/' +
    // ':' + (arg2 || 'dummy') + '(.*)?'

    // (arg2 || ':dummy(.*)') + ')'
    // let ret = // '/(' +
    //   '(' + arg + ')?' + '(' +
    //   '/:wut([\\w\\d-]+)/entries' + snakeToCamel(arg) + '/' +
    //   (arg2 || ':dummy(.*)') + ')?'
    // '/*/entries' + snakeToCamel(arg) + '/' + (arg2 || '*') // + ')?'
    // '/[\\w\\d-]+/entries' + snakeToCamel(arg) + '/' + (arg2 || '.*') // + ')?'
    // '(/:wut/entries' + snakeToCamel(arg) + '/?' + (arg2 || ':dummy') + ')?'
    // let ret = '(/.*/entries' + snakeToCamel(arg) + ')?(' + arg + ')?'
    // let ret = '/.*/entries' + snakeToCamel(arg) + '|' + arg + ''
    // let ret = '(/.*/entries/)?' + snakeToCamel(arg)
    // let ret = '(/.*/entries' + snakeToCamel(arg) + ')?(?P<grp>' + arg + ')?'
    // let ret = [
    //   '/.*/entries' + snakeToCamel(arg),
    //   arg
    // ]
    // let ret = '(/.*/entries' + snakeToCamel(arg) + ')?' + arg + '{0,1}'

    // let ret = '(/.*/entries' + snakeToCamel(arg) + ')?' + arg + ''
    this.routerLog('ret: ' + ret) // JSON.stringify(ret))

    return ret
  }

  routerLog (msg) {
    if (config.routerDevMode) {
      console.log(msg)
    }
  }

  // this is going away, kept for reference
  directAndEditMatch (
    section,
    entry = null) {
    // the right kind of RE composition for the enginr that Vuejs Router
    // uses -- (npm) path-to-rexexp.
    //
    // We accomplish matching either direc
    // t or editor urls for suitable entries.
    // As ever, pathless, i.e. home page needs its own handling, and there may be
    // other special cases. :entry is not used, only its match position, since in
    // this case Live Vue will be providing its own in-progress edit of the entry.
    let matcher = '(/?.*/entries/' + section
    matcher = this.snakeToCamel(matcher)
    let entrySegment = entry
      ? '/' + entry
      : ''

    matcher += entrySegment + ')|(/' + section + entrySegment + ')'

    this.routerLog('matcher: ' + matcher)
    return matcher
  }

  /*
   * This routine is not normally in use for Live Vue, but can be very helpful to have
   * available in the kit for debugging, as it deals well with circular data references,
   * which often occur within Vuejs objects.
   *
   * The js-internal JSON.stringify(), on the other hand, will stack trace instead of
   * show the content, on these.
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
