var ctx = cnv.getContext('2d');

function cnvSetup() {
  return new Promise((resolve, reject) => {
    selfView.onloadedmetadata = evt => {
      var stream = cnv.captureStream(30);
      drawFrame();
      resolve(stream);
    };
    selfView.src = 'sintel.mp4';
  });
}
function drawFrame() {
  requestAnimationFrame(drawFrame);
  ctx.drawImage(selfView, 0, 0, 427, 240);
}

function webCamSetup() {
  return navigator.getUserMedia({ video: true, audio: true }).then(stream => {
    return stream;
  }).catch(ex => console.log('getUserMedia error.', ex));
}
var peer = new Peer({ key: 'ce16d9aa-4119-4097-a8a5-3a5016c6a81c', debug: 3 });

peer.on('open', id => {
  console.log('peer on "open"');
  myIdDisp.textContent = id;
  btnCanvasStart.onclick = evt => {
    cnvSetup().then(stream => {
      var call = peer.call(callTo.value, stream);
      callSetup(call);
    });
  }
  btnWebCamStart.onclick = evt => {
    webCamSetup().then(stream => {
      var call = peer.call(callTo.value, stream);
      callSetup(call);
    });
  }
});

peer.on('call', call => {
  console.log('peer on "call"');
  var stream = cnvSetup();
  call.answer(stream);
  callSetup(call);
  // var conn = peer.connect(callTo.value);
  // dcSetup(conn);
});

peer.on('connection', conn => {
  console.log('peer on "connection"');
  dcSetup(conn);
});

function callSetup(call) {
  call.on('stream', stream => {
    console.log('call on "stream"');
    remoteView.srcObject = stream;
  });
  call.on('close', _ => {
    console.log('call on "close"');
  });
}

function dcSetup(conn) {
  conn.on('data', function (data) {
    console.log('conn on "data"');
    console.log(data);
  });
  conn.on('open', _ => {
    console.log('conn on "open"');
    conn.send('hi!');
    btnStart.style.display = 'none';
  });
}

