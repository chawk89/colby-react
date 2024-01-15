import { useEffect, useMemo, useRef } from 'react'
import NarrativeMessage from './components/NarrativeMessage'
import ColbyChart from './components/ColbyChart'
import ColbyChartForm from './components/ColbyChartForm'
import ColbyLoader from './components/ColbyLoader'
import { ChartProvider } from './context/ChartContext'
import { useIsLoading } from './hooks/useIsLoading'

import './App.scss'

function App() {
  const isLoading = useIsLoading()

  return (
    isLoading ? <ColbyLoader /> : <ChartProvider>
      <div className="max-w-7xl mx-auto">
        <div className="w-full flex ">
          <div className="w-full xl:w-8/12 px-2">
            <ColbyChart />
            <ColbyChartForm />
          </div>
          <div className="w-full xl:w-4/12 px-2">
            <NarrativeMessage />
          </div>
        </div>
        <div className="w-full flex mt-4">
        </div>
      </div>
    </ChartProvider>
  )
}

export default App
