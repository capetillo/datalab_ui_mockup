async function fetchApiCall(url, method, body = null, successCallback, failCallback) {
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
        failCallback (responseData, response.status)
        throw new Error ('Reponse not OK')
      } 
    } else {
      if (successCallback) {
        successCallback (responseData)
        return responseData
      }
    } 
  } catch (error) {
      console.error('Error raised when sending request', error)
      if (failCallback) failCallback (error)
      throw error
  }
}

export { fetchApiCall }
