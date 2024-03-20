import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import BubbleApp from './BubbleApp.jsx'
import WaterFallApp from './WaterFallApp.jsx'
import './index.css'

const loadElement = (id, Element) => {
  const root = document.getElementById(id)
  if (root) {
    return ReactDOM.createRoot(root).render(
      <Element />
    )
  }
}
loadElement('root', App)
loadElement('root-bubble', BubbleApp)
loadElement('root-waterfall', WaterFallApp)