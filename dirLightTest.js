var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 15, 35 );
var scene = new THREE.Scene();

dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( dirLight );

var material = new THREE.MeshPhongMaterial( {
  color: 0xff0000,
  shininess: 150,
  specular: 0x222222
} );

var geometry = new THREE.BoxGeometry( 3, 3, 3 );
cube = new THREE.Mesh( geometry, material );
cube.position.set( 5, 3, 5 );
cube.castShadow = true;
cube.receiveShadow = true;
scene.add( cube );

animate()

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
