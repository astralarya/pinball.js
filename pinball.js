/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/texturemanager.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/effectmanager.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/scene.js") }}*/
/*{{ javascript("jslib/light.js") }}*/
/*{{ javascript("jslib/material.js") }}*/
/*{{ javascript("jslib/geometry.js") }}*/
/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/scenenode.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/

TurbulenzEngine.onload = function onloadFn() {
  function errorCallback(msg) {
    window.alert(msg);
  };

  // Engine devices
  var intervalID;
  var graphicsDeviceParameters = {};
  var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);
  var mathDeviceParameters = {};
  var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);
  var inputDeviceParameters = {};
  var inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);
  var physicsDeviceParameters = {};
  var physicsDevice = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);
  var dynamicsWorldParameters = {};
  var dynamicsWorld = physicsDevice.createDynamicsWorld(dynamicsWorldParameters);

  var requestHandlerParameters = {};
  var requestHandler = RequestHandler.create(requestHandlerParameters);
  var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
  var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
  var effectManager = EffectManager.create();

  var clearColor = mathDevice.v4Build(0.95, 0.95, 1.0, 1.0);
  if (graphicsDevice.beginFrame()) {
    graphicsDevice.clear(clearColor);
    graphicsDevice.endFrame();
  }

  var renderer;

  var scene = Scene.create(mathDevice);

  // Create a camera with a 60 degree FOV
  var camera = Camera.create(mathDevice);
  var halfFov = Math.tan(30 * Math.PI / 180);
  camera.recipViewWindowX = 1.0 / halfFov;
  camera.recipViewWindowY = 1.0 / halfFov;
  camera.updateProjectionMatrix();
  var worldUp = mathDevice.v3BuildYAxis();
  camera.lookAt(worldUp, worldUp, mathDevice.v3Build(0.0, 50.0, 200.0));
  camera.updateViewMatrix();

  // state
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
  function keyDown(key) {
    if (key === keyCodes.LEFT) {
      state.left = true;
    } else if (key === keyCodes.RIGHT) {
      state.right = true;
    }
  };
  inputDevice.addEventListener("keydown", keyDown);

  // Objects
  var boxShape = physicsDevice.createBoxShape({
    halfExtents : [0.5, 0.5, 0.5],
    margin : 0.001
  });

  var mass = 0;
  var inertia = boxShape.inertia;
  inertia = mathDevice.v3ScalarMul(inertia, mass);
  var boxBody = physicsDevice.createRigidBody({
    shape: boxShape,
    mass: mass,
    inertia: inertia,
    transform: mathDevice.m43BuildTranslation(0.0, 1.0, 0.0),
    friction: 0.5,
    restitution: 0.3,
    angularDamping: 0.9,
    frozen: false
  });

  function update() {
    // Update input
    inputDevice.update();

    // Resize
    var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
    if (aspectRatio !== camera.aspectRatio) {
      camera.aspectRatio = aspectRatio;
      camera.updateProjectionMatrix();
    }
    camera.updateViewProjectionMatrix();

    // Update scene
    if(state.left && !state.right) {
      // Go left
    } else if(state.right && !state.left) {
      // Go right
    }

    // Draw scene
    var vp = camera.viewProjectionMatrix;
    var transform = mathDevice.m43BuildIdentity();
    var wvp;
    if (graphicsDevice.beginFrame()) {
        graphicsDevice.clear(clearColor, 1.0, 0);

        graphicsDevice.endFrame();
    }
  }

  var AssetsRemaining = 0;
  function loadAssets() {
    // Put asset loading here
  };
  loadAssets();
  var loadingLoop = function loadingLoopFn() {
    if (AssetsRemaining === 0) {
      TurbulenzEngine.clearInterval(intervalID);
      intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
    }
  };
  intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

  // Create a scene destroy callback to run when the window is closed
  TurbulenzEngine.onunload = function() {
    TurbulenzEngine.clearInterval(intervalID);

    boxShape = null;
    boxBody = null;

    clearColor = null;

    requestHandler = null;

    if (scene) {
      scene.destroy();
      scene = null;
    }

    camera = null;
    effectManager = null;
    if (textureManager) {
      textureManager.destroy();
      textureManager = null;
    }
    if (shaderManager) {
      shaderManager.destroy();
      shaderManager = null;
    }

    TurbulenzEngine.flush();

    state = null;

    keyCodes = null;
    physicsDevice = null;
    dynamicsWorld = null;
    inputDevice = null;
    mathDevice = null;
    graphicsDevice = null;
  };
};
