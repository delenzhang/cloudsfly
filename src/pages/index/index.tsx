import { useState, useEffect } from 'react'
import { IDanMuMsgInfo } from '../../types'
import {initCesium} from './init'
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
      <div id="board_wrapper">
          {
            // avatarUrl ? <img src={avatarUrl} alt="" /> : null
          }
          {
           data.content ? <><span className='name'>{authorName}</span> 说： {data.content}</> : null 
          }
          
      </div>
    </>
    
  )
}

export default App
