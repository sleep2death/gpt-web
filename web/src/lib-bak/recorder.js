class IatRecorder extends EventTarget {
  constructor(url, worker) {
    super()
    let self = this

    this.status = 'null'
    this.url = url
    this.language = 'zh_cn'
    this.accent = 'mandarin'
    this.appId = import.meta.env.GPTW_XF_APP

    // 记录音频数据
    this.audioData = []
    // 记录听写结果
    this.resultText = ''
    // wpgs下的听写结果需要中间状态辅助记录
    this.resultTextTemp = ''

    this.worker = worker

    this.worker.onmessage = function(event) {
      self.audioData.push(...event.data)
    }
  }
  // 修改录音听写状态
  setStatus(status) {
    this.status = status
  }

  setResultText({ resultText, resultTextTemp } = {}) {
    const evt = new CustomEvent("data", { detail: (resultTextTemp || resultText || '') })
    this.dispatchEvent(evt)
    // this.onTextChange && this.onTextChange(resultTextTemp || resultText || '')
    resultText !== undefined && (this.resultText = resultText)
    resultTextTemp !== undefined && (this.resultTextTemp = resultTextTemp)
  }
  //
  // 连接websocket
  connectWebSocket() {
    let iatWS
    if ('WebSocket' in window) {
      iatWS = new WebSocket(this.url)
    } else if ('MozWebSocket' in window) {
      iatWS = new MozWebSocket(this.url)
    } else {
      const evt = new CustomEvent("error", { detail: "create websocket failed" })
      this.dispatchEvent(evt)
      return
    }
    this.webSocket = iatWS
    this.setStatus('init')
    iatWS.onopen = () => {
      this.setStatus('ing')
      // 重新开始录音
      setTimeout(() => {
        this.webSocketSend()
      }, 500)
    }
    iatWS.onmessage = e => {
      this.result(e.data)
    }
    iatWS.onerror = () => {
      this.recorderStop()
    }
    iatWS.onclose = () => {
      // this.recorderStop()
      const evt = new CustomEvent("close", { detail: "ws closed" })
      this.dispatchEvent(evt)
    }
    iatWS.onerror = e => {
      const evt = new CustomEvent("error", { detai: "ws on error" })
      this.dispatchEvent(evt)
    }
  }
  // 初始化浏览器录音
  recorderInit() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia

    // 创建音频环境
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.audioContext.resume()
      if (!this.audioContext) {
        const evt = new CustomEvent("error", { detai: "audiocontext creation failed" })
        this.dispatchEvent(evt)
        return
      }
    } catch (e) {
      if (!this.audioContext) {
        const evt = new CustomEvent("error", { detai: "audiocontext creation failed" })
        this.dispatchEvent(evt)
        return
      }
    }

    // 获取浏览器录音权限
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then(stream => {
          getMediaSuccess(stream)
        })
        .catch(e => {
          getMediaFail(e)
        })
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          audio: true,
          video: false,
        },
        stream => {
          getMediaSuccess(stream)
        },
        function(e) {
          getMediaFail(e)
        }
      )
    } else {
      if (navigator.userAgent.toLowerCase().match(/chrome/) && location.origin.indexOf('https://') < 0) {
        // alert('chrome下获取浏览器录音功能，因为安全性问题，需要在localhost或127.0.0.1或https下才能获取权限')
        const evt = new CustomEvent("error", { detai: "get media devices failed" })
        this.dispatchEvent(evt)
      } else {
        // alert('无法获取浏览器录音功能，请升级浏览器或使用chrome')
        const evt = new CustomEvent("error", { detai: "get media devices failed" })
        this.dispatchEvent(evt)
      }
      this.audioContext && this.audioContext.close()
      return
    }
    // 获取浏览器录音权限成功的回调
    let getMediaSuccess = stream => {
      // console.log('getMediaSuccess')
      this.stream = stream
      // 创建一个用于通过JavaScript直接处理音频
      this.scriptProcessor = this.audioContext.createScriptProcessor(0, 1, 1)

      this.scriptProcessor.onaudioprocess = e => {
        // 去处理音频数据
        if (this.status === 'ing') {
          this.worker.postMessage(e.inputBuffer.getChannelData(0))
        }
      }
      // 创建一个新的MediaStreamAudioSourceNode 对象，使来自MediaStream的音频可以被播放和操作
      this.mediaSource = this.audioContext.createMediaStreamSource(stream)
      // 连接
      this.mediaSource.connect(this.scriptProcessor)
      this.scriptProcessor.connect(this.audioContext.destination)
      this.connectWebSocket()
    }

    let getMediaFail = (e) => {
      // alert('请求麦克风失败')
      this.audioContext && this.audioContext.close()
      this.audioContext = undefined
      // 关闭websocket
      if (this.webSocket && this.webSocket.readyState === 1) {
        this.webSocket.close()
      }
      const evt = new CustomEvent("error", { detai: "get media devices failed" })
      this.dispatchEvent(evt)
    }
  }
  recorderStart() {
    if (!this.audioContext) {
      this.recorderInit()
    } else {
      this.audioContext.resume()
      this.connectWebSocket()
    }
  }
  // 暂停录音
  recorderStop() {
    // safari下suspend后再次resume录音内容将是空白，设置safari下不做suspend
    if (!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))) {
      this.audioContext && this.audioContext.close()
    }
    this.setStatus('end')
  }

  toBase64(buffer) {
    var binary = ''
    var bytes = new Uint8Array(buffer)
    var len = bytes.byteLength
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }
  // 向webSocket发送数据
  webSocketSend() {
    if (this.webSocket.readyState !== 1) {
      return
    }
    let audioData = this.audioData.splice(0, 1280)
    var params = {
      common: {
        app_id: this.appId,
      },
      business: {
        language: this.language, //小语种可在控制台--语音听写（流式）--方言/语种处添加试用
        domain: 'iat',
        accent: this.accent, //中文方言可在控制台--语音听写（流式）--方言/语种处添加试用
        vad_eos: 5000,
        dwa: 'wpgs', //为使该功能生效，需到控制台开通动态修正功能（该功能免费）
      },
      data: {
        status: 0,
        format: 'audio/L16;rate=16000',
        encoding: 'raw',
        audio: this.toBase64(audioData),
      },
    }
    this.webSocket.send(JSON.stringify(params))
    this.handlerInterval = setInterval(() => {
      // websocket未连接
      if (this.webSocket.readyState !== 1) {
        this.audioData = []
        clearInterval(this.handlerInterval)
        return
      }

      if (this.audioData.length === 0) {
        if (this.status === 'end') {
          this.webSocket.send(
            JSON.stringify({
              data: {
                status: 2,
                format: 'audio/L16;rate=16000',
                encoding: 'raw',
                audio: '',
              },
            })
          )
          this.audioData = []
          clearInterval(this.handlerInterval)
        }
        return false
      }
      audioData = this.audioData.splice(0, 1280)
      // 中间帧
      this.webSocket.send(
        JSON.stringify({
          data: {
            status: 1,
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
            audio: this.toBase64(audioData),
          },
        })
      )
    }, 40)
  }
  result(resultData) {
    // 识别结束
    let jsonData = JSON.parse(resultData)

    if (jsonData.data && jsonData.data.result) {
      let data = jsonData.data.result
      let str = ''
      let ws = data.ws
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w
      }
      // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
      // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
      if (data.pgs) {
        if (data.pgs === 'apd') {
          // 将resultTextTemp同步给resultText
          this.setResultText({
            resultText: this.resultTextTemp,
          })
        }
        // 将结果存储在resultTextTemp中
        this.setResultText({
          resultTextTemp: this.resultText + str,
        })
      } else {
        this.setResultText({
          resultText: this.resultText + str,
        })
      }
    }

    if (jsonData.code === 0 && jsonData.data.status === 2) {
      this.webSocket.close()
    }
    if (jsonData.code !== 0) {
      this.webSocket.close()

      const evt = new CustomEvent("error", { detail: `${jsonData.code}:${jsonData.message}` })
      this.dispatchEvent(evt)
    }
  }
  start() {
    this.recorderStart()
    this.setResultText({ resultText: '', resultTextTemp: '' })
  }

  stop() {
    if (this.stream) {
      this.stream
        .getTracks() // get all tracks from the MediaStream
        .forEach((track) => track.stop()); // stop each of them
    }

    this.recorderStop()
  }

  forceStop() {
    this.stop()
    this.webSocket.close()
  }
}

export default IatRecorder
