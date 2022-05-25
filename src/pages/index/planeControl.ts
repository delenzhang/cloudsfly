import * as Cesium from 'cesium';
import CONFIG from './Config'
import { IPlaceObj, IDanMuMsgInfo } from '../../types'
// import { io } from 'socket.io-client'
import ChatClientRelay from './ChatClientRelay'
// const socket = io(`ws://${location.host}/api`);
const MINSPEED = 50
const MAXSPEED = 400
export default class PlaneControl {
  viewer: any
  position: any
  hpRoll: any
  dom: any
  chatClient: any
  speed = MINSPEED
  roomId = 21788920
  modelUrl = '/cloudsfly-lib/asserts/Cesium_Air.glb'
  messages = [] as any
  config = {
    autoTranslate: false
  }
  timer: any;
  fps = 18;
  isGodView =  true;
  flag = {
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,
    turnLeft: false,
    turnRight: false
  } as any
  constructor(viewer: any) {
    this.viewer = viewer
    this.chatClient = new ChatClientRelay(this.roomId, this.config.autoTranslate)
    // this.initSocket()
  }
  initSocket() {
    
    // this.chatClient.onAddGift = this.onAddGift
    // this.chatClient.onAddMember = this.onAddMember
    // this.chatClient.onAddSuperChat = this.onAddSuperChat
    // this.chatClient.onDelSuperChat = this.onDelSuperChat
    // this.chatClient.onUpdateTranslation = this.onUpdateTranslation
    
  }
  onAddText(data: any) {
    console.log('delen >>>', data);
    this.messages.push(data);
  }
  getPosition(time: any, result: any) {
    console.log(time, result, '>>>>')
    return this.position
  }
  getOrientation() {
    return Cesium.Transforms.headingPitchRollQuaternion(this.position, this.hpRoll)
  }
  
