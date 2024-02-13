
const useChartDatasets = (state, datasetKey) => {
  if (!datasetKey) return []
  const { axes } = state.forms
  const { datasets } = axes
  return datasets[datasetKey]?.values || []

}

export default useChartDatasets