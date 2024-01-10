/**
 * Performs a fetch API call.
 * @param {string} url - The URL to fetch.
 * @param {string} method - The HTTP method (GET, POST, etc.).
 * @param {object} [body] - The body of the request for POST, PATCH, etc.
 * @param {object} [headers] - Additional headers for the request.
 * @returns {Promise<object>} - The response data.
 */
async function fetchApiCall(url, method, body = null, headers = {}) {
    try {
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Token 123456789abcdefg', // Default or dynamic token
      }
  
      const config = {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: body ? JSON.stringify(body) : null
      }
  
      const response = await fetch(url, config)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error fetching data')
      }
  
      return response.json()
    } catch (error) {
      console.error('Fetch API Call Error:', error)
      throw error
    }
  }
  
  export { fetchApiCall }
