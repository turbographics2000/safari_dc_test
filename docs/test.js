function cnvSetup() {
  var ctx = cnv.getContext('2d');
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
  myIdDisp.textContent = id;
  btnStart.onclick = evt => {
    var stream = cnvSetup();
    peer.call(callTo.value, stream);
  }
});
peer.on('connection', conn => {
  dcSetup(conn);
});
peer.on('call', call => {
  call.on('stream', stream => {
    remoteView.srcObject = stream;
  });
  var conn = peer.connect(callTo.value);
  dcSetup(conn);
});

function dcSetup(conn){
  conn.on('data', function (data) {
    console.log(data);
  });
  conn.on('open', _ => {
    conn.send('hi!');
    btnStart.style.display = 'none';
  });
}