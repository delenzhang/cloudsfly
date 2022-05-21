import * as Cesium from 'cesium';
import CONFIG from './Config'
import { IPlaceObj } from '../../types'

export default class PlaneControl {
  viewer: any
  position: any
  hpRoll: any
  dom: any
  speed = 0.4
  modelUrl = '/cloudsfly-lib/asserts/Cesium_Air.glb'
  constructor(viewer: any) {
    this.viewer = viewer
    this.dom = document.querySelector('.cesium-widget')?.children[0]
  }

  getPosition(time: any, result: any) {
    console.log(time, result, '>>>>')
    return this.position
  }
  getOrientation() {
    return Cesium.Transforms.headingPitchRollQuaternion(this.position, this.hpRoll)
  }
  init1(startPoint: IPlaceObj) {
    let radian = Cesium.Math.toRadians(2.0);
    let speedVector = new Cesium.Cartesian3();
    const viewer = this.viewer
    this.position = Cesium.Cartesian3.fromDegrees(startPoint.gs84[1], startPoint.gs84[0], CONFIG.viewerHeight)
    this.hpRoll = new Cesium.HeadingPitchRoll();
    // var orientation = Cesium.Transforms.headingPitchRollQuaternion(
    // position,
    // hpRoll
    // )
      // 添加模型
    let airplaneEntity = viewer.entities.add({
      id:'plane',
      position: new Cesium.CallbackProperty(this.getPosition, true),
      // 根据所提供的速度计算点
      // orientation: new Cesium.CallbackProperty(this.getOrientation, false),
      model: { uri: '/cloudsfly-lib/asserts/Cesium_Air.glb', minimumPixelSize: 80,}
    });
    console.log('>>> ', airplaneEntity, this.dom)
      viewer.trackedEntity = airplaneEntity;
    let flag = {
        moveUp:false,
        moveDown:false,
        moveLeft:false,
        moveRight:false
    }
    // 根据键盘按键返回标志
    function setFlagStatus(key: any,value: boolean) {
        switch (key.keyCode){
            case 37:
                // 左
                flag.moveLeft = value;
                break;
            case 38:
                // 上
                flag.moveUp = value;
                break;
            case 39:
                // 右
                flag.moveRight = value;
                break;
            case 40:
                flag.moveDown = value;
                // 下
                break;
        }
    }
    document.addEventListener('keydown',(e)=>{
      console.log(e.keyCode, 'keydown')
        setFlagStatus(e, true);
    });

    document.addEventListener('keyup',(e)=>{
        setFlagStatus(e, false);
    });
    var count = 0;
    viewer.clock.onTick.addEventListener(()=>{
        let hpRoll = this.hpRoll

        moveCar(1);
        if(flag.moveUp){
            if(flag.moveLeft){
                hpRoll.heading -= radian;
                count += 2;
            }
            if(flag.moveRight){
                hpRoll.heading += radian;
                count -= 2;
            }
        }else if(flag.moveDown){
            // if(flag.moveLeft){
            //     hpRoll.heading -= radian;
            //     count += 2;
            // }
            // if(flag.moveRight){
            //     hpRoll.heading += radian;
            //     count -= 2;
            // }
            // moveCar(-1);
        }else {
          if(flag.moveLeft){
                hpRoll.heading -= radian;
                count += 2;
            }
            if(flag.moveRight){
                hpRoll.heading += radian;
                count -= 2;
            } 
        }
    });
    // 移动小车
    const self = this
    function moveCar(isUP: Number) {
        // 计算速度矩阵
        if(isUP>0){
            speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, self.speed,speedVector);
        }else if(isUP<0){
            speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X,-self.speed,speedVector);
        }else{
          speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X,0,speedVector);
        }
        // 根据速度计算出下一个位置的坐标
        let fixedFrameTransforms =  Cesium.Transforms.localFrameToFixedFrameGenerator('east', 'north');
        let modelMatrix= Cesium.Transforms.headingPitchRollToFixedFrame(self.position,self.hpRoll, Cesium.Ellipsoid.WGS84,fixedFrameTransforms);
        self.position = Cesium.Matrix4.multiplyByPoint(modelMatrix ,speedVector, self.position);
    }
  }
  init (startPoint: IPlaceObj) {
    const viewer = this.viewer
    var scene = viewer.scene;
// 旋转角度
let radian = Cesium.Math.toRadians(3.0);
let rotateRadian = Cesium.Math.toRadians(0.5); 
// 移动速度
let speed = 4;

// 速度矢量
let speedVector = new Cesium.Cartesian3();
// 起始位置
let position = Cesium.Cartesian3.fromDegrees(startPoint.gs84[1], startPoint.gs84[0], CONFIG.viewerHeight);

// 用于设置模型方向
let hpRoll = new Cesium.HeadingPitchRoll();
let fixedFrameTransforms = Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');

let modelPrimitive = scene.primitives.add(Cesium.Model.fromGltf({
    url: this.modelUrl,
    modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransforms),
    minimumPixelSize: 128
}));
viewer.trackedEntity = modelPrimitive;

