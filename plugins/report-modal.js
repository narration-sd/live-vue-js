export const ReportModal = {
  // requires npm install vue-js-mod
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
