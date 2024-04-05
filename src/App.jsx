import NarrativeMessage from './components/NarrativeMessage'
import ColbyChart from './components/ColbyChart'
import ColbyChartForm from './components/ColbyChartForm'
import ColbyLoader from './components/ColbyLoader'
import { ChartProvider } from './context/ChartContext'
import { useLoadingStatus } from './hooks/useLoadingStatus'
import useIsStorageValueExists from './hooks/useIsStorageValueExists'

import ConfirmDialog from './components/ConfirmDialog'
import { useState } from 'react'

import './App.scss'

function App() {
  const [isFirstLoading, setIsFirstLoading] = useState(true);


  const loadingStatus = useLoadingStatus()
  const [storageValueExists, clearStorageCache] = useIsStorageValueExists()
  const handleConfirm = () => {
    clearStorageCache()
    setIsFirstLoading(false)
  }
  const handleCancel = () => {
    setIsFirstLoading(false)
  }

  return (
    isFirstLoading && storageValueExists ?
      <ConfirmDialog message={'Do you want to clear the cache?'} onConfirm={handleConfirm} onCancel={handleCancel}
      /> :
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
              <ColbyChartForm />
            </div>
          </div>
        </ChartProvider>
      </>
  )
}

export default App
