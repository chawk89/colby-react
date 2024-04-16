import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import DoughnutApp from './DoughnutApp.jsx'
import './index.css'


const loadElement = (id, Element) => {
  const root = document.getElementById(id)
  if (root) {
    return ReactDOM.createRoot(root).render(
      <Element />
    )
  }
}
const loadReactElements = async () => {
  
  if (!window.colbyInit) {
    throw Error('window.colbyInit is null')
  }
  await window.colbyInit()

  console.log('[loadReactElements] start')
  loadElement('root', App)
  loadElement('root-bubble', App)
  loadElement('root-waterfall', App)
  loadElement('root-doughnut', DoughnutApp)
  loadElement('root-pie', DoughnutApp)
  console.log('[loadReactElements] done')
}
loadReactElements();