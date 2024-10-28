const calculateColumnSpan = (imageCount, imagesPerRow) => {
  const totalColumns = Math.floor(12 / Math.min(imagesPerRow, imageCount))
  return totalColumns
}

function initializeDate(dateString, defaultOffsetDays = 0) {
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? new Date(Date.now() + defaultOffsetDays * 24 * 3600 * 1000) : date
}

export { calculateColumnSpan, initializeDate }
