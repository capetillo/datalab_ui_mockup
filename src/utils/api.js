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

    // Check for empty or non-JSON response
    if (response.ok && response.headers.get('Content-Length') === '0') {
      // No content return a success with null
      successCallback ? successCallback(null) : null
    } else {
      const responseData = await response.json()

      if (!response.ok) {
        console.error('Response not OK', responseData)
        failCallback ? failCallback(responseData, response.status) : null
      } else {
        // Invoking success callback with responseData
        successCallback ? successCallback(responseData) : null
      }
      return responseData
    }
  } catch (error) {
    console.error('Error raised when sending request', error)
    failCallback ? failCallback(error) : null
  }
}

export { fetchApiCall }
