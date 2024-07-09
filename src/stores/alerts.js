import { defineStore } from 'pinia'

/**
 * This store is used to manage the alert that is displayed at the top of the page.
 * The alert can be of type 'success', 'error', 'warning', or 'info'.
 * To use this import the store and call the setAlert action with the type and text of the alert.
 */
export const useAlertsStore = defineStore('alerts', {
  state() {
    return{
      // The type of alert to display ('success', 'error', 'warning', 'info')
      alertType: 'warning',
      // The text to display in the alert
      alertText: 'default alert text',
    }
  },
  actions: {
    setAlert(type, text, prefix = '') {
      console.log('prefix', prefix)
      console.log(prefix + text)
      this.alertType = type
      this.alertText = prefix ? prefix + ' ' + text : text
    }
  }
})
