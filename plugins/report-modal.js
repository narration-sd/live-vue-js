/*
 * @link           https://narrationsd.com/
 * @copyright Copyright (c) 2018 Narration SD
 *
 * MIT LIcense
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export const ReportModal = {
  // requires npm install vue-js-modal
  install (Vue, options) {
    Vue.mixin({
      data () {
        return {
          lvStatus: 'Ready...',
          lvStatusLoading: 'Loading...',
          lvStatusFailed: 'Loading Failed...',
          lvReportModalTitle: '',
          lvReportModalMsg: '',
          lvReportModalBtn: { title: 'Ok' }
        }
      },
      methods: {
        lvShowErrorNotifier (title, msg, btn = { title: 'Ok' }) {
          this.$modal.show('dialog', {
            title: title,
            text: msg,
            buttons: [
              btn // btn could be more complex, with actions
            ]
          })
        },
        lvCloseErrorNotifier () {
          this.$modal.hide('dialog')
        },
        lvReporter (error) {
          this.lvStatus = this.lvStatusFailed
          this.lvShowErrorNotifier(
            'Loading failed...',
            error,
            {
              title: 'Accept'
            })
        },
        lvSetMessages (loading, failed) {
          // for languages etc., and you'll eet both
          // must do before first call against connector
          this.lvStatusLoading = loading
          this.lvStatus = loading
          this.lvStatusFailed = failed
        }
      },
      beforeDestroy () {
        // if it was showing, close on switching views: e.g. browser back button
        this.lvCloseErrorNotifier()
      }
    })
  }
}
