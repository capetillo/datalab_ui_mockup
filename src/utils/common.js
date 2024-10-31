const calculateColumnSpan = (imageCount, imagesPerRow) => {
  const totalColumns = Math.floor(12 / Math.min(imagesPerRow, imageCount))
  return totalColumns
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

export { calculateColumnSpan, siteIDToName }
