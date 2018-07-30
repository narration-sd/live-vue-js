
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

export default function stringifyOnce (obj, replacer, indent) {
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
