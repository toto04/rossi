var scene, renderer, scene2
var camera, xOrtho, yOrtho, zOrtho
var light, dirLight, controls

window.addEventListener('load', () => {
  scene = new THREE.Scene();
  scene.background = 0xffffff

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  document.querySelector('canvas').width = window.innerWidth * window.devicePixelRatio
  document.querySelector('canvas').height = window.innerHeight * window.devicePixelRatio
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var height = 5;
  var width = height * window.innerWidth / window.innerHeight
  xOrtho = new THREE.OrthographicCamera(width / -2, 0, height / 2, 0, -10, 10000);
  yOrtho = new THREE.OrthographicCamera(width / -2, 0, height / 2, 0, -10, 10000);
  yOrtho.rotation.y = -Math.PI / 2
  yOrtho.position.z = width / 2
  zOrtho = new THREE.OrthographicCamera(width / -2, 0, height / 2, 0, -10, 10000);
  zOrtho.rotation.x = -Math.PI / 2
  zOrtho.position.z = height / 2

  camera = new THREE.OrthographicCamera(width / -2, 0, height / 2, 0, -10, 10000);
  camera.position.z = 1
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // var helper = new THREE.CameraHelper(zOrtho)
  // scene.add(helper)

  hex = new Piramid({
    faceNumber: 6,
    height: 1,
    pvDistance: 0.7,
    plDistance: 1,
    rotation: Math.PI / 1
  })
  scene.add(hex);

  tri = new Prism({
    faceNumber: 3000,
    height: 1.6,
    pvDistance: 1.8,
    plDistance: 2.2,
    rotation: 0,
    radius: 0.005
  })
  scene.add(tri)

  // ambientLight = new THREE.AmbientLight(0x777777);
  // scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-100, 100, 100)
  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = Math.pow(2, 12)
  dirLight.shadow.mapSize.height = Math.pow(2, 12)
  dirLight.shadow.bias = -0.0002

  dirLight.shadow.camera.near = 0
  dirLight.shadow.camera.far = 200

  // var alpha = Math.PI / 4;
  // var syx = 0,
  //   szx = 0.5 * Math.cos(alpha),
  //   sxy = 0,
  //   szy = -0.5 * Math.sin(alpha),
  //   sxz = 0,
  //   syz = 0;

  // var matrix = new THREE.Matrix4();
  // matrix.set(
  //   1, syx, szx, 0,
  //   sxy, 1, szy, 0,
  //   sxz, syz, 1, 0,
  //   0, 0, 0, 1);

  // scene.applyMatrix(matrix);

  scene.add(dirLight)

  addLines(hex)
  addLines(tri)
  addPlanes();
  dirLight.target = hex

  animate();
})

var animate = function() {
  requestAnimationFrame(animate);

  // camera.lookAt(new THREE.Vector3(0,0,0))
  controls.update()

  // camera.position.x = Math.cos(Date.now() * 0.0005) * 15
  // camera.position.z = Math.sin(Date.now() * 0.0005) * 15
  // camera.position.x = -15
  // camera.position.y = 15
  // xOrtho.position.x = Math.cos(Date.now() * 0.0005) * 5

  let v = new THREE.Vector2()
  renderer.getSize(v)
  let w = v.x / 2 * window.devicePixelRatio
  let h = v.y / 2 * window.devicePixelRatio

  renderer.clear()
  renderer.setViewport(0, h, w, h)
  renderer.render(scene, xOrtho);

  renderer.setViewport(w, h, w, h)
  renderer.render(scene, yOrtho);

  renderer.setViewport(0, 0, w, h)
  renderer.render(scene, zOrtho);

  // hex.axon()
  renderer.setViewport(w, 0, w, h)
  renderer.render(scene, camera)
  // hex.removeAxon()
};

