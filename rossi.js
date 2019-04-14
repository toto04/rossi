var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var height = 5;
var width = height * window.innerWidth/window.innerHeight
var ortho = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -1000, 10000);


var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
document.body.appendChild(renderer.domElement);

var render2 = new THREE.WebGLRenderer();
render2.setSize(window.innerWidth / 2, window.innerHeight / 2);
document.body.appendChild(render2.domElement);

var light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

var poly = polygon(6, 2)

scene.add(poly);
var vnh = new THREE.FaceNormalsHelper(poly, 1, 0xff0000 );
scene.add( vnh );

camera.position.z = 5;

var animate = function () {
  requestAnimationFrame(animate);

  poly.rotation.x += 0.01
  poly.rotation.y += 0.02;
  vnh.update()


  renderer.render(scene, camera);
  render2.render(scene, ortho);
};

animate();

function polygon(n, h) {
  var pGeom = new THREE.Geometry();
  var pMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: THREE.FaceColors
  });

  for (var i = 0; i < Math.PI; i+=Math.PI / n) {
    var a = i * 2;
    var x = Math.cos(a);
    var y = Math.sin(a);

    pGeom.vertices.push(new THREE.Vector3(x, y, 0));
    pGeom.vertices.push(new THREE.Vector3(x, y, h));
  }

  for (var i = 0; i < n; i++) {
    j = i * 2
    pGeom.faces.push(new THREE.Face3(j, j+3, j+1))
    pGeom.faces.push(new THREE.Face3(j, j+2, j+3))
  }

  for (var i = 0; i < n - 1; i++) {
    d = i * 2;
    u = d + 1
    var down = new THREE.Vector3(0, 0, -1)
    var up = new THREE.Vector3(0, 0, 1)
    pGeom.faces.push(new THREE.Face3(0, d + 2, d));
    pGeom.faces.push(new THREE.Face3(1, u, u + 2));
  }

  for (var i = 0; i < n; i++) {
    ind = i * 2
    c = new THREE.Color(Math.random() * 0xffffff)
    pGeom.faces[ind].color = c;
    pGeom.faces[ind+1].color = c;
  }
  c = new THREE.Color(Math.random() * 0xffffff)
  c2 = new THREE.Color(Math.random() * 0xffffff)
  for (var i = 0; i < n - 2; i++) {
    ind = i + n * 2;
    pGeom.faces[ind].color = c;
  }

  console.log(pGeom.faces);
  pGeom.computeFaceNormals();
  pGeom.computeVertexNormals();
  return new THREE.Mesh(pGeom, pMat)
}
