import React, { useMemo } from 'react'

const useChartLabels = (state, xAxis) => {
  const { labels } = state.data
  
  return labels
}

export default useChartLabels