  init(startPoint: IPlaceObj, callback: Function) {
    const viewer = this.viewer
    const canvas = viewer.canvas;
    const that = this
    canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
    canvas.addEventListener("click", function () {
      canvas.focus();
    });
    canvas.focus();
    
    const scene = viewer.scene;
    
    const pathPosition = new Cesium.SampledPositionProperty();
    const entityPath = viewer.entities.add({
      position: pathPosition,
      name: "path",
      path: {
        show: true,
        leadTime: 0,
        trailTime: 60,
        width: 20,
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.3,
          taperPower: 0.3,
          color: Cesium.Color.PALEGOLDENROD,
        }),
      },
    });
    
    const camera = viewer.camera;
    const controller = scene.screenSpaceCameraController;
    let r = 0;
    const center = new Cesium.Cartesian3();
    
    const hpRoll = new Cesium.HeadingPitchRoll();
    const hpRange = new Cesium.HeadingPitchRange();
    const deltaRadians = Cesium.Math.toRadians(1.0);
    
    let position = Cesium.Cartesian3.fromDegrees(
      startPoint.gs84[1],
      startPoint.gs84[0],
      CONFIG.viewerHeight
    );
    let speedVector = new Cesium.Cartesian3();
    const fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
      "north",
      "west"
    );
    
    const planePrimitive = scene.primitives.add(
      Cesium.Model.fromGltf({
        url: '/cloudsfly-lib/asserts/Cesium_Air.glb',
        modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
          position,
          hpRoll,
          Cesium.Ellipsoid.WGS84,
          fixedFrameTransform
        ),
        minimumPixelSize: 128,
      })
    );
    
    planePrimitive.readyPromise.then(function (model: any) {
      // Play and loop all animations at half-speed
      model.activeAnimations.addAll({
        multiplier: 0.5,
        loop: Cesium.ModelAnimationLoop.REPEAT,
      });
    
      // Zoom to model
      r = 2.0 * Math.max(model.boundingSphere.radius, camera.frustum.near);
      controller.minimumZoomDistance = r * 0.5;
      Cesium.Matrix4.multiplyByPoint(
        model.modelMatrix,
        model.boundingSphere.center,
        center
      );
      const heading = Cesium.Math.toRadians(230.0);
      const pitch = Cesium.Math.toRadians(-20.0);
      hpRange.heading = heading;
      hpRange.pitch = pitch;
      hpRange.range = r * 50.0;
      camera.lookAt(center, hpRange);
      update();
    });

    function turnRight() {
      hpRoll.heading += deltaRadians;
      if (hpRoll.heading > Cesium.Math.TWO_PI) {
        hpRoll.heading -= Cesium.Math.TWO_PI;
      }
    }

    function rollRight() {
      // roll right
      hpRoll.roll += deltaRadians;
      if (hpRoll.roll > Cesium.Math.TWO_PI) {
        hpRoll.roll -= Cesium.Math.TWO_PI;
      }
    }

    function pitchDown() {
      hpRoll.pitch -= deltaRadians;
      if (hpRoll.pitch < -Cesium.Math.TWO_PI) {
        hpRoll.pitch += Cesium.Math.TWO_PI;
      }
    }

    function pitchUp() {
      hpRoll.pitch += deltaRadians;
      if (hpRoll.pitch > Cesium.Math.TWO_PI) {
        hpRoll.pitch -= Cesium.Math.TWO_PI;
      }
    }
    function rollLeft() {
      hpRoll.roll -= deltaRadians;
      if (hpRoll.roll < 0.0) {
        hpRoll.roll += Cesium.Math.TWO_PI;
      }
    }
    function turnLeft() {
      hpRoll.heading -= deltaRadians;
      if (hpRoll.heading < 0.0) {
        hpRoll.heading += Cesium.Math.TWO_PI;
      }
    }     
    document.addEventListener("keydown", function (e) {
      console.log(e.keyCode, '<<<')
      switch (e.keyCode) {
        case 86:
          that.isGodView = !that.isGodView;
          break
        case 40:
          if (e.shiftKey) {
            // speed down
            that.speed = Math.max(--that.speed, MINSPEED);
          } else {
            // pitch down
            console.log(121212)
            pitchDown()
          }
          break;
        case 38:
          if (e.shiftKey) {
            // speed up
            that.speed = Math.min(++that.speed, MAXSPEED);
          } else {
            // pitch up
            pitchUp()
          }
          break;
        case 39:
          if (e.shiftKey) {
            rollRight() 
          } else {
            // turn right
            turnRight()
          }
          break;
        case 37:
          if (e.shiftKey) {
            // roll left until
            rollLeft()
          } else {
            // turn left
            turnLeft() 
          }
          break;
        default:
      }
    });

    const leftRollText = '左旋'
    const rightRollText = '右旋'
    const rightText = '右'
    const leftText = '左'
    const upText = '上'
    const downText = '下'

    this.chatClient.onAddText = (msgInfo: IDanMuMsgInfo) => {
        if (msgInfo.content.includes('上帝模式')) {
          this.isGodView = true
        } else if (msgInfo.content.includes('第一视角')) {
          this.isGodView = false
        } else if(msgInfo.content.includes("加速"))  {
          that.speed = Math.min(that.speed+10, MAXSPEED);
        } else if(msgInfo.content.includes("减速"))  {
          that.speed = Math.max(that.speed - 10, MINSPEED);
        } 
        else if(msgInfo.content.includes(leftRollText))  {
          this.handleContent(msgInfo.content, leftRollText, () => {
            rollLeft()
          })
        } else if(msgInfo.content.includes(rightRollText))  {
          this.handleContent(msgInfo.content, rightRollText, () => {
            rollRight()
          })
        } else if(msgInfo.content.includes(leftText))  {
          this.handleContent(msgInfo.content, leftText, () => {
            turnLeft()
          })
          
        } else if(msgInfo.content.includes(rightText))  {
          this.handleContent(msgInfo.content, rightText, () => {
            turnRight()
          })
        }
        else if(msgInfo.content.includes(upText))  {
          this.handleContent(msgInfo.content, upText, () => {
            pitchUp()
          })
          
        } else if(msgInfo.content.includes(downText))  {
          this.handleContent(msgInfo.content, upText, () => {
            pitchDown()
          })
        }
        callback && callback(msgInfo)
    }
     this.chatClient.start()
    
    const headingSpan = document.getElementById("heading") as any;
    const pitchSpan = document.getElementById("pitch") as any;
    const rollSpan = document.getElementById("roll") as any;
    const speedSpan = document.getElementById("speed")as any;
    let lastTime = +new Date()
    function update() {
      viewer.scene.preUpdate.addEventListener(function (scene: any, time: any) {
        const now = new Date().getTime()
        const delta = now - lastTime
        if (delta > (1000 / that.fps)) {
          lastTime = now
        } else {
          return
        }
        speedVector = Cesium.Cartesian3.multiplyByScalar(
          Cesium.Cartesian3.UNIT_X,
          that.speed / 10,
          speedVector
        );
        position = Cesium.Matrix4.multiplyByPoint(
          planePrimitive.modelMatrix,
          speedVector,
          position
        );
        pathPosition.addSample(Cesium.JulianDate.now(), position);
        Cesium.Transforms.headingPitchRollToFixedFrame(
          position,
          hpRoll,
          Cesium.Ellipsoid.WGS84,
          fixedFrameTransform,
          planePrimitive.modelMatrix
        );
        if (that.isGodView) {
            Cesium.Matrix4.multiplyByPoint(
              planePrimitive.modelMatrix,
              planePrimitive.boundingSphere.center,
              center
            );
            hpRange.heading = hpRoll.heading;
            hpRange.pitch = hpRoll.pitch + Cesium.Math.toRadians(-40.0);
            camera.lookAt(center, hpRange);
          // viewer.camera.lookAt(position, new Cesium.HeadingPitchRange(hpRoll.heading, hpRoll.pitch + Cesium.Math.toRadians(-16.0), 100))
        } else {
          let cartesian3 = new Cesium.Cartesian3(position.x, position.y, position.z);
          let cartographic = scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
          let lng = Cesium.Math.toDegrees(cartographic.longitude) + 0.00001852398509 * 2 * Math.cos((270 ) * 2 * Math.PI / 360);
          let lat = Cesium.Math.toDegrees(cartographic.latitude) + 0.00001852398509 * 2 * Math.sin((270 ) * 2 * Math.PI / 360);
          let alt = cartographic.height + 10;
          viewer.camera.setView({
              destination: Cesium.Cartesian3.fromDegrees(lng, lat, alt),
              orientation: {
                // 指向  镜头随小车变化角度
                heading: hpRoll.heading,
                // 视角固定
                pitch: hpRoll.pitch ,
                roll: hpRoll.roll
              }
            });
        }
        // if (fromBehind.checked) {
        //   // Zoom to model
        //   Cesium.Matrix4.multiplyByPoint(
        //     planePrimitive.modelMatrix,
        //     planePrimitive.boundingSphere.center,
        //     center
        //   );
        //   hpRange.heading = hpRoll.heading;
        //   hpRange.pitch = hpRoll.pitch;
        //   camera.lookAt(center, hpRange);
        // }
      });
    }
    
    viewer.scene.preRender.addEventListener(function (scene: any, time: any) {
      headingSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.heading).toFixed(
        1
      );
      pitchSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.pitch).toFixed(1);
      rollSpan.innerHTML = Cesium.Math.toDegrees(hpRoll.roll).toFixed(1);
      speedSpan.innerHTML = that.speed.toFixed(1);
    });   
    
  }

  handleContent(content: string, txt: string, cb: Function) {
    const reg = new RegExp(`${txt}[^\\d]*(\\d+)`) as any
    if (reg.test(content)) {
      const res = reg.exec(content)
      let num = parseInt(res[1]) as any
      num = isNaN(num) ? 1 : num
      for (let i = 0; i < num; i++) {
        setTimeout(() => {
          cb && cb()
        }, 1000 / this.fps)
      }
      
    }
  }
  curMessage = null;
  lastMessage = null;
  /**
   * 
   * @param msgInfo authorLevel: 0
authorName: "妙龄黄花哥"
authorType: 3
avatarUrl: "//i1.hdslb.com/bfs/face/ecd7b13565bac4d2139cc2c1b411c62a26eae423.jpg@48w_48h"
content: "1121"
emoticon: null
id: "ac3b3787292d49b78c317be13d5ac4a3"
isGiftDanmaku: false
isMobileVerified: true
isNewbie: false
medalLevel: 0
privilegeType: 0
timestamp: 1653220745
translation: ""
   */
  microControlList = [] as any
  leftWord = '左'
  rightWord = '右'
  
}