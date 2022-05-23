import { IPlaceObj } from '../../types'
const CONFIG = {
  flyPointLength: 400,
  viewerHeight: 4000,
  timeStepInSeconds: 600,
  points: {
    'gz': {
      label: '广州',
      gs84: [23.077832,113.30779]
    },
    'sh': {
     label: '上海',
     gs84: [31.239729,121.49967],
    }
  } as Record<string, IPlaceObj>,
 godViewerHeight: 1000 * 200000,
 controlTextMap: {
   '左': 'moveLeft',
   '右': 'moveRight'
 } as any
}
export default CONFIG;