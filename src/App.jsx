import NarrativeMessage from './components/NarrativeMessage'
import ColbyChart from './components/ColbyChart'
import ColbyChartForm from './components/ColbyChartForm'
import { ChartProvider } from './context/ChartContext'

import './App.scss'

function App() {
  return (
    <ChartProvider>
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
