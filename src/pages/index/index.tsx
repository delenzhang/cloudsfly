import { useState, useEffect } from 'react'
import { IDanMuMsgInfo } from '../../types'
import {initCesium} from './init'
import "./index.css"
const initData : IDanMuMsgInfo = {} as IDanMuMsgInfo
function App() {
  const [data , setData] = useState(initData)
  useEffect(() => {
    initCesium((msg: IDanMuMsgInfo) => {
      console.log('delen >>> view msg', msg)
      setData(msg)
    })
  }, [])
  const avatarUrl = data.avatarUrl ? `${data.avatarUrl.replace('//i1.hdslb.com/', `/`)}` : null
  const authorName = data.authorName ? data.authorName : '系统'
  return (
    <>
      <div id="cesiumContainer"></div>
      <div id="toolbar">
      <table className="infoPanel">
        <tbody>
          <tr>
            <td>Heading: <span id="heading"></span>°</td>
          </tr>
          <tr>
            <td>Pitch: <span id="pitch"></span>°</td>
          </tr>
          <tr>
            <td>roll: <span id="roll"></span>°</td>
          </tr>
          <tr>
            <td>Speed: <span id="speed"></span>m/s</td>
          </tr>
        </tbody>
      </table>
      </div>
      {
        data.content ?<div id="board_wrapper">
        {
          // avatarUrl ? <img src={avatarUrl} alt="" /> : null
        }
        {
         data.content ? <><span className='name'>{authorName}</span> 说： {data.content}</> : null 
        }
        
    </div> : null
      }
      
    </>
    
  )
}

export default App
