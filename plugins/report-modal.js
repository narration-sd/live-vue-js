export const ReportModal = {
  // requires npm install vue-js-mod
  install (Vue, options) {
    Vue.mixin({
      data () {
        return {
          liveVueReportModalTitle: '',
          liveVueReportModalMsg: '',
          liveVueReportModalBtn: { title: 'Ok' }
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
          console.log('lvReporter: Error: ' + error)
          this.status = 'Loading failed...'
          this.lvShowErrorNotifier(
            'Loading failed...',
            error,
            {
              title: 'Accept'
            })
        }
      },
      beforeDestroy () {
        // if it was showing, close on switching views: e.g. browser back button
        this.lvCloseErrorNotifier()
      }
    })
  }
}
