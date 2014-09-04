/*{{ javascript("jslib/draw2d.js") }}*/

TurbulenzEngine.onload = function onloadFn() {
  // allocate resources
  var graphicsDeviceParameters = {};
  var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

  var inputDeviceParameters = {};
  var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

  // state
  var intervalID;
  var state = { left: false, right: false };

  // Input functions
  var keyCodes = inputDevice.keyCodes;
  function keyUp(key) {
    if (key === keyCodes.LEFT) {
      state.left = false;
    } else if (key === keyCodes.RIGHT) {
      state.right = false;
    }
  };
  inputDevice.addEventListener("keyup", keyUp);
  function keydown(key) {
    if (key === keyCodes.LEFT) {
      state.left = true;
    } else if (key === keyCodes.RIGHT) {
      state.right = true;
    }
  };
  inputDevice.addEventListener("keydown", keydown);

  // Draw scene
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
  var rotateAngle = PI2 / 60;

  function tick() {
    // Update input
    inputDevice.update();

    // Update scene
    if(state.left && !state.right) {
      sprite.rotation -= rotateAngle;
      sprite.rotation %= PI2; // Wrap rotation at PI * 2
    } else if(state.right && !state.left) {
      sprite.rotation += rotateAngle;
      sprite.rotation %= PI2; // Wrap rotation at 0
    }

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
