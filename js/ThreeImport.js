var camera, scene, renderer, controls;
var geometry, material, cube, cylinder, sphere;
var objcar;
var spotlight;
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();
var objectcar;
var curve = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( -5,1,5 ),
    new THREE.Vector3( 5,1,5 ),
    new THREE.Vector3( 5,1,-5 ),
    new THREE.Vector3( -5,1,-5 ),
], true );
var points = curve.getPoints( 6 );
var geometry = new THREE.BufferGeometry().setFromPoints( points );
var material = new THREE.LineBasicMaterial( { color : 0xff0000 });
var curveObject = new THREE.Line( geometry, material );
var PosIndex = 0;


init();
render();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.set(0, 0, 5);

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

    scene.add(curveObject);

    PosIndex++;
    if (PosIndex > 10000) { PosIndex = 0;}
    var camPos = curve.getPoint(PosIndex / 1000);
    var camRot = curve.getTangent(PosIndex / 1000);
    spotlight.position.x = camPos.x;
    spotlight.position.y = camPos.y+2;
    spotlight.position.z = camPos.z;
    spotlight.rotation.x = camRot.x;
    spotlight.rotation.y = camRot.y;
    spotlight.rotation.z = camRot.z;
    spotlight.lookAt(curve.getPoint((PosIndex+1) / 1000));

    

    objectcar.position.x = camPos.x;
    objectcar.position.y = camPos.y;
    objectcar.position.z = camPos.z;
    objectcar.rotation.x = camRot.x;
    objectcar.rotation.y = camRot.y;
    objectcar.rotation.z = camRot.z;
    objectcar.lookAt(curve.getPoint((PosIndex+5) / 1000));

    objcar.position.x = camPos.x;
    objcar.position.y = camPos.y;
    objcar.position.z = camPos.z;
    objcar.rotation.x = camRot.x;
    objcar.rotation.y = camRot.y;
    objcar.rotation.z = camRot.z;
    objcar.lookAt(curve.getPoint((PosIndex+1) / 1000));

    update();
    renderer.shadowMap.enabled = true;

    //Pridanie fragmentu pre animovanie krivky


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
    plane.position.set(0, -0.5, 0);
    plane.rotation.x = Math.PI / 2;
    scene.add( plane );

    var geometrySphere = new THREE.SphereGeometry( 100, 100, 100 );
    var sphereTexture = new THREE.ImageUtils.loadTexture( 'texture/room.jpg' );
    var materialSphere = new THREE.MeshBasicMaterial( {map: sphereTexture, transparent: true, side: THREE.DoubleSide} );
    sphere = new THREE.Mesh( geometrySphere, materialSphere );
    sphere.position.set(0, 0, 0);
    scene.add( sphere );

    loadOBJectsStandard( 2,-0.5,0,
        'models/car/Pony_cartoon.obj',
        0.003,0.003,0.003,
        "models/car/Body_dDo_d_orange.jpg",
        "white"
    );

    loadOBJectsPhong( -2,-0.5,0,
        'models/car/Pony_cartoon.obj',
        0.003,0.003,0.003,
        "models/car/Body_dDo_d_orange.jpg",
        "white");

    loadObjWithMTL("models/lirkis_car/lirkis_car.obj",
        "models/lirkis_car/lirkis_car.mtl",
        0.5,0.5,0.5,
        0,-0.2,0);

    createCat();


    // var geometryCube = new THREE.BoxGeometry( 1, 1, 1 );
    // var cubeTexture = new THREE.ImageUtils.loadTexture(
    //     'texture/lirkis.jpg' );
    // var materialCube = new THREE.MeshBasicMaterial( {
    //     map: cubeTexture,
    //     side: THREE.DoubleSide} );
    // cube = new THREE.Mesh( geometryCube, materialCube );
    // cube.position.set(0, 0, 0);
    // scene.add( cube );

    //Pridanie fragmentu pre objekt kocky




    //Pridanie fragmentu pre nacitanie modelov

}

function addLights(){

    //var ambientLight = new THREE.AmbientLight(0x7F7F7F);
    //scene.add(ambientLight);

    spotlight = new THREE.SpotLight('rgb(255,255,255)');
    spotlight.angle = Math.PI/1;
    spotlight.position.set(0, 4, 2);spotlight.intensity = 0.5;
    spotlight.castShadow = true;
    scene.add(spotlight);
    spotlight.penumbra = 1;
    var spotLightHelper = new THREE.SpotLightHelper( spotlight );
    scene.add( spotLightHelper );


}

