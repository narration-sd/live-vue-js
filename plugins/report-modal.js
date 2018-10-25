import helpers from '@/live-vue-js/helpers.js'
export const ReportModal = {
  // requires npm install vue-js-modal
  // uses liveVue prefix to stay out of other packages
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
        }
      }
    })
  }
}
