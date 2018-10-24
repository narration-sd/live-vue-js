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
      watch: {
        'liveVueReportModalMsg' () {
          this.$_liveVueReportModal(this.liveVueReportModalMsg)
        }
      },
      methods: {
        lvQuit () {
          // this.$emit('close')
          // console.log('modal: ' + JSON.stringify(this.$liveVueReportErr))
          // this.$_liveVueReportModal.toggle(false)
          // this.$_liveVueReportModal.hide(this.liveVueReportModalMsg())
          alert('me lvQuit')
        }
      }
    })

    Vue.prototype.$liveVueReportErr = function (title, msg, btn = { title: 'Ok' }) {
      helpers.devLog('$liveVueReportErr: ' + msg)
      this.liveVueReportModalTitle = title
      this.liveVueReportModalMsg = msg
      this.liveVueReportModalBtn = btn // thus btn could be more complex, with actions
    }

    Vue.prototype.$_liveVueReportModal = function (msg) {
      this.$modal.show('dialog', {
        title: this.liveVueReportModalTitle,
        text: this.liveVueReportModalMsg,
        buttons: [
          this.liveVueReportModalBtn
        ]
      })
    }

    Vue.prototype.$liveVueReportModalClose = function () {
      this.$modal.hide('dialog')
    }
  }
}
