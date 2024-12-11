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
var gui;
//var progressController;


init();
render();

function init() {

    gui = new dat.GUI();


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
    //gui.update();

    requestAnimationFrame( render );


    renderer.render( scene, camera );
    camera.lookAt(scene.position);

    scene.add(curveObject);

    /*PosIndex++;
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
    objcar.lookAt(curve.getPoint((PosIndex+1) / 1000));*/

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

    /*loadOBJectsStandard( 2,-0.5,0,
        'models/car/Pony_cartoon.obj',
        0.003,0.003,0.003,
        "models/car/Body_dDo_d_orange.jpg",
        "white"
    );*/

  /*  loadOBJectsPhong( -2,-0.5,0,
        'models/car/Pony_cartoon.obj',
        0.003,0.003,0.003,
        "models/car/Body_dDo_d_orange.jpg",
        "white");

    loadObjWithMTL("models/lirkis_car/lirkis_car.obj",
        "models/lirkis_car/lirkis_car.mtl",
        0.5,0.5,0.5,
        0,-0.2,0);*/

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

    var ambientLight = new THREE.AmbientLight(0x7F7F7F);
    scene.add(ambientLight);

    spotlight = new THREE.SpotLight('rgb(255,255,255)');
    spotlight.angle = Math.PI/1;
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

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const catFurTexture = textureLoader.load('texture/catFur.jpg');
    //const catFace = textureLoader.load('texture/Designer.png');

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
        map: catFurTexture,
        roughness: 0.7,
        metalness: 0.1
    });
   /* const faceMaterial = new THREE.MeshStandardMaterial({
        map: catFace,
        roughness: 0.7,
        metalness: 0.1
    });*/
    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0x2E5339,
        roughness: 0.2,
        metalness: 0.8
    });
    const noseMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFA7A7,
        roughness: 0.3,
        metalness: 0.1
    });

    // Body (using ellipsoid shape)
    const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(1.2, 0.8, 0.9);
    catGroup.add(body);

    // Head (slightly smaller sphere)
    const headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0.6, 0.2, 0);
    head.scale.set(0.8, 0.8, 0.8);
    catGroup.add(head);

   /* // Face
    const faceGeometry = new THREE.PlaneGeometry(0.4, 0.4);
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.position.set(0.92, 0.2, 0);
    face.rotation.y = Math.PI * 0.5;
    catGroup.add(face);*/

    // Ears (triangular shape)
    const earGeometry = new THREE.ConeGeometry(0.15, 0.3, 4);
    const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
    leftEar.position.set(0.7, 0.5, 0.2);
    leftEar.rotation.x = THREE.Math.degToRad(-30);
    leftEar.rotation.z = THREE.Math.degToRad(-20);
    catGroup.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.set(0.7, 0.5, -0.2);
    rightEar.rotation.x = THREE.Math.degToRad(30);
    rightEar.rotation.z = THREE.Math.degToRad(-20);
    catGroup.add(rightEar);

    // Eyes (almond shape by scaling spheres)
    const eyeGeometry = new THREE.SphereGeometry(0.06, 32, 32);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.85, 0.25, 0.15);
    leftEye.scale.set(1, 1.5, 1);
    catGroup.add(leftEye);

    const rightEye = leftEye.clone();
    rightEye.position.set(0.85, 0.25, -0.15);
    catGroup.add(rightEye);

    // Nose
    const noseGeometry = new THREE.ConeGeometry(0.05, 0.05, 3);
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0.95, 0.15, 0);
    nose.rotation.x = Math.PI * 0.5;
    catGroup.add(nose);
    const mouthCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.92, 0.1, -0.1),
        new THREE.Vector3(0.95, 0.05, 0),
        new THREE.Vector3(0.92, 0.1, 0.1)
    );
    const mouthPoints = mouthCurve.getPoints(50);
    const mouthGeometry = new THREE.BufferGeometry().setFromPoints(mouthPoints);
    const mouthMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const mouth = new THREE.Line(mouthGeometry, mouthMaterial);
    catGroup.add(mouth);

    // Whiskers
    const whiskerMaterial = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 1
    });

    // Function to create a whisker
    function createWhisker(startX, startY, startZ, length, angle, isRight) {
        const points = [
            new THREE.Vector3(startX, startY, startZ),
            new THREE.Vector3(
                startX,
                startY + length * Math.sin(angle) * 0.2, // Slight upward curve
                startZ + (isRight ? 1 : -1) * length * Math.cos(angle) // Direction based on side
            )
        ];
        const whiskerGeometry = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.Line(whiskerGeometry, whiskerMaterial);
    }

