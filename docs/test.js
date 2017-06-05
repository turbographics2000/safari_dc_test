let apiKey = 'ce16d9aa-4119-4097-a8a5-3a5016c6a81c';
let token = Math.random().toString(36).substr(2);
let pc, socket, dstId, o2j = JSON.stringify, j2o = JSON.parse;
btnStart.onclick = _ => {
  dstId = callTo.value.trim();
  start(true);

fetch(`https://skyway.io/${apiKey}/id?ts=${Date.now()}${Math.random()}`)
  .then(res => res.text()).then(myId => {
    myIdDisp.textContent = myId;
    socket = new WebSocket(`wss://skyway.io/peerjs?key=${apiKey}&id=${myId}&token=${token}`);
    socket.onmessage = evt => {
      const msg = j2o(evt.data);
      if (msg.src && !pc) start();
      msg.ans && pc.setRemoteDescription(new RTCSessionDescription(msg.ans));
      msg.ofr && pc.setRemoteDescription(new RTCSessionDescription(msg.ofr))
        .then(_ => pc.createAnswer())
        .then(answer => pc.setLocalDescription(answer))
        .then(_ => socket.send(o2j({ type: 'ANSWER', ans: pc.localDescription, dst: msg.src })))
        .catch(e => console.log('set remote offer error', e));
      msg.cnd && pc.addIceCandidate(new RTCIceCandidate(msg.cnd));
      msg.type === 'PING' && socket.send(o2j({ type: 'PONG' }));
    };
    socket.onclose = evt => console.log(`socket close: code=${evt.code}`);
  });

function start(isAlice) {
  pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.skyway.io:3478' }] });
  pc.onicecandidate = evt => socket.send(o2j({ type: 'CANDIDATE', cnd: evt.candidate, dst: dstId }));
  pc.onnegotiationneeded = evt => {
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(_ => socket.send(o2j({ type: 'OFFER', ofr: pc.localDescription, dst: dstId })))
      .catch(e => console.log('create offer error', e));
  }
  //   navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
  //       selfView.srcObject = stream;
  //       pc.addTrack ? stream.getTracks().map(trk => pc.addTrack(trk, stream)) : pc.addStream(stream);
  //   }).catch(e => console.log(`${e.name}: ${e.message}`));
  //   pc.onaddstream = evt => remoteView.srcObject = evt.stream;
  if(isAlice) {
    var dc = pc.createDataChannel('test');
    dcEventSetup(evt.channel);
  } else {
    pc.ondatachannel = evt => {
      dcEventSetup(evt.channel);
    }
  }
}

function dcEventSetup(dc) {
  dc.onopen = _ => {
    console.log('dc open');
    dc.send('hello');
  }
  dc.onmessage = evt => {
    var div = document.createElement('div');
    div.textContent = evt.data;
    msgContainer.appendChild(div);
  }
}