class Piramid extends THREE.Mesh {
  constructor(settings) {
    var n = settings.faceNumber
    var d = 0
    if (settings.poDistance) d = settings.poDistance
    var h = settings.height + d
    var r = 0.5
    if (settings.radius) r = settings.radius

    var pGeom = new THREE.Geometry();
    var pMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      vertexColors: THREE.FaceColors
    });

    pGeom.vertices.push(new THREE.Vector3(0, h, 0));
    for (var i = 0; i < Math.PI; i += Math.PI / n) {
      const a = i * 2 + settings.rotation;
      var x = Math.cos(a) * r;
      var y = Math.sin(a) * r;

      pGeom.vertices.push(new THREE.Vector3(x, d, y));
    }

    for (var i = 1; i < n; i++) {
      // Crea i lati
      pGeom.faces.push(new THREE.Face3(0, i + 1, i))
    }
    pGeom.faces.push(new THREE.Face3(0, 1, n))

    for (var i = 2; i < n; i++) {
      // Crea la base
      var d = i;
      pGeom.faces.push(new THREE.Face3(1, d + 2, d));
    }

    // Colora i lati
    for (var face of pGeom.faces) {
      face.color = new THREE.Color(Math.random() * 0xffffff)
    }

    pGeom.computeFaceNormals();
    pGeom.computeVertexNormals();

    var max = 0,
      min = 0
    for (var i = 0; i < pGeom.vertices.length; i++) {
      if (pGeom.vertices[i].z < min) {
        min = pGeom.vertices[i].z
      }
      if (pGeom.vertices[i].x > max) {
        max = pGeom.vertices[i].x
      }
    }

    // Ora che tutto lo schifo è stato preparato viene chiamato il super
    super(pGeom, pMat)
    this.position.x = -settings.plDistance - max
    this.position.z = +settings.pvDistance - min
    this.castShadow = true;
    this.receiveShadow = true;
    this._axonometricMode = false;
  }

  axon() {
    // http://jsfiddle.net/420erjgf/
    if (!this._axonometricMode) {
      var alpha = Math.PI / 4;
      var syx = 0,
        szx = 0.5 * Math.cos(alpha),
        sxy = 0,
        szy = -0.5 * Math.sin(alpha),
        sxz = 0,
        syz = 0;

      var matrix = new THREE.Matrix4();
      matrix.set(
        1, syx, szx, 0,
        sxy, 1, szy, 0,
        sxz, syz, 1, 0,
        0, 0, 0, 1);

      this.geometry.applyMatrix(matrix);
      this._axonometricMode = true;
    } else {
      console.warn("Already in axonometric mode! Call removeAxon() method first")
    }
  }

  removeAxon() {
    if (this._axonometricMode) {
      var alpha = Math.PI / 4;
      var syx = 0,
        szx = 0.5 * Math.cos(alpha),
        sxy = 0,
        szy = -0.5 * Math.sin(alpha),
        sxz = 0,
        syz = 0;
      5

      var matrix = new THREE.Matrix4();
      matrix.set(
        1, -syx, -szx, 0,
        -sxy, 1, -szy, 0,
        -sxz, -syz, 1, 0,
        0, 0, 0, 1);

      this.geometry.applyMatrix(matrix);
      this._axonometricMode = false;
    } else {
      console.warn("Not in axonometric mode! Call axon() method first")
    }
  }
}

