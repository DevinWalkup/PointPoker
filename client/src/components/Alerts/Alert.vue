<template>
  <div class="w-full sm:w-1/2 absolute right-0 sm:right-2 z-30">
  <div v-for="alert in alerts" :key="alert.Id">
    <WarningAlert class="mt-2 mb-2" v-if="isWarningAlert(alert)" :alert="alert" />
    <ErrorAlert class="mt-2 mb-2" v-if="isErrorAlert(alert)" :alert="alert"/>
    <SuccessAlert class="mt-2 mb-2" v-if="isSuccessAlert(alert)" :alert="alert"/>
  </div>
  </div>
</template>

<script>
import WarningAlert from "./WarningAlert.vue";
import AlertStore from '../../stores/AlertStore'
import utilMixin from '../../scripts/util-mixin'
import ErrorAlert from "./ErrorAlert.vue";
import SuccessAlert from "./SuccessAlert.vue";

export default {
  name: "Alert",

  components: {SuccessAlert, ErrorAlert, WarningAlert},

  mixins: [utilMixin],

  data() {
    return {
      alerts: AlertStore.alerts
    }
  },

  methods: {
    isWarningAlert(alert) {
      return alert.AlertType === 'warning';
    },

    isErrorAlert(alert) {
      return alert.AlertType === 'error';
    },

    isSuccessAlert(alert) {
      return alert.AlertType === 'success'
    }
  },
}
</script>