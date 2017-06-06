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

var peer = new Peer({ key: 'ce16d9aa-4119-4097-a8a5-3a5016c6a81c' });
peer.on('open', id => {
  myIdDisp.textContent = id;
});
peer.on('connection', conn => {
  conn.on('data', function (data) {
    console.log(data);
  });
});
peer.on('call', call => {
  call.on('stream', stream => {
    vid.srcObject = stream;
  });
});

btnStart.onclick = evt => {
  var conn = peer.connect(callTo.value);
  conn.on('open', _ => {
    conn.send('hi!');
    var stream = cnvSetup();
    peer.call(stream);
    btnStart.style.display = 'none';
  });
}