class Prism extends THREE.Mesh {
  constructor(settings) {
    var n = settings.faceNumber
    var d = 0
    if (settings.poDistance) d = settings.poDistance
    var h = settings.height + d
    var r = 0.5
    if (settings.radius) r = settings.radius

    var pGeom = new THREE.Geometry();
    var pMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      vertexColors: THREE.FaceColors
    });

    for (var i = 0; i < Math.PI; i += Math.PI / n) {
      const a = i * 2 + settings.rotation;
      var x = Math.cos(a) * r;
      var y = Math.sin(a) * r;

      pGeom.vertices.push(new THREE.Vector3(x, d, y));
      pGeom.vertices.push(new THREE.Vector3(x, h, y));
    }

    for (var i = 0; i < n - 1; i++) {
      // Crea i lati
      var j = i * 2
      pGeom.faces.push(new THREE.Face3(j, j + 1, j + 3))
      pGeom.faces.push(new THREE.Face3(j, j + 3, j + 2))
    }
    // Crea l'ultimo lato
    j = (n - 1) * 2
    pGeom.faces.push(new THREE.Face3(j, j + 1, 1))
    pGeom.faces.push(new THREE.Face3(j, 1, 0))

    for (var i = 0; i < n - 1; i++) {
      // Crea le basi
      var d = i * 2;
      var u = d + 1
      pGeom.faces.push(new THREE.Face3(0, d, d + 2));
      pGeom.faces.push(new THREE.Face3(1, u + 2, u));
    }

    // Colora i lati
    for (var i = 0; i < n; i++) {
      var ind = i * 2
      var c = new THREE.Color(Math.random() * 0xffffff)
      pGeom.faces[ind].color = c;
      pGeom.faces[ind + 1].color = c;
    }
    // Colora le basi
    var c = new THREE.Color(Math.random() * 0xffffff)
    var c2 = new THREE.Color(Math.random() * 0xffffff)
    for (var i = 0; i < n - 1; i++) {
      ind = (i + n) * 2;
      pGeom.faces[ind].color = c;
      pGeom.faces[ind + 1].color = c2
    }
    pGeom.computeFaceNormals();
    pGeom.computeVertexNormals();

    var max = 0,
      min = 0
    for (var i = 0; i < pGeom.vertices.length; i++) {
      if (pGeom.vertices[i].z < min) {
        min = pGeom.vertices[i].z
      }
      if (pGeom.vertices[i].x > max) {
        max = pGeom.vertices[i].x
      }
    }

    // Ora che tutto lo schifo è stato preparato viene chiamato il super
    super(pGeom, pMat)
    this.position.x = -settings.plDistance - max
    this.position.z = +settings.pvDistance - min
    this.castShadow = true;
    this.receiveShadow = true;
    this._axonometricMode = false;
  }

  axon() {
    // http://jsfiddle.net/420erjgf/
    if (!this._axonometricMode) {
      var alpha = Math.PI / 4;
      var syx = 0,
        szx = 0.5 * Math.cos(alpha),
        sxy = 0,
        szy = -0.5 * Math.sin(alpha),
        sxz = 0,
        syz = 0;

      var matrix = new THREE.Matrix4();
      matrix.set(
        1, syx, szx, 0,
        sxy, 1, szy, 0,
        sxz, syz, 1, 0,
        0, 0, 0, 1);

      this.geometry.applyMatrix(matrix);
      this._axonometricMode = true;
    } else {
      console.warn("Already in axonometric mode! Call removeAxon() method first")
    }
  }

  removeAxon() {
    if (this._axonometricMode) {
      var alpha = Math.PI / 4;
      var syx = 0,
        szx = 0.5 * Math.cos(alpha),
        sxy = 0,
        szy = -0.5 * Math.sin(alpha),
        sxz = 0,
        syz = 0;
      5

      var matrix = new THREE.Matrix4();
      matrix.set(
        1, -syx, -szx, 0,
        -sxy, 1, -szy, 0,
        -sxz, -syz, 1, 0,
        0, 0, 0, 1);

      this.geometry.applyMatrix(matrix);
      this._axonometricMode = false;
    } else {
      console.warn("Not in axonometric mode! Call axon() method first")
    }
  }
}

function addLines(poligon) {
  poligon.geometry.vertices.forEach(vec => {
    v = vec.clone()
    v.add(poligon.position)
    var m = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2
    })
    var lineGeom = new THREE.Geometry();
    lineGeom.vertices.push(v)
    lineGeom.vertices.push(new THREE.Vector3(0, v.y, v.z))
    scene.add(new THREE.Line(lineGeom, m))
    lineGeom = new THREE.Geometry();
    lineGeom.vertices.push(v)
    lineGeom.vertices.push(new THREE.Vector3(v.x, 0, v.z))
    scene.add(new THREE.Line(lineGeom, m))
    lineGeom = new THREE.Geometry();
    lineGeom.vertices.push(v)
    lineGeom.vertices.push(new THREE.Vector3(v.x, v.y, 0))
    scene.add(new THREE.Line(lineGeom, m))
  })
}

function addPlanes() {
  planes = []
  geom = new THREE.PlaneGeometry(100, 100);

  mat = new THREE.MeshToonMaterial({
    color: 0xf070a2,
    side: THREE.DoubleSide
  })
  plane = new THREE.Mesh(geom, mat)
  plane.position.x = -50;
  plane.position.y = 50;
  planes.push(plane)

  mat = new THREE.MeshToonMaterial({
    color: 0xa2f070,
    side: THREE.DoubleSide
  })
  plane = new THREE.Mesh(geom, mat)
  plane.rotation.x = Math.PI / 2
  plane.position.x = -50;
  plane.position.z = 50;
  planes.push(plane)

  mat = new THREE.MeshToonMaterial({
    color: 0x70a2f0,
    side: THREE.DoubleSide
  })
  plane = new THREE.Mesh(geom, mat)
  plane.rotation.y = Math.PI / 2
  plane.position.y = 50;
  plane.position.z = 50;
  planes.push(plane)

  planes.forEach(plane => {
    plane.receiveShadow = true
    scene.add(plane)
  })
}
