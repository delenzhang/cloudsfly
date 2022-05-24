const COMMAND_HEARTBEAT = 0
const COMMAND_JOIN_ROOM = 1
const COMMAND_ADD_TEXT = 2
const COMMAND_ADD_GIFT = 3
const COMMAND_ADD_MEMBER = 4
const COMMAND_ADD_SUPER_CHAT = 5
const COMMAND_DEL_SUPER_CHAT = 6
const COMMAND_UPDATE_TRANSLATION = 7
const RETRYCONNECTTIME = 5000

// const CONTENT_TYPE_TEXT = 0
const CONTENT_TYPE_EMOTICON = 1

const HEARTBEAT_INTERVAL = 10 * 1000
const RECEIVE_TIMEOUT = HEARTBEAT_INTERVAL + (5 * 1000)

export default class ChatClientRelay {
  constructor(roomId, autoTranslate) {
    this.roomId = roomId
    this.autoTranslate = autoTranslate

    this.onAddText = null
    this.onAddGift = null
    this.onAddMember = null
    this.onAddSuperChat = null
    this.onDelSuperChat = null
    this.onUpdateTranslation = null

    this.websocket = null
    this.retryCount = 0
    this.isDestroying = false
    this.heartbeatTimerId = null
    this.receiveTimeoutTimerId = null
  }

  start() {
    this.wsConnect()
  }

  stop() {
    this.isDestroying = true
    if (this.websocket) {
      this.websocket.close()
    }
  }

  wsConnect() {
    if (this.isDestroying) {
      return
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const url = `${protocol}://${window.location.host}/api/chat`
    // const url = `ws://139.186.162.52/api/chat`
    this.websocket = new WebSocket(url)
    this.websocket.onopen = this.onWsOpen.bind(this)
    this.websocket.onclose = this.onWsClose.bind(this)
    this.websocket.onmessage = this.onWsMessage.bind(this)
    this.websocket.addEventListener('error', function (event) {
      console.log('WebSocket error: ', event);
    });
  }
/**
 * fetch("ws://139.186.162.52/api/chat", {
  "headers": {
    "accept-language": "en,zh-CN;q=0.9,zh;q=0.8,en-US;q=0.7",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
    "sec-websocket-key": "HdMMp6iKPYXLThgfxZx2Gg==",
    "sec-websocket-version": "13",
    "cookie": "Hm_lvt_f2abfd5b32df11cbb5956d56bfe13b33=1652267854,1652948565,1653289400"
  },
  "body": null,
  "method": "GET"
});
 */
  onWsOpen() {
    this.retryCount = 0
    this.websocket.send(JSON.stringify({
      cmd: COMMAND_JOIN_ROOM,
      data: {
        roomId: this.roomId,
        config: {
          autoTranslate: this.autoTranslate
        }
      }
    }))
    this.heartbeatTimerId = window.setInterval(this.sendHeartbeat.bind(this), HEARTBEAT_INTERVAL)
    this.refreshReceiveTimeoutTimer()
  }

  sendHeartbeat() {
    this.websocket.send(JSON.stringify({
      cmd: COMMAND_HEARTBEAT
    }))
  }

  refreshReceiveTimeoutTimer() {
    if (this.receiveTimeoutTimerId) {
      window.clearTimeout(this.receiveTimeoutTimerId)
    }
    this.receiveTimeoutTimerId = window.setTimeout(this.onReceiveTimeout.bind(this), RECEIVE_TIMEOUT)
  }

  onReceiveTimeout() {
    console.warn('接收消息超时')
    this.receiveTimeoutTimerId = null

    // 直接丢弃阻塞的websocket，不等onclose回调了
    this.websocket.onopen = this.websocket.onclose = this.websocket.onmessage = null
    this.websocket.close()
    this.onWsClose()
  }

  onWsClose(event) {
    console.log("WebSocket is closed now.", event);
    this.websocket = null
    if (this.heartbeatTimerId) {
      window.clearInterval(this.heartbeatTimerId)
      this.heartbeatTimerId = null
    }
    if (this.receiveTimeoutTimerId) {
      window.clearTimeout(this.receiveTimeoutTimerId)
      this.receiveTimeoutTimerId = null
    }

    if (this.isDestroying) {
      return
    }
    console.warn(`掉线重连中${++this.retryCount}`)
    window.setTimeout(this.wsConnect.bind(this), RETRYCONNECTTIME)
  }

  onWsMessage(event) {
    this.refreshReceiveTimeoutTimer()

    let { cmd, data } = JSON.parse(event.data)
    switch (cmd) {
    case COMMAND_HEARTBEAT: {
      break
    }
    case COMMAND_ADD_TEXT: {
      if (!this.onAddText) {
        break
      }

      let emoticon = null
      let contentType = data[13]
      let contentTypeParams = data[14]
      if (contentType === CONTENT_TYPE_EMOTICON) {
        emoticon = contentTypeParams[0]
      }

      data = {
        avatarUrl: data[0],
        timestamp: data[1],
        authorName: data[2],
        authorType: data[3],
        content: data[4],
        privilegeType: data[5],
        isGiftDanmaku: Boolean(data[6]),
        authorLevel: data[7],
        isNewbie: Boolean(data[8]),
        isMobileVerified: Boolean(data[9]),
        medalLevel: data[10],
        id: data[11],
        translation: data[12],
        emoticon: emoticon
      }
      this.onAddText(data)
      break
    }
    case COMMAND_ADD_GIFT: {
      if (this.onAddGift) {
        this.onAddGift(data)
      }
      break
    }
    case COMMAND_ADD_MEMBER: {
      if (this.onAddMember) {
        this.onAddMember(data)
      }
      break
    }
    case COMMAND_ADD_SUPER_CHAT: {
      if (this.onAddSuperChat) {
        this.onAddSuperChat(data)
      }
      break
    }
    case COMMAND_DEL_SUPER_CHAT: {
      if (this.onDelSuperChat) {
        this.onDelSuperChat(data)
      }
      break
    }
    case COMMAND_UPDATE_TRANSLATION: {
      if (!this.onUpdateTranslation) {
        break
      }
      data = {
        id: data[0],
        translation: data[1]
      }
      this.onUpdateTranslation(data)
      break
    }
    }
  }
}
