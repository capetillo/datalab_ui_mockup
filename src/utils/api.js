// handles api requests for datasessions with configurable parameters and callback functions
async function fetchApiCall({ url, method, body = null, headers, successCallback = null, failCallback = null }) {
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

// this util function accepts a list of s3 bitbucket image links and returns the images reflecting that list
async function fetchImagesfromLinks(imageLinks){
  // api endpoint to archive images
  const url = ""
  // add image link list to body in json form
  const body = ""
  // return the images
  return await fetchApiCall(url, 'GET', body, console.log('success'), console.log('failure'))
}

export { fetchApiCall, fetchImagesfromLinks }
