import { defineStore } from 'pinia'

export const useConfigurationStore = defineStore('configuration', {
  state() {
    return {
      isConfigLoaded: false,
      datalabApiBaseUrl: '',
      datalabArchiveApiUrl: '',
      observationPortalUrl: '',
      thumbnailServiceUrl: '',
      archiveType: 'ptr',
    }
  },
})
