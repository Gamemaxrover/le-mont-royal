import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import RestaurantPage from './RestaurantPage.jsx'
import './index.css'

const Page = window.location.pathname.replace(/\/+$/, '') === '/resto'
  ? RestaurantPage
  : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)