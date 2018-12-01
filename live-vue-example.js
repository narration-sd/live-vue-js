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
 * This is an example file -- copy it to src/config, renaming to live-vue.js.
 *
 * The debug logging is set as may be useful for developing your routings and
 * your app. You will want to turn these off before delivery.
 *
 * As always, npm run build to have any config implemented for production.
 *
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

  // here are behavioral controls and constants for the js client

  directExceptPreview: false, // if true, avoid Live Vue speedup on page loads
  pagingQueryName: 'page', // ?name=nn query name you use for paging, if not page

  // these control the debug console content. apiDevMode implies lvDevMode
  lvDevMode: true, // light-weight indications which source provides the data
  apiDevMode: false, // very verbose, for Connect development
  dataDevMode: false, // when you need to see the data coming back
  routerDevMode: true, // useful when checking router matchings

  // --- you might want to add items of your own, for an applicationo ---

  // with CraftQL, there can be tokens
  tokens: 'S2XedNbHI_QeON3J2RZ4YxstCTkBA7HxBk7n2FmecH0gsxGRe4wHao3E350Vdb3g'

  // --- below here, don't modify: these will be live-vue required items ---
}
