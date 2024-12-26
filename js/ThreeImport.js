var camera, scene, renderer, controls;
var geometry, material, cube, sphere;
var spotlight;
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();
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
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    camera.lookAt(scene.position);
    scene.add(curveObject);

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
    plane.position.set(0, -0.5, 0);
    plane.rotation.x = Math.PI / 2;
    scene.add( plane );

    var geometrySphere = new THREE.SphereGeometry( 100, 100, 100 );
    var sphereTexture = new THREE.ImageUtils.loadTexture( 'texture/room.jpg' );
    var materialSphere = new THREE.MeshBasicMaterial( {map: sphereTexture, transparent: true, side: THREE.DoubleSide} );
    sphere = new THREE.Mesh( geometrySphere, materialSphere );
    sphere.position.set(0, 0, 0);
    scene.add( sphere );

    createCat();
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


function createCat() {
    const catGroup = new THREE.Group();

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const catFurTexture = textureLoader.load('texture/catFur.jpg');

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
        map: catFurTexture,
        roughness: 0.7,
        metalness: 0.1
    });

    const eyeGeometry = new THREE.SphereGeometry(0.06, 32, 32);
    const eyeMaterial = new THREE.MeshPhongMaterial({  // Changed to MeshPhongMaterial
        color: 0x000000,  // Changed to black
        shininess: 100,
        specular: 0x666666
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

    // Modify the head creation part of your createCat function:

// Head (slightly smaller sphere)
    const headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0.6, 0.2, 0);
    head.scale.set(0.8, 0.8, 0.8);
    catGroup.add(head);

// Ears (as children of head)
    const earGeometry = new THREE.ConeGeometry(0.15, 0.3, 4);
    const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
    leftEar.position.set(0.1, 0.3, 0.2); // Position relative to head
    leftEar.rotation.x = THREE.Math.degToRad(-30);
    leftEar.rotation.z = THREE.Math.degToRad(-20);
    head.add(leftEar); // Add to head instead of catGroup

    const rightEar = leftEar.clone();
    rightEar.position.set(0.1, 0.3, -0.2); // Position relative to head
    rightEar.rotation.x = THREE.Math.degToRad(30);
    rightEar.rotation.z = THREE.Math.degToRad(-20);
    head.add(rightEar); // Add to head instead of catGroup

// Eyes (as children of head)
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.35, 0.05, 0.15); // Adjusted x position
    leftEye.scale.set(1, 1.5, 1);
    head.add(leftEye);

    const rightEye = leftEye.clone();
    rightEye.position.set(0.35, 0.05, -0.15); // Adjusted x position
    head.add(rightEye);

// Add eye highlights (optional)
    const highlightGeometry = new THREE.SphereGeometry(0.02, 32, 32);
    const highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const leftHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    leftHighlight.position.set(0.02, 0.02, 0.02);
    leftEye.add(leftHighlight);

    const rightHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    rightHighlight.position.set(0.02, 0.02, 0.02);
    rightEye.add(rightHighlight);

//////////////////////// NOSE
    const noseGeometry = new THREE.ConeGeometry(0.05, 0.05, 3);
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0.38, -0.05, 0);
    nose.rotation.x = Math.PI * 0.5;
    head.add(nose); // Add to head

//////////////////////// MOUTH
    const mouthCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.38, -0.1, -0.1),
        new THREE.Vector3(0.38, -0.15, 0),
        new THREE.Vector3(0.38, -0.1, 0.1)
    );
    const mouthPoints = mouthCurve.getPoints(50);
    const mouthGeometry = new THREE.BufferGeometry().setFromPoints(mouthPoints);
    const mouthMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const mouth = new THREE.Line(mouthGeometry, mouthMaterial);
    head.add(mouth); // Add to head

