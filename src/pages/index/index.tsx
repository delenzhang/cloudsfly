import { useState, useEffect } from 'react'
import {initCesium} from './init'

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    initCesium()
  }, [])
  return (
    <>
      <div id="cesiumContainer"></div>
      <div id="ThreeContainer"></div>
    </>
    
  )
}

export default App
