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

/*
 * This configuration file affects various Live VUe possible functions.
 *
 * Some are used only with Vuex architectures, for example, while the debug
 * controllers affect the Connect systems on all Live Vue apps.
 *
 * They're individually explained.
 *
 * Note that to effect their change for production, you'll generally need to run
 * a build, at the least to assure all browser-specific adjustments are applied.
 */

export default {
  // these two are handy when Vuex along with browser persistence is in use
  storePersistence: 1 / 48, // fraction of day, js formatted, to remember app state
  liveVuePathTime: 0, // minutes to hold current spa route when editing - zero is always

  // these control the debug console content. apiDevMode implies lvDevMode
  lvDevMode: true, // light-weight indications which source provides the data
  apiDevMode: false, // very verbose, for Connect development
  routerDevMode: false // useful when checking router matchings

  // --- below here, don't modify: these will be live-vue required items ---

  // there was a call here to retrieve router from main.js, now eliminated to
  // facilitate use with react, as it removes dependency on Vue router.
  // *todo* when we're sure all handling is present for that, remove this comment
}