//////////////////////// WHISKERS
    const whiskerMaterial = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 1
    });

    function createWhisker(startX, startY, startZ, length, angle, isRight) {
        const points = [
            new THREE.Vector3(startX, startY, startZ),
            new THREE.Vector3(
                startX,
                startY + length * Math.sin(angle) * 0.2,
                startZ + (isRight ? 1 : -1) * length * Math.cos(angle)
            )
        ];
        const whiskerGeometry = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.Line(whiskerGeometry, whiskerMaterial);
    }

// Whisker parameters (adjusted positions to be relative to head)
    const whiskerSets = [
        { y: 0, length: 0.6, angles: [-0.1, 0, 0.1] },
        { y: -0.05, length: 0.5, angles: [-0.15, 0, 0.15] },
        { y: -0.1, length: 0.4, angles: [-0.2, 0, 0.2] }
    ];

// Add whiskers as children of head
    whiskerSets.forEach(set => {
        set.angles.forEach(angle => {
            // Right side whiskers
            const rightWhisker = createWhisker(
                0.34,           // x position relative to head
                set.y,         // y position
                0.1,           // z position
                set.length,
                angle,
                true
            );
            head.add(rightWhisker); // Add to head instead of catGroup

            // Left side whiskers
            const leftWhisker = createWhisker(
                0.34,           // x position relative to head
                set.y,
                -0.1,
                set.length,
                angle,
                false
            );
            head.add(leftWhisker); // Add to head instead of catGroup
        });
    });

// Inner mouth (as child of head)
    const innerMouthGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0.32, -0.12, -0.05),
        new THREE.Vector3(0.32, -0.12, 0.05)
    ]);
    const innerMouth = new THREE.Line(
        innerMouthGeometry,
        new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    head.add(innerMouth); // Add to head instead of catGroup

    // Tail (curved cylinder)
    const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.45, 0, 0),
        new THREE.Vector3(-0.6, 0.2, 0),
        new THREE.Vector3(-0.8, 0.4, 0),
        new THREE.Vector3(-0.9, 0.3, 0)
    ]);
    const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.06, 8, false);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    body.add(tail);

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

    // Create paws and attach them to legs
    function createPawForLeg(leg, xOffset = 0) {
        const pawGeometry = new THREE.SphereGeometry(0.09, 16, 16);
        const pawMaterial = new THREE.MeshStandardMaterial({
            color: bodyMaterial.color,
            roughness: 0.8,
            metalness: 0.1
        });

        const paw = new THREE.Mesh(pawGeometry, pawMaterial);
        paw.position.y = -0.25; // Position relative to the leg's end
        paw.scale.set(1, 0.4, 1.2);
        leg.add(paw); // Add paw as child of leg
        return paw;
    }

// Create paws for each leg
    const frontLeftPaw = createPawForLeg(frontLeftLeg);
    const frontRightPaw = createPawForLeg(frontRightLeg);
    const backLeftPaw = createPawForLeg(backLeftLeg);
    const backRightPaw = createPawForLeg(backRightLeg);

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
                rotation: { z: 0 },
                position: { y: -0.5, x: -0.3 }
            },
            tail: { rotation: { x: 0 } }
        },
        sitting: {
            body: { position: { y: -0.35 }, scale: { y: 0.6, z: 1.1 } },
            head: { position: { y: 0.1 } },
            backLegs: {
                rotation: { z: Math.PI * 0.5 }, // Negative angle to tilt forward
                position: { y: -0.7, x: -0.1 }    // Moved forward (x) and up (y) slightly
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
        const backLegRotation = lerp(currentState.backLegs.rotation.z, targetState.backLegs.rotation.z, progress);
        const backLegPosY = lerp(currentState.backLegs.position.y, targetState.backLegs.position.y, progress);
        const backLegPosX = lerp(currentState.backLegs.position.x, targetState.backLegs.position.x, progress);

        catParts.backLegs.left.rotation.z = backLegRotation;
        catParts.backLegs.right.rotation.z = backLegRotation;
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