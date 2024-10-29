import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './component/header'
import Banner from './component/banner'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Banner />
    </>
  )
}

export default App
