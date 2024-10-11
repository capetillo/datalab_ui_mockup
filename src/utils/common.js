const calculateColumnSpan = (imageCount, imagesPerRow) => {
  const totalColumns = Math.floor(12 / Math.min(imagesPerRow, imageCount))
  return totalColumns
}

function siteIDToName(siteID) {
  const siteIDMap = {
    'COJ': 'Siding Spring Observatory',
    'CPT': 'South African Astronomical Observatory',
    'TFN': 'Teide Observatory',
    'LSC': 'Cerro Tololo Inter-American Observatory',
    'ELP': 'McDonald Observatory',
    'OGG': 'Haleakala Observatory',
    'TLV': 'Wise Observatory',
    'NGQ': 'Ali Observatory'
  }

  return siteIDMap[siteID?.toUpperCase()] || siteID
}

export { calculateColumnSpan, siteIDToName }
