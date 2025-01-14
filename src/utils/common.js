const calculateColumnSpan = (imageCount, imagesPerRow) => {
  const totalColumns = Math.floor(12 / Math.min(imagesPerRow, imageCount))
  return totalColumns
}

const convertFilter = (filter) => {
  if (filter === 'V' || filter === 'gp') {
    return 'g'
  }
  else if (filter === 'rp' || filter === 'r') {
    return 'r'
  }
  else if (filter === 'B') {
    return 'b'
  }
}

const filterToPixelIndex = (filter) => {
  if (filter === 'r') {
    return 0
  }
  else if (filter === 'g') {
    return 1
  }
  else if (filter === 'b') {
    return 2
  }
}

const filterToColor = (filter) => {
  switch (filter) {
  case 'R': case 'rp':
    return 'red'
  case 'V': case 'gp':
    return 'green'
  case 'B':
    return 'blue'
  default:
    return 'var(--light-blue)'
  }
}

function siteIDToName(siteID) {
  const siteIDMap = {
    'COJ': 'Siding Spring Observatory @ New South Wales',
    'CPT': 'South African Astronomical Observatory @ Cape Town',
    'TFN': 'Teide Observatory @ Tenerife',
    'LSC': 'Cerro Tololo Inter-American Observatory @ Chile',
    'ELP': 'McDonald Observatory @ University of Texas',
    'OGG': 'Haleakala Observatory @ Maui',
    'TLV': 'Wise Observatory @ Tel Aviv University',
    'NGQ': 'Ali Observatory @ Tibet',
  }

  return siteIDMap[siteID?.toUpperCase()] || siteID
}

function initializeDate(dateString = 'none', defaultOffsetDays = 0) {
  /**
   * Initialize a date object from a string
   * If the date string is invalid, the current date is used with an optional offset
   * @param {string} dateString - The date string to be converted
   * @param {number} defaultOffsetDays - The number of days to offset if the date string is invalid
   * @returns {Date} - The date object
   */
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? new Date(Date.now() + defaultOffsetDays * 24 * 3600 * 1000) : date
}

export { calculateColumnSpan, siteIDToName, initializeDate, convertFilter, filterToPixelIndex, filterToColor }
