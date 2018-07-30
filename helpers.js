export default {
  // when we may want an object with multiple methods or properties
}

// this form can be directly useful via import { name }
export function snakeToCamel (str) {
  return str.replace(/(-\w)/g, function (m) { return m[1].toUpperCase() })
}

export function directAndEdit (uri) {
  // the right kind of RE composition for the enginr that Vuejs Router
  // uses -- (npm) path-to-rexexp.
  //
  // We accomplish matching either direc
  // t or editor urls for suitable entries.
  // As ever, pathless, i.e. home page needs its own handling, and there may be
  // other special cases. :entry is not used, only its match position, since in
  // this case Live Vue will be providing its own in-progress edit of the entry.
  console.log('stcamel: ' + snakeToCamel('(/*/entries/:entry)?/' + uri))
  return snakeToCamel('(/*/entries/:entry)?/' + uri)
}