// 状态标志
let flag = {
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false
};

// 根据键盘按键返回标志
function setFlagStatus(key, value) {
    switch (key.keyCode) {
        case 37:
            // 左
            flag.moveLeft = value;
            break;
        case 38:
            // 上
            flag.moveUp = value;
            break;
        case 39:
            // 右
            flag.moveRight = value;
            break;
        case 40:
            flag.moveDown = value;
            // 下
            break;
    }
}

document.addEventListener('keydown', (e) => {
    setFlagStatus(e, true);
});

document.addEventListener('keyup', (e) => {
    setFlagStatus(e, false);
});
var count = 0;
viewer.clock.onTick.addEventListener((clock) => {

  if(flag.moveUp){
    if(flag.moveLeft){
        hpRoll.heading -= rotateRadian;
        // count += 2;
       
       
    } else if(flag.moveRight){
        hpRoll.heading += rotateRadian;
        // count -= 2;
        
    } else {
      if (hpRoll.roll > rotateRadian ) {
        hpRoll.roll -= rotateRadian
      }
      if (hpRoll.roll < -rotateRadian) {
        hpRoll.roll += rotateRadian
      }
    }
    
    
    moveCar(1);
}else if(flag.moveDown){
    // if(flag.moveLeft){
    //     hpRoll.heading -= radian ;
    //     count += 2;
    // }
    // if(flag.moveRight){
    //     hpRoll.heading += radian;
    //     count -= 2;
    // }
    // moveCar(-1);
}
  if(flag.moveLeft){
        hpRoll.heading -= rotateRadian;
       
        if (hpRoll.roll > Cesium.Math.toRadians(-45)) {
          hpRoll.roll -= rotateRadian;
        }
        // count += 2;
        moveCar(0)
    }
    if(flag.moveRight){
        hpRoll.heading += rotateRadian;
        if (hpRoll.roll < Cesium.Math.toRadians(45)) {
          hpRoll.roll += rotateRadian;
        }
        // count -= 2;
        moveCar(0)
    }
});

// 移动
function moveCar(isUP) {
    // 计算速度矩阵
    if (isUP > 0) {
        speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, speed, speedVector);
    } else {
        speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, -speed, speedVector);
    }
    // 根据速度计算出下一个位置的坐标
    position = Cesium.Matrix4.multiplyByPoint(modelPrimitive.modelMatrix, speedVector, position);
    // 模型移动
    Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransforms, modelPrimitive.modelMatrix);
    
    var cartesian3=new Cesium.Cartesian3(position.x,position.y,position.z);
            var cartographic=scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
            var lng=Cesium.Math.toDegrees(cartographic.longitude) +0.00001852398509*2*Math.cos((270+count)*2*Math.PI/360); 
            var lat=Cesium.Math.toDegrees(cartographic.latitude)  +0.00001852398509*2*Math.sin((270+count)*2*Math.PI/360);           
            var alt=cartographic.height + 10;
            // 获取指定经纬度的高程
            //这部分是想要获取高程来实现贴地，目前这一块还没完善，有需求的可以借鉴一下
            //var toH=new Cesium.Cartographic.fromDegrees(lng,lat)
            //var h2 = viewer.scene.sampleHeight(toH)
            // 更新相机位置（第一视角）
            // 上帝模式
            // viewer.camera.lookAt(position, new Cesium.HeadingPitchRange(hpRoll.heading, hpRoll.pitch + Cesium.Math.toRadians(-16.0), 200))
            
          //   viewer.camera.setView({
          //     orientation: {
          //         // heading : Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north)
          //         // pitch : Cesium.Math.toRadians(-90),    // default value (looking down)
          //         roll : hpRoll.roll                       // default value
          //     }
          // });
          console.log('>>> hpRoll.roll', hpRoll.roll)
          // 驾驶
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(lng,lat,alt),
                orientation:{
                  // 指向  镜头随小车变化角度
                  heading:hpRoll.heading,
                  // 视角固定
                  pitch:Cesium.Math.toRadians(-24.0),
                  roll: hpRoll.roll / 2
                }
              });
}
  }
}