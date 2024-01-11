async function fetchApiCall(url, method, body = null) {
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
    if (!response.ok) {
      console.error("Response not OK", response)
      throw Error("Response not OK", response)
    }
    else {
      return await response.json()
    }
  } catch (error) {
    console.error("Error raised when sending request.", error)
    throw Error("Error raised when sending request.", error)
  }
}
  
  export { fetchApiCall }
