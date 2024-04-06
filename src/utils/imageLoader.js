import { fetchApiCall } from '@/utils/api'
import { useSettingsStore } from '@/stores/settings'

const cacheOptions = { 'ignoreVary': true, 'ignoreMethod': true, 'ignoreSearch': true }


async function getAllCacheKeys(size) {
  const cacheName = size + 'Thumbnails'
  return caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      return keys
    })
  })
}

async function getImageFromBasename(size, archive, url, imageBasename) {
  // Clean up the -large or -small on the basename from ptr archive images
  imageBasename = imageBasename.replace('-small', '').replace('-large', '')
  const cacheName = size + 'Thumbnails'
  return caches.open(cacheName).then((cache) => {
    return cache.match(imageBasename, cacheOptions).then(function (response) {
      return response || cacheImageFromBasename(size, archive, url, imageBasename)
    })
  })
}

async function deleteCachedImageFromBasename(size, imageBasename) {
  console.log('Calling deleteCachedImageFromBasename with basename: ' + size + ' - ' + imageBasename)
  const cacheName = size + 'Thumbnails'
  return caches.open(cacheName).then((cache) => {
    return cache.delete(imageBasename, cacheOptions)
  })
}

async function cacheImageFromBasename(size, archive, url, imageBasename) {
  console.log('Calling cacheImageFromBasename with basename: ' + size + ' - ' + imageBasename)
  if (archive == 'ptr') {
    if (!url) {
      const store = useSettingsStore()
      const thumbnailBasename = imageBasename + '-' + size
      const frameUrl = store.datalabArchiveApiUrl + 'frames/?basename_exact=' + thumbnailBasename
      const responseData = await fetchApiCall({ url: frameUrl, method: 'GET' })
      if (responseData && responseData.results) {
        url = responseData.results[0].url
      }
    }
    if (url) {
      const imageResponse = await fetch(url, { method: 'GET', mode: 'cors' })
      const cacheName = size + 'Thumbnails'
      caches.open(cacheName).then((cache) => {
        cache.put(imageBasename, imageResponse.clone())
      })
      return imageResponse.clone()
    }
    else {
      console.error('Failed to get frame data for image ' + imageBasename)
    }
  }
}

export { getImageFromBasename, deleteCachedImageFromBasename, getAllCacheKeys }