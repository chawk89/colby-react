import NarrativeMessage from './components/NarrativeMessage'
import ColbyChart from './components/ColbyChart'
import ColbyDoughnutChartForm from './components/ColbyDoughnutChartForm'
import ColbyLoader from './components/ColbyLoader'
import { ChartProvider } from './context/ChartContext'
import { useLoadingStatus } from './hooks/useLoadingStatus'

import './App.scss'

function DoughnutApp() {
  const loadingStatus = useLoadingStatus()

  return (
    <>
      {loadingStatus != 'loaded' && <ColbyLoader />}
      <ChartProvider>
        <div className="max-w-7xl mx-auto mb-4">
          <div className="w-full flex ">
            <div className="w-full xl:w-8/12 px-2">
              <ColbyChart />
            </div>
            <div className="w-full xl:w-4/12 px-2 hidden">
              <NarrativeMessage />
            </div>
          </div>
          <div className="w-full flex mt-4">
            <ColbyDoughnutChartForm />
          </div>
        </div>
      </ChartProvider>
    </>
  )
}

export default DoughnutApp
