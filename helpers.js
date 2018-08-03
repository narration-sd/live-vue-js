import config from '@/live-vue/config'

export default class Helpers {
  // n.b. we stick with making this a instantiated cbject class, rather than
  // static, as we want two things: that further development can override
  // methods, and to not expand requirement for ES6 abilities which aren't
  // supported for example by Microsoft browsers.

  // also in doc: every jot and tittle -- the + vs * on last part

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
    matcher = snakeToCamel(matcher)
    let entrySegment = entry
      ? '/' + entry
      : ''

    matcher += entrySegment + ')|(/' + section + entrySegment + ')'

    this.routerLog('matcher: ' + matcher)
    return matcher
  }
}

// this form can be directly useful via import { name }
export function snakeToCamel (str) {
  return str.replace(/(-\w)/g, function (m) { return m[1].toUpperCase() })
}

export function directAndEditMatch (
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
  matcher = snakeToCamel(matcher)
  let entrySegment = entry
    ? '/' + entry
    : ''

  matcher += entrySegment + ')|(/' + section + entrySegment + ')'

  console.log('matcher: ' + matcher)
  return matcher
}

export function testit (arg, arg2) {
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
    ':wut(/[\\w\\d-]+/entries' + snakeToCamel(arg) + '/?)?' +
    // ':foo(' + arg + '):wut(/[\\w\\d-]+/entries' + snakeToCamel(arg) // + '/' +
    ':' + (arg2 || 'dummy') + '([\\w\\d-]+)?'
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
  console.log('ret: ' + ret) // JSON.stringify(ret))

  return ret
}
