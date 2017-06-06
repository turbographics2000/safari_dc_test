var ctx = cnv.getContext('2d');

function cnvSetup() {
  var mPos = null;
  cnv.onmousedown = evt => {
    mPos = { x: evt.offsetX, y: evt.offsetY };
  }
  cnv.onmousemove = evt => {
    if (mPos) {
      ctx.beginPath();
      ctx.moveTo(mPos.x, mPos.y);
      ctx.lineTo(evt.offsetX, evt.offsetY);
      ctx.stroke();
      mPos = { x: evt.offsetX, y: evt.offsetY };
    }
  }
  cnv.onmouseup = evt => {
    mPos = null;
  }
  var stream = cnv.captureStream(30);
  return stream;
}

var peer = new Peer({ key: 'ce16d9aa-4119-4097-a8a5-3a5016c6a81c', debug: 3 });

peer.on('open', id => {
  console.log('peer on "open"');
  myIdDisp.textContent = id;
  btnStart.onclick = evt => {
    var stream = cnvSetup();
    var call = peer.call(callTo.value, stream);
    callSetup(call);
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

function dcSetup(conn){
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

function drawFrame() {
  requestAnimationFrame(drawFrame);
  ctx.drawImage(selfView, 0, 0);
}
drawFrame();
