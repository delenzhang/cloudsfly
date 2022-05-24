
// const Cesium: any = window.Cesium;
// import * as Cesium from 'cesium'
window.CESIUM_BASE_URL = '/cloudsfly-lib/Cesium/';
import * as Cesium from 'cesium';
import { IPlaceObj } from '../../types'
import CONFIG from './Config'
import PlaneControl from './planeControl';
// import MouseControl from './mouseControl'
import "cesium/Build/Cesium/Widgets/widgets.css";
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYzdiNzI3Mi00YzhlLTQwYTQtOTE5OC05ZGVhOGI2MzQ0YjYiLCJpZCI6ODk2NTEsImlhdCI6MTY0OTg1MTg0OX0.5R9y9U5ex05rcqDcgRS73d-QTmSHCKhSOvh1p_pOZ1M';
const extent = Cesium.Rectangle.fromDegrees(113.31, 23.1,113.32, 23.2);

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;

let viewer: any


async function viewerFlyToDegree(place: IPlaceObj, height = CONFIG.viewerHeight, duration = 5) {
  Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
  let center = Cesium.Cartesian3.fromDegrees(
    place.gs84[1],
    place.gs84[0],
    height
  );
  return viewer.camera.flyTo({
    destination: center,
    // orientation: {
    //   heading : Cesium.Math.toRadians(0),
    //   pitch : Cesium.Math.toRadians(-60.0),
    //   roll : 0.0
    // },
    duration,
  });
}

export function initCesium(callback: Function) {
  if (viewer) {
    return
  }
  viewer=new Cesium.Viewer("cesiumContainer", {
    terrainProvider: Cesium.createWorldTerrain(),
    // terrainProvider : new Cesium.CesiumTerrainProvider({
    //     url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
    
    // }),
    
    // mapProjection : new Cesium.WebMercatorProjection(),
    scene3DOnly: true,
    selectionIndicator: false,
    baseLayerPicker: false,
    timeline: true,
    homeButton: false,
    navigationHelpButton: false,
    geocoder: false,
    //阴影
    shadows: true,
    shouldAnimate: true,
    // terrainExaggeration: 1.0, //地形夸大
      animation: false,
    
    })
  // Enable lighting based on sun/moon positions
  viewer.scene.globe.enableLighting = true;
  // 隐藏Logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
  //   let base1 = new Cesium.UrlTemplateImageryProvider({
  //     url:
  //       'https://p2.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=244',
  //     customTags: {
  //       sx: function(imageryProvider, x, y, level) {
  //         return x >> 4
  //       },
  //       sy: function(imageryProvider, x, y, level) {
  //         return ((1 << level) - y) >> 4
  //       }
  //     }
  //   })
  //  const tengxunmap1 = viewer.imageryLayers.addImageryProvider(base1)
  // 位置标注
    let base2 = new Cesium.UrlTemplateImageryProvider({
      url:
        'https://rt3.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=2&version=859'
    })
  
    const tengxunmap2 = viewer.imageryLayers.addImageryProvider(base2)
    // let base3 = new Cesium.UrlTemplateImageryProvider({
    //   url:
    //     'https://rtt2b.map.qq.com/rtt/?z={z}&x={x}&y={reverseY}&times=2&time=1631504424185'
    // })
    // tengxunmap3 = viewer.imageryLayers.addImageryProvider(base3)
  // GS84
  // viewer.camera.setView({
  //   destination : Cesium.Cartesian3.fromDegrees(
  //     CONFIG.points['gz'].gs84[1],
  //     CONFIG.points['gz'].gs84[0],
  //     CONFIG.godViewerHeight
  //   )});
  initPlane(CONFIG.points['gz'], callback);
  return
const flyToTime = 8 / 2
const holdViewTime = 3 / 2
setTimeout(() => {
  viewerFlyToDegree(CONFIG.points['gz'], CONFIG.viewerHeight, flyToTime).then((r2) => {
    console.log('>>>>>>> ', 3, r2)
    setTimeout(() => {
      // startFly(CONFIG.points['gz'], CONFIG.points['sh'])
      initPlane(CONFIG.points['gz']);
      // const eventControl = new MouseControl()
      // eventControl.init()
    }, flyToTime * 1000)
  })
}, holdViewTime * 1000)
  // setTimeout(() => {
  //   viewerFlyToDegree(CONFIG.points['gz'], CONFIG.godViewerHeight, 10).then((r1) => {
  //     console.log('>>>>>>> ', 1, r1)
      
  //     console.log('>>>>>>> ', 2)
  //   })
  // }, 2000)
   
}



function initPlane(startPoint: IPlaceObj, callback: Function) {
   const planeControl = new PlaneControl(viewer);
   planeControl.init(startPoint, callback) 
}