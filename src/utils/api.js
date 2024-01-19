// loads config data
async function loadConfig() {
  try {
    const response = await fetch('/config/config.json')
    if (!response.ok) {
      throw Error('Failed to load configuration')
    }
    const configData = response.json()
    return configData
  } catch (error) {
    console.error('Error loading configuration:', error)
  }
}

// handles api requests for datasessions with configurable parameters and callback functions
async function fetchApiCall({ url, method, body = null, successCallback = null, failCallback = null }) {

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Token 123456789abcdefg',
  }
  
  const config = {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null
  }

  try {
    const response = await fetch(url, config)
    const responseData = await response.json()
    if (!response.ok) {
      console.error('Response not OK', responseData)
      if (failCallback) {
        // invoking failure callback
        failCallback (responseData, response.status)
      } 
    } else {
      if (successCallback) {
        // invoking success callback with responsedata and returning it for further processing
        successCallback (responseData)
      }
    } 
    return responseData
  } catch (error) {
      console.error('Error raised when sending request', error)
      if (failCallback) failCallback (error)
  }
}

export { fetchApiCall, loadConfig }
