var camera, scene, renderer, controls;
var geometry, material, cube, sphere;
var spotlight;
var clock = new THREE.Clock();
//var keyboard = new THREEx.KeyboardState();
/*var curve = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( -5,1,5 ),
    new THREE.Vector3( 5,1,5 ),
    new THREE.Vector3( 5,1,-5 ),
    new THREE.Vector3( -5,1,-5 ),
], true );
var points = curve.getPoints( 6 );
var geometry = new THREE.BufferGeometry().setFromPoints( points );
var material = new THREE.LineBasicMaterial( { color : 0xff0000 });
var curveObject = new THREE.Line( geometry, material );*/
/*var PosIndex = 0;

//var progressController;*/


init();
render();

function init() {

    gui = new dat.GUI();
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.set(3, 1.3, 1);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    addObjects();
    addLights();

    controls = new THREE.OrbitControls( camera, renderer.domElement );

}

function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    camera.lookAt(scene.position);
    //scene.add(curveObject);
    checkPetting();
    if(isPetting === false){
        petCooldown = 100;
    }
    update();
    renderer.shadowMap.enabled = true;
}

function addObjects(){

    var floorTexture = new THREE.ImageUtils.loadTexture( 'texture/floor.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 10, 10 );

    var geometryPlane = new THREE.PlaneGeometry( 20, 20, 4, 4 );
    var materialPlane = new THREE.MeshStandardMaterial( {
        map: floorTexture,
        side: THREE.DoubleSide,
        roughness : 0.12,
        metalness: 0.45} );
    plane = new THREE.Mesh( geometryPlane, materialPlane );
    plane.position.set(0, 0.2, 0);
    plane.rotation.x = Math.PI / 2;
    scene.add( plane );

    var geometrySphere = new THREE.SphereGeometry( 100, 100, 100 );
    var sphereTexture = new THREE.ImageUtils.loadTexture( 'texture/cityy.jpg' );
    var materialSphere = new THREE.MeshBasicMaterial( {map: sphereTexture, transparent: true, side: THREE.DoubleSide} );
    sphere = new THREE.Mesh( geometrySphere, materialSphere );
    sphere.position.set(0, 0, 0);
    scene.add( sphere );
    scene.add(cursor);
    createCat();
}

function addLights(){
    var ambientLight = new THREE.AmbientLight(0x7F7F7F);
    scene.add(ambientLight);

    spotlight = new THREE.SpotLight('rgb(255,255,255)');
    spotlight.angle = Math.PI;
    spotlight.position.set(0, 4, 2);
    spotlight.intensity = 2;
    spotlight.castShadow = true;
    scene.add(spotlight);
    spotlight.penumbra = 1;
    var spotLightHelper = new THREE.SpotLightHelper( spotlight );
    scene.add( spotLightHelper );
}

function update()
{
    updateEyesAndCursor();
    controls.update();
    updateStats();
}