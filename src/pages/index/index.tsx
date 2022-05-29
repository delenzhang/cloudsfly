import { useState, useEffect } from 'react'
import { IDanMuMsgInfo } from '../../types'
import {initCesium} from './init'
import "./index.css"
const initData : IDanMuMsgInfo = {} as IDanMuMsgInfo
const queryString = location.search.replace('?', '');
const hideControl = queryString.includes('hidecontrol')
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
         
          {
            hideControl ?  <tr>
            <td>
               真实世界地图模拟飞行游戏，弹幕控制游戏，输入以下弹幕控制飞机
            </td>
          </tr> :  
            <>
             <tr>
            <td>
              (点击窗口使用键盘改变操作设置)
            </td>
          </tr>
          <tr>
            <td>v （切换第一视角/上帝视角）</td>
          </tr>
            </>
          }
          <tr>
            <td>上下: <span id="heading"></span>°</td>
          </tr>
          {
            hideControl ? null :  <tr>
            <td>向左（←）/ 向右（→）</td>
          </tr>
          }
         
          <tr>
            <td>左右: <span id="pitch"></span>°</td>
          </tr>
          {
            hideControl ? null : <tr>
            <td>向上（↑）/向下（↓）</td>
          </tr>
          }
          
          <tr>
            <td>反转: <span id="roll"></span>°</td>
          </tr>
          {
            hideControl ? null : <tr>
            <td>左旋（← + ⇧）/右旋（→ + ⇧）</td>
          </tr>
          }
          
          <tr>
            <td>速度: <span id="speed"></span>m/s</td>
          </tr>
          {
           hideControl ? null : <tr>
           <td>加速（↑ + ⇧）/ 减速（↓ + ⇧）</td>
         </tr>
          }
            {
              hideControl ? <>
              <tr>
                <td>弹幕输入【上帝视角/第一视角】切换视图</td>
              </tr>
              <tr>
                <td>弹幕输入【上/下/左/右/左旋/右旋】控制飞机，可使用【上10: 表示向上调整10次，下15：向下调整10次】</td>
              </tr>
              <tr>
                <td>弹幕输入【加速/减速】控制飞机航行速度</td>
              </tr>
              </>: null
            }
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
