var camera, scene, renderer, controls;
var geometry, material, cube, cylinder, sphere;
var spotlight, randomLight;
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();
var targetObject;

init();
render();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.set(0, 0, 5);
}

function render() {

    requestAnimationFrame( render );

    renderer.render( scene, camera );
    camera.lookAt(scene.position);
    cube.rotation.x += 0.01;
    update();
    renderer.shadowMap.enabled = true;

}

function addObjects(){

    var geometryPlane = new THREE.PlaneGeometry( 10, 10, 4, 4 );
    var materialPlane = new THREE.MeshPhongMaterial( {color:0x737373 , side: THREE.DoubleSide, roughness : 0.12, metalness: 0.65} );
    plane = new THREE.Mesh( geometryPlane, materialPlane );
    plane.position.set(0, -0.5, 0);
    plane.rotation.x = Math.PI / 2;
    scene.add( plane );

    var geometryCube = new THREE.BoxGeometry( 1, 1, 1 );
    var textureCube = new THREE.ImageUtils.loadTexture( 'texture/LIRKIS.jpg' );
    var materialCube = new THREE.MeshStandardMaterial( {
        map: textureCube,
        side: THREE.DoubleSide,
        roughness : 0.1,
        metalness: 0.92 } );
    cube = new THREE.Mesh( geometryCube, materialCube );
    cube.position.set(-1, 0, 0);
    scene.add( cube );

    var geometryCylinder = new THREE.CylinderGeometry( 0.5, 0.5, 1, 10 );
    var materialCylinder = new THREE.MeshLambertMaterial( {color: 'rgb(255,0,0)', side: THREE.DoubleSide} );
    cylinder = new THREE.Mesh( geometryCylinder, materialCylinder );
    cylinder.position.set(0, 0, 0);
    scene.add( cylinder );

    var geometrySphere = new THREE.SphereGeometry( 0.5, 10, 10 );
    var materialSphere = new THREE.MeshPhongMaterial( {color: 'rgb(0,0,255)', side: THREE.DoubleSide} );
    sphere = new THREE.Mesh( geometrySphere, materialSphere );
    sphere.position.set(1.5, 0, 0);
    scene.add( sphere );
}

function addLights(){

   /*var ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);*/

    var pointLight = new THREE.PointLight('rgb(255,255,255)',2, 100);
    pointLight.position.set( 0, 2, 0 );
    scene.add( pointLight );
    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    scene.add( pointLightHelper );
    sphere.add(pointLightHelper);


    /*var spotlight = new THREE.SpotLight('rgb(255,255,255)');
    spotlight.angle = Math.PI/6;
    spotlight.position.set(1 , 3 , 2);
    spotlight.intensity = 2;
    scene.add(spotlight);

    var spotLightHelper = new THREE.SpotLightHelper( spotlight );
    scene.add( spotLightHelper );

    var lightTarget = new THREE.Object3D();
    lightTarget.position.set(0,0,0);
    scene.add(lightTarget);
    spotlight.target = lightTarget;*/

 /*   var spotlight = new THREE.SpotLight('rgb(0,140,255)');
    spotlight.angle = Math.PI/6;
    spotlight.position.set(-2.5, 2, 2);
    spotlight.intensity = 2;*/

    randomLight = new THREE.SpotLight('rgb(255,0,0)');
    //spotlight.color = 1
    randomLight.position.set(5, 0, 0);
    randomLight.intensity = 10000;
    randomLight.distance = 10;
    randomLight.angle = Math.PI/2;
    randomLight.penumbra = 1;
    randomLight.decay = 0.2;
   /* randomLight.target = sphere;*/
    targetObject = new THREE.Object3D()
    scene.add(targetObject)
    targetObject.position.set(0,-1,0)
    scene.add(randomLight);
    randomLight.target = targetObject;
    spotlight = new THREE.SpotLight('rgb(0,140,255)');
    //spotlight.color = 1
    spotlight.position.set(-2.5, 2, 2);
    spotlight.intensity = 8;
    spotlight.distance = 1000000;
    spotlight.angle = Math.PI/6;
    spotlight.penumbra = 0.5;
    spotlight.decay = 2;
    scene.add(spotlight);
    var spotLightHelper = new THREE.SpotLightHelper( spotlight );
    scene.add( spotLightHelper );
/*
    var lightTarget = new THREE.Object3D();
    lightTarget.position.set(0,0,0);
    scene.add(lightTarget);
    spotlight.target = lightTarget;
*/

}

function update()
{

    var delta = clock.getDelta(); // seconds.
    var moveDistance = 2 * delta;

    if ( keyboard.pressed("W") )
        spotlight.translateZ( -moveDistance );
    if ( keyboard.pressed("S") )
        spotlight.translateZ(  moveDistance );
    if ( keyboard.pressed("Q") )
        spotlight.translateX( -moveDistance );
    if ( keyboard.pressed("E") )
        spotlight.translateX(  moveDistance );

    if ( keyboard.pressed("left") )
        sphere.position.x -= moveDistance;
    if ( keyboard.pressed("right") )
        sphere.position.x += moveDistance;
    if ( keyboard.pressed("up") )
        sphere.position.z -= moveDistance;
    if ( keyboard.pressed("down") )
        sphere.position.z += moveDistance;

    controls.update();
}
