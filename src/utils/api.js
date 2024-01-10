async function fetchApiCall(url, method, body = null) {
    try {
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

      const response = await fetch(url, config)
  
      if (!response.ok) {
        try {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error fetching data')
        } catch (jsonError) {
          throw new Error('Error fetching data')
        }
      }
  
      return await response.json()
    } catch (error) {
      console.error('Fetch API Call Error:', error)
      throw error
    }
  }
  
  export { fetchApiCall }
  