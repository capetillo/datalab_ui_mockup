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
    console.log('response data:', responseData)
    return responseData
  } catch (error) {
      console.error('Error raised when sending request', error)
      if (failCallback) failCallback (error)
  }
}

async function authenticateAndGetToken() {
  const authUrl = 'https://datalab-archive.photonranch.org/api-token-auth/'
  const credentials = {
      username: 'eng',
      password: 'sbatoo1'
  }

  try {
      const response = await fetch(authUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
          console.log('Authentication successful:', data)
          return data.token
      } else {
          console.error('Authentication failed:', data)
          throw new Error('Authentication failed')
      }
  } catch (error) {
      console.error('Error during authentication request:', error)
      throw error
  }
}

export { fetchApiCall, authenticateAndGetToken }
