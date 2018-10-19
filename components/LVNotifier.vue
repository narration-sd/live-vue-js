<template>
    <v-dialog/>
</template>

<script>
import Vue from 'vue'
import { ReportModal } from '@/live-vue-js/plugins/report-modal.js'
import VModal from 'vue-js-modal'

Vue.use(ReportModal)
Vue.use(VModal, { dialog: true })

export default {
  name: 'LVNotifier'
}
</script>

<style>

  .v--modal {
     background: #0c5460 !important;
     color: lightgoldenrodyellow !important;
  }

</style>