function update()
{
    controls.update();
}

function loadOBJectsStandard(x,y,z, path, scalex, scaley, scalez,
                             texturePath, colorMaterial){
    var loader = new THREE.OBJLoader();
    var textureSurface = new THREE.TextureLoader().load(texturePath);
    var material = new THREE.MeshStandardMaterial({
        color: colorMaterial,
        map: textureSurface,
        roughness : 0.05,
        metalness: 0.45
    });
    loader.load( path, function ( object ) {
        object.traverse( function ( node ) {
            object.position.set(x,y,z);
            object.material = material;
            object.scale.set(scalex,scaley,scalez);
            if ( node.isMesh ) node.material = material;
        });
        scene.add( object );
    });
}

function loadOBJectsPhong(x,y,z, path, scalex, scaley, scalez,
                          texturePath, colorMaterial){
    var loader = new THREE.OBJLoader();
    var textureSurface = new THREE.TextureLoader().load(texturePath);
    var material = new THREE.MeshPhongMaterial({
        color: colorMaterial,
        map: textureSurface
    });
    loader.load( path, function ( object ) {
        object.traverse( function ( node ) {
            object.position.set(x,y,z);
            object.material = material;
            object.scale.set(scalex,scaley,scalez);
            if ( node.isMesh ) node.material = material;
        });
        objectcar = object;
        scene.add( object );
    });
}

function loadObjWithMTL(objPath, MTLpath, scalex, scaley, scalez,
                        posX, posY, posZ){
// ak nie je potrebná globálna premenná tu definujte objekt objcar;
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( MTLpath, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(objPath, function(object)
        {
            objcar = object;
            objcar.position.set(posX,posY,posZ);
            objcar.scale.set(scalex,scaley,scalez);
            scene.add( objcar );
        });
    });
}

function createCat() {
    const catGroup = new THREE.Group();

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const earMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = THREE.Math.degToRad(90) ;
    catGroup.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0.9, 0, 0);
    catGroup.add(head);

    // Ears
    const earGeometry = new THREE.ConeGeometry(0.1, 0.3, 6);
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(1.0, 0.3, 0.25);
    leftEar.rotation.x = THREE.Math.degToRad(45) // Correct orientation of the ear
    //leftEar.rotation.x = Math.PI; // Ensure the cone points upwards
    //leftEar.rotation.x = THREE.Math.degToRad(45) ;
    //leftEar.rotation.y = THREE.Math.degToRad(45) ;
    catGroup.add(leftEar);

    //const rightEar = leftEar.clone();

    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(1.0, 0.3, -0.25);
    //rightEar.rotation.z = Math.PI; // Correct orientation of the ear
    rightEar.rotation.x = THREE.Math.degToRad(-45) ;
    catGroup.add(rightEar);

    // Tail
    const tailGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.set(-0.9, 0, 0);
    tail.rotation.z = Math.PI / 4;
    catGroup.add(tail);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(1.1, 0.1, 0.15);
    leftEye.scale.set(1.5, 1.5, 1); // Adjust eye size to make them more visible
    catGroup.add(leftEye);

    const rightEye = leftEye.clone();
    rightEye.position.set(1.1, 0.1, -0.15);
    catGroup.add(rightEye);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
    const frontLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    frontLeftLeg.position.set(0.5, -0.75, 0.2);
    catGroup.add(frontLeftLeg);

    const frontRightLeg = frontLeftLeg.clone();
    frontRightLeg.position.set(0.5, -0.75, -0.2);
    catGroup.add(frontRightLeg);

    const backLeftLeg = frontLeftLeg.clone();
    backLeftLeg.position.set(-0.5, -0.75, 0.2);
    catGroup.add(backLeftLeg);

    const backRightLeg = frontLeftLeg.clone();
    backRightLeg.position.set(-0.5, -0.75, -0.2);
    catGroup.add(backRightLeg);

    // Position cat on the scene
    catGroup.position.set(0, 0.75, 0);
    scene.add(catGroup);
}