// Whisker parameters
    const whiskerSets = [
        { y: 0.2, length: 0.6, angles: [-0.1, 0, 0.1] },  // Top set
        { y: 0.15, length: 0.5, angles: [-0.15, 0, 0.15] }, // Middle set
        { y: 0.1, length: 0.4, angles: [-0.2, 0, 0.2] }   // Bottom set
    ];

// Add whiskers on both sides
    whiskerSets.forEach(set => {
        set.angles.forEach(angle => {
            // Right side whiskers
            const rightWhisker = createWhisker(
                0.88,            // x position
                set.y,         // y position
                0.1,           // z position (right side)
                set.length,    // length
                angle,         // angle
                true          // is right side
            );
            catGroup.add(rightWhisker);

            // Left side whiskers
            const leftWhisker = createWhisker(
                0.88,            // x position
                set.y,         // y position
                -0.1,          // z position (left side)
                set.length,    // length
                angle,         // same angle
                false         // is left side
            );
            catGroup.add(leftWhisker);
        });
    });

    // Inner mouth details
    const innerMouthGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0.92, 0.08, -0.05),
        new THREE.Vector3(0.92, 0.08, 0.05)
    ]);
    const innerMouth = new THREE.Line(
        innerMouthGeometry,
        new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    // Tail (curved cylinder)
    const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.6, 0, 0),
        new THREE.Vector3(-0.8, 0.2, 0),
        new THREE.Vector3(-1.0, 0.4, 0),
        new THREE.Vector3(-1.1, 0.3, 0)
    ]);
    const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.06, 8, false);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    catGroup.add(tail);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16);

    // Front legs
    const frontLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    frontLeftLeg.position.set(0.3, -0.5, 0.2);
    catGroup.add(frontLeftLeg);

    const frontRightLeg = frontLeftLeg.clone();
    frontRightLeg.position.set(0.3, -0.5, -0.2);
    catGroup.add(frontRightLeg);

    // Back legs (slightly longer)
    const backLegGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 16);
    const backLeftLeg = new THREE.Mesh(backLegGeometry, bodyMaterial);
    backLeftLeg.position.set(-0.3, -0.5, 0.2);
    catGroup.add(backLeftLeg);

    const backRightLeg = backLeftLeg.clone();
    backRightLeg.position.set(-0.3, -0.5, -0.2);
    catGroup.add(backRightLeg);

    // Paws
    const pawGeometry = new THREE.SphereGeometry(0.09, 16, 16);
    const pawMaterial = new THREE.MeshStandardMaterial({
        color: bodyMaterial.color,
        roughness: 0.8,
        metalness: 0.1
    });

    // Add paws to each leg
    const positions = [
        [0.3, -0.75, 0.2],  // front left
        [0.3, -0.75, -0.2], // front right
        [-0.3, -0.75, 0.2], // back left
        [-0.3, -0.75, -0.2] // back right
    ];

    positions.forEach(pos => {
        const paw = new THREE.Mesh(pawGeometry, pawMaterial);
        paw.position.set(...pos);
        paw.scale.set(1, 0.4, 1.2);
        catGroup.add(paw);
    });

    // Position cat on the scene
    catGroup.position.set(0, 1, 0);
    scene.add(catGroup);
    const catParts = {
        body: body,
        head: head,
        frontLegs: {
            left: frontLeftLeg,
            right: frontRightLeg
        },
        backLegs: {
            left: backLeftLeg,
            right: backRightLeg
        },
        tail: tail
    };

    // Animation states
    const states = {
        standing: {
            body: { position: { y: 0 }, scale: { y: 0.8, z: 0.9 } },
            head: { position: { y: 0.2 } },
            backLegs: {
                rotation: { x: 0 },
                position: { y: -0.5, x: -0.3 }
            },
            tail: { rotation: { x: 0 } }
        },
        sitting: {
            body: { position: { y: -0.3 }, scale: { y: 0.6, z: 1.1 } },
            head: { position: { y: 0.1 } },
            backLegs: {
                rotation: { x: Math.PI * 0.25 },
                position: { y: -0.3, x: -0.4 }
            },
            tail: { rotation: { x: -Math.PI * 0.2 } }
        }
    };

    let isAnimating = false;
    let isSitting = false;
    const animationDuration = 1000; // 1 second
    let animationStartTime = 0;

    function animate(currentTime) {
        if (!isAnimating) return;

        const elapsed = currentTime - animationStartTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        // Lerp function for smooth interpolation
        const lerp = (start, end, t) => start + (end - start) * t;

        const currentState = isSitting ? states.standing : states.sitting;
        const targetState = isSitting ? states.sitting : states.standing;

        // Animate body
        catParts.body.position.y = lerp(currentState.body.position.y, targetState.body.position.y, progress);
        catParts.body.scale.y = lerp(currentState.body.scale.y, targetState.body.scale.y, progress);
        catParts.body.scale.z = lerp(currentState.body.scale.z, targetState.body.scale.z, progress);

        // Animate head
        catParts.head.position.y = lerp(currentState.head.position.y, targetState.head.position.y, progress);

        // Animate back legs
        const backLegRotation = lerp(currentState.backLegs.rotation.x, targetState.backLegs.rotation.x, progress);
        const backLegPosY = lerp(currentState.backLegs.position.y, targetState.backLegs.position.y, progress);
        const backLegPosX = lerp(currentState.backLegs.position.x, targetState.backLegs.position.x, progress);

        catParts.backLegs.left.rotation.x = backLegRotation;
        catParts.backLegs.right.rotation.x = backLegRotation;
        catParts.backLegs.left.position.y = backLegPosY;
        catParts.backLegs.right.position.y = backLegPosY;
        catParts.backLegs.left.position.x = backLegPosX;
        catParts.backLegs.right.position.x = backLegPosX;

        // Animate tail
        catParts.tail.rotation.x = lerp(currentState.tail.rotation.x, targetState.tail.rotation.x, progress);

        if (progress === 1) {
            isAnimating = false;
            isSitting = !isSitting;
        }
    }

    // Add the animation to the render loop
    function updateAnimation(time) {
        if (isAnimating) {
            animate(time);
        }
    }

    // Toggle sitting/standing
    function toggleSit() {
        if (!isAnimating) {
            isAnimating = true;
            animationStartTime = performance.now();
        }
    }

    // Add the animation update to your render loop
    const originalRender = render;
    render = function() {
        updateAnimation(performance.now());
        originalRender();
    };

    // Add keyboard controls
    document.addEventListener('keydown', (event) => {
        if (event.key === 's') {
            toggleSit();
        }
    });


    const catControls = {
        sit: toggleSit,
        progress: 0, // Progress property
    };
    gui.add(catControls, 'sit').name('Sit/Stand');

    const progressController = gui.add(catControls, 'progress', 0, 100).name('Hunger');

    const updateProgress = () => {
        if (catControls.progress < 100) {
            catControls.progress += 10; // Increment progress by 10
        } else {
            catControls.progress = 0; // Reset progress when full
        }
        progressController.updateDisplay(); // Update the GUI display
    };

    gui.add({ click: updateProgress }, 'click').name('Feed');

    return catGroup;
    //return catGroup; // Return the group in case you need to animate it later
}