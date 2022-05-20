/// <reference types="vite/client" />
declare global {
  interface Window {
    Cesium: string;
  }
}

declare interface Window {
  Cesium: any
  CESIUM_BASE_URL: string
}