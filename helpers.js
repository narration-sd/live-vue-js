export default {
  // when we may want an object with multiple methods or properties
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
