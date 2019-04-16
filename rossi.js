var scene, renderer
var camera, xOrtho, yOrtho, zOrtho
var light, dirLight

window.addEventListener('load', () => {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  var height = 5;
  var width = height * window.innerWidth/window.innerHeight
  xOrtho = new THREE.OrthographicCamera(width / -2, 0, height / 2, 0, -10, 10000);
  yOrtho = new THREE.OrthographicCamera(width / -2, 0, height / 2, 0, -10, 10000);
  yOrtho.rotation.y = - Math.PI / 2
  yOrtho.position.z = width/2
  zOrtho = new THREE.OrthographicCamera(width / -2, 0, height / 2, 0, -10, 10000);
  zOrtho.rotation.x = - Math.PI / 2
  zOrtho.position.z = height/2

  // var helper = new THREE.CameraHelper(zOrtho)
  // scene.add(helper)

  ambientLight = new THREE.AmbientLight(0x777777);
  scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xffffff,1);
  dirLight.position.set(-100, 100, 100)
  dirLight.castShadow = true;

  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 1000;
  dirLight.shadow.camera.right = 15;
  dirLight.shadow.camera.left = - 15;
  dirLight.shadow.camera.top	= 15;
  dirLight.shadow.camera.bottom = - 15;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;

  scene.add(dirLight)
  scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );


  // dirLightShadowMapViewer = new THREE.ShadowMapViewer( dirLight );
  // dirLightShadowMapViewer.position.x = 10;
  // dirLightShadowMapViewer.position.y = 10;
  // dirLightShadowMapViewer.size.width = 256;
  // dirLightShadowMapViewer.size.height = 256;
  // dirLightShadowMapViewer.update(); //Required when setting position or size directly


  var lightHelper = new THREE.DirectionalLightHelper(dirLight);
  scene.add(lightHelper)

  addPlanes();
  prism = prism(3, 2)
  prism.position.x = -1
  prism.position.z = 1
  prism.castShadow = true;
  prism.receiveShadow = true;

  // dirLight.target = prism

  // for (vertex of prism.geometry.vertices) {
  //   if (!vertex) {
  //     console.log("vaba");
  //   }
  // }

  scene.add(prism);

  animate();
})

var animate = function () {
  requestAnimationFrame(animate);

  camera.lookAt(prism.position)

  // camera.position.x = Math.cos(Date.now() * 0.0005) * 5
  // camera.position.z = 15
  // camera.position.x = -15
  // camera.position.y = 15
  // xOrtho.position.x = Math.cos(Date.now() * 0.0005) * 5

  renderer.clear()
  renderer.setViewport(0, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2)
  renderer.render(scene, xOrtho);

  renderer.setViewport(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2)
  renderer.render(scene, yOrtho);

  renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight / 2)
  renderer.render(scene, zOrtho);

  renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window. innerHeight / 2)
  renderer.render(scene, dirLight.shadow.camera)
};

function prism(n, h) {
  var pGeom = new THREE.Geometry();
  var pMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: THREE.FaceColors
  });

  for (var i = 0; i < Math.PI; i+=Math.PI / n) {
    var a = i * 2;
    var x = Math.cos(a) * 0.5;
    var y = Math.sin(a) * 0.5;

    pGeom.vertices.push(new THREE.Vector3(x, 0, y));
    pGeom.vertices.push(new THREE.Vector3(x, h, y));
  }

  for (var i = 0; i < n; i++) {
    // Crea i lati
    j = i * 2
    pGeom.faces.push(new THREE.Face3(j, j+1, j+3))
    pGeom.faces.push(new THREE.Face3(j, j+3, j+2))
  }

  for (var i = 0; i < n - 1; i++) {
    // Crea le basi
    d = i * 2;
    u = d + 1
    pGeom.faces.push(new THREE.Face3(0, d, d + 2));
    pGeom.faces.push(new THREE.Face3(1, u + 2, u));
  }

  // Colora i lati
  for (var i = 0; i < n; i++) {
    ind = i * 2
    c = new THREE.Color(Math.random() * 0xffffff)
    pGeom.faces[ind].color = c;
    pGeom.faces[ind+1].color = c;
  }
  // Colora le basi
  c = new THREE.Color(Math.random() * 0xffffff)
  c2 = new THREE.Color(Math.random() * 0xffffff)
  for (var i = 0; i < n - 1; i++) {
    ind = (i + n) * 2;
    pGeom.faces[ind].color = c;
    pGeom.faces[ind + 1].color = c2
  }

  // pGeom.computeFaceNormals();
  // pGeom.computeVertexNormals();
  return new THREE.Mesh(pGeom, pMat)
}

function addPlanes() {
  mat = new THREE.MeshStandardMaterial({
    color: 0xffffff
  })

  planes = []

  geom = new THREE.Geometry();
  geom.vertices.push(new THREE.Vector3(0, 0, 0))
  geom.vertices.push(new THREE.Vector3(0, 0, 100))
  geom.vertices.push(new THREE.Vector3(-100, 0, 0))
  geom.vertices.push(new THREE.Vector3(-100, 0, 100))

  geom.faces.push(new THREE.Face3(0, 2, 1))
  geom.faces.push(new THREE.Face3(0, 2, 3))

  planes.push(new THREE.Mesh(geom, mat))

  geom = new THREE.Geometry();
  geom.vertices.push(new THREE.Vector3(0, 0, 0))
  geom.vertices.push(new THREE.Vector3(0, 100, 0))
  geom.vertices.push(new THREE.Vector3(-100, 0, 0))
  geom.vertices.push(new THREE.Vector3(-100, 100, 0))

  geom.faces.push(new THREE.Face3(0, 1, 2))
  geom.faces.push(new THREE.Face3(0, 2, 3))

  planes.push(new THREE.Mesh(geom, mat))

  geom = new THREE.Geometry();
  geom.vertices.push(new THREE.Vector3(0, 0, 0))
  geom.vertices.push(new THREE.Vector3(0, 0, 100))
  geom.vertices.push(new THREE.Vector3(0, 100, 0))
  geom.vertices.push(new THREE.Vector3(0, 100, 100))

  geom.faces.push(new THREE.Face3(0, 1, 2))
  geom.faces.push(new THREE.Face3(0, 3, 2))

  planes.push(new THREE.Mesh(geom, mat))

  geom = new THREE.Geometry()
  geom.vertices = [
    new THREE.Vector3(-100, 0, 0),
    new THREE.Vector3(-0, 0, 0),
    new THREE.Vector3(-0, 100, 0),
    new THREE.Vector3(-0, 0, 0),
    new THREE.Vector3(-0, 0, 100)
  ]

  axis = new THREE.Line(geom, new THREE.LineBasicMaterial({color: 0x000000, linewidth: 1}))

  for (var i = 0; i < planes.length; i++) {
    planes[i].receiveShadows = true;
    scene.add(planes[i])
  }
  scene.add(axis)
}
