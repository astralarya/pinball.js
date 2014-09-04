/*{{ javascript("jslib/draw2d.js") }}*/

TurbulenzEngine.onload = function onloadFn() {
  // allocate resources
  var intervalID;
  var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});

  var draw2D = Draw2D.create({
      graphicsDevice: graphicsDevice
  });

  var bgColor = [0.0, 0.0, 0.0, 1.0];

  var sprite = Draw2DSprite.create({
      width: 100,
      height: 100,
      x: graphicsDevice.width / 2,
      y: graphicsDevice.height / 2,
      color: [0.0, 1.0, 1.0, 1.0],
      rotation: Math.PI / 4
  });

  var PI2 = Math.PI * 2;
  var rotateAngle = PI2 / 360; // 1 deg per frame

  function tick() {
      sprite.rotation += rotateAngle;
      sprite.rotation %= PI2; // Wrap rotation at PI * 2

      if (graphicsDevice.beginFrame()) {
          graphicsDevice.clear(bgColor, 1.0);

          draw2D.begin();
          draw2D.drawSprite(sprite);
          draw2D.end();

          graphicsDevice.endFrame();
      }
  }


  intervalID = TurbulenzEngine.setInterval(tick, 1000/60);
};
