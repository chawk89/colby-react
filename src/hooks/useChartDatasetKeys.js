import  { useMemo } from 'react'

const useChartDatasetKeys = (state, xAxis) => {
  const { keyLabels } = state.forms.axes
  return useMemo(() => keyLabels.filter((item => item.key != xAxis)), [keyLabels, xAxis])

}

export default useChartDatasetKeys