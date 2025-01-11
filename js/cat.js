var gui;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isPetting = false;
let lastPetTime = 0;
let petCooldown = 100;
let obj;
let objects = [];
//let objAnimation;
let leftEye, rightEye;
let isAnimating = false;
let isSitting = false;
const animationDuration = 1000; // 1 second
let animationStartTime = 0;

const catGroup = new THREE.Group();
const catControls = {
    sit: toggleSit,
    hunger: 0, // Progress property
    comfort: 0
};
const cursorControls = {
    showRedDot: false
};
const pupilGeometry = new THREE.SphereGeometry(0.025, 32, 32);
const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);

const cursorMaterial = new THREE.SpriteMaterial({ // added sprite here cause it's the only one that worked for me
    color: 0xff0000,
    sizeAttenuation: false,
    depthTest: false,
    depthWrite: false
});
const cursor = new THREE.Sprite(cursorMaterial);
cursor.scale.set(0.02, 0.02, 1)
cursor.visible = false;

let progressController;
let comfortController;

const textureLoader = new THREE.TextureLoader();
const catFurTexture1 = textureLoader.load('texture/catFur.jpg');
const catFurTexture2 = textureLoader.load('texture/catFur2.jpg');

const heartTexture = new THREE.TextureLoader().load('texture/heart.png');

const environments = [
    {
        floorTexture: 'texture/grass.jpg',
        skyTexture: 'texture/livingroom.png'
    },
    {
        floorTexture: 'texture/blackgrass.jpg',
        skyTexture: 'texture/night.png'
    },
    {
        floorTexture: 'texture/bricks.jpg',
        skyTexture: 'texture/cityy.jpg'
    }
];

const textureControls = {
    currentTexture: 'Orange Cat',
    options: ['Orange Cat', 'Gray Cat'],
    currentEnvironment: 'Outside',
    environments: ['Outside', 'Night out', 'City']
};

const updateProgress = (food) => {
    if (catControls.hunger < 100) {
        if(food === "apple"){
            catControls.hunger += 10;

        }
        else if(food === "milk"){
            catControls.hunger += 20;

        }
        else{
            catControls.hunger += 35;
        }
    }

    if(catControls.hunger > 100){
        catControls.hunger = 100;
    }

    progressController.updateDisplay();
}

function updateEnvironment(environmentIndex) {
    const { floorTexture, skyTexture } = environments[environmentIndex];

    const floorMaterial = plane.material;
    floorMaterial.map = new THREE.TextureLoader().load(floorTexture);
    floorMaterial.needsUpdate = true;

    const skyMaterial = sphere.material;
    skyMaterial.map = new THREE.TextureLoader().load(skyTexture);
    skyMaterial.needsUpdate = true;
}

function changeEnvironment(enviro) {
    if (enviro === 'Outside') {
        updateEnvironment(0)
    } else if (enviro === 'Night out') {
        updateEnvironment(1)
    } else {
        updateEnvironment(2)
    }
}

function addHeartParticles(position, count = 10) {
    const heartGeometry = new THREE.BufferGeometry();
    // const heartMaterial = new THREE.PointsMaterial({
    //     color: 0xFF69B4,
    //     size: 0.2,
    //     opacity: 0.8
    // });

    const heartMaterial = new THREE.PointsMaterial({
        map: heartTexture,
        color: 0xFFFFFF,
        size: 0.2,
        transparent: true
    });

    const heartPoints = [];

    for (let i = 0; i < count; i++) {
        const angle = Math.PI * 2 * (i / count);
        const radius = 0.1 + Math.random() * 0.05;
        const z = (16 * Math.pow(Math.sin(angle), 3)) * radius;
        const y = (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) * radius;
        const x = (Math.random() - 0.5) * 0.1;

        heartPoints.push(new THREE.Vector3(
            position.x + x,
            position.y + y,
            position.z + z
        ));
    }

    heartGeometry.setFromPoints(heartPoints);
    const heartParticles = new THREE.Points(heartGeometry, heartMaterial);
    scene.add(heartParticles);

    // Remove particles after animation
    setTimeout(() => {
        scene.remove(heartParticles);
        heartGeometry.dispose();
        heartMaterial.dispose();
    }, 1000);
}

// Materials
const bodyMaterial = new THREE.MeshStandardMaterial({
    map: catFurTexture1,
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

//////////////////////// BODY
const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
//////////////////////// HEAD
const headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const head = new THREE.Mesh(headGeometry, bodyMaterial);
//////////////////////// WHISKERS
const whiskerMaterial = new THREE.LineBasicMaterial({
    color: 0xFFFFFF,
    linewidth: 1
});
//////////////////////// NOSE
const noseGeometry = new THREE.ConeGeometry(0.05, 0.05, 3);
const nose = new THREE.Mesh(noseGeometry, noseMaterial);

const whiskerSets = [
    { y: 0, length: 0.6, angles: [-0.1, 0, 0.1] },
    { y: -0.05, length: 0.5, angles: [-0.15, 0, 0.15] },
    { y: -0.1, length: 0.4, angles: [-0.2, 0, 0.2] }
];
//////////////////////// EARS
const earGeometry = new THREE.ConeGeometry(0.15, 0.3, 4);
const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);

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
            rotation: { z: Math.PI * 0.5 },
            position: { y: -0.7, x: -0.1 }
        },
        tail: { rotation: { x: -Math.PI * 0.2 } }
    }
};
function createCat() {
    body.scale.set(1.2, 0.8, 0.9);
    catGroup.add(body);

    //HEAD
    head.position.set(0.6, 0.2, 0);
    head.scale.set(0.8, 0.8, 0.8);
    catGroup.add(head);

// Ears
    leftEar.position.set(0.1, 0.3, 0.2);
    leftEar.rotation.x = THREE.Math.degToRad(-30);
    leftEar.rotation.z = THREE.Math.degToRad(-20);
    head.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.set(0.1, 0.3, -0.2);
    rightEar.rotation.x = THREE.Math.degToRad(30);
    rightEar.rotation.z = THREE.Math.degToRad(-20);
    head.add(rightEar);

// Eyes
    leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.35, 0.05, 0.15);
    leftEye.scale.set(1, 1.5, 1);
    head.add(leftEye);

    rightEye = leftEye.clone();
    rightEye.position.set(0.35, 0.05, -0.15);
    head.add(rightEye);

// Create pupils
    leftPupil.position.set(0.04, 0, 0);
    leftEye.add(leftPupil);


    rightPupil.position.set(0.04, 0, 0);
    rightEye.add(rightPupil);

//////////////////////// NOSE
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
// Add whiskers as children of head since they werent moving
    whiskerSets.forEach(set => {
        set.angles.forEach(angle => {
            // Right side whiskers
            const rightWhisker = createWhisker(
                0.34,
                set.y,
                0.1,
                set.length,
                angle,
                true
            );
            head.add(rightWhisker);

            // Left side whiskers
            const leftWhisker = createWhisker(
                0.34,           // x position relative to head //had to change this when whiskers became child of head
                set.y,
                -0.1,
                set.length,
                angle,
                false
            );
            head.add(leftWhisker); // Add to head instead of catGroup
        });
    });

//////////////////////// MOUTH
    const innerMouthGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0.32, -0.12, -0.05),
        new THREE.Vector3(0.32, -0.12, 0.05)
    ]);
    const innerMouth = new THREE.Line(
        innerMouthGeometry,
        new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    head.add(innerMouth); // Add to head instead of catGroup

//////////////////////// TAIL
    const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.45, 0, 0),
        new THREE.Vector3(-0.6, 0.2, 0),
        new THREE.Vector3(-0.8, 0.4, 0),
        new THREE.Vector3(-0.9, 0.3, 0)
    ]);
    const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.06, 8, false);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    body.add(tail);

//////////////////////// LEGS
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16);

//////////////////////// FRONT LEGS
    const frontLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    frontLeftLeg.position.set(0.3, -0.5, 0.2);
    catGroup.add(frontLeftLeg);

    const frontRightLeg = frontLeftLeg.clone();
    frontRightLeg.position.set(0.3, -0.5, -0.2);
    catGroup.add(frontRightLeg);

//////////////////////// BACK LEGS
    const backLegGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 16);
    const backLeftLeg = new THREE.Mesh(backLegGeometry, bodyMaterial);
    backLeftLeg.position.set(-0.3, -0.5, 0.2);
    catGroup.add(backLeftLeg);

    const backRightLeg = backLeftLeg.clone();
    backRightLeg.position.set(-0.3, -0.5, -0.2);
    catGroup.add(backRightLeg);

// Create paws for each leg, might be used later
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
        // Change this if it looks weird pls
        catParts.tail.rotation.x = lerp(currentState.tail.rotation.x, targetState.tail.rotation.x, progress);

        if (progress === 1) {
            isAnimating = false;
            isSitting = !isSitting;
        }
    }



    // gui.add({ heartParticles: () => {
    //         addHeartParticles(catGroup.position, 5);
    //     }}, 'heartParticles').name('Heart Particles');

    // Add the animation to the render loop
    function updateAnimation(time) {
        if (isAnimating) {
            animate(time);
        }
    }

    // added animation to renderer
    const originalRender = render;
    render = function() {
        updateAnimation(performance.now());
        originalRender();
    };

    // Add keyboard controls
    document.addEventListener('keydown', (event) => {
        if (event.key === 's') {
            takeScreenshot();
        }
    });

    loadRegObjWithMTL("models/tree4.obj",
        "models/tree4.mtl",
        1.3,1.3,1.3,
        -6,-0.2,7, 30);
    loadRegObjWithMTL("models/tree4.obj",
        "models/tree4.mtl",
        0.9,0.9,0.9,
        -5,-0.2,-4, 15);
    loadRegObjWithMTL("models/tree4.obj",
        "models/tree4.mtl",
        0.9,0.9,0.9,
        -7,-0.2,-1, 10);
    loadRegObjWithMTL("models/tree4.obj",
        "models/tree4.mtl",
        0.6,0.6,0.6,
        1,-0.2,6, 25);
    loadRegObjWithMTL("models/tree4.obj",
        "models/tree4.mtl",
        0.9,0.9,0.9,
        1,-0.2,-7, 10);
    loadRegObjWithMTL("models/tree4.obj",
        "models/tree4.mtl",
        1.3,1.3,1.3,
        -6,-0.2,-7, 10);

    progressController = gui.add(catControls, 'hunger', 0, 100).name('Hunger');


    comfortController = gui.add(catControls, 'comfort', 0, 100).name('Comfort');
    gui.add({ takeScreenshot }, 'takeScreenshot').name('Take Screenshot');
    // gui.add({ pet: () => {
    //         if (catControls.comfort < 100) {
    //             catControls.comfort += 10;
    //         } else {
    //             catControls.comfort = 0;
    //         }
    //         comfortController.updateDisplay();
    //     }}, 'pet').name('Pet');

    // gui.add({ click: updateProgress }, 'click').name('Feed');

    gui.add(catControls, 'sit').name('Sit/Stand');

    const cursorFolder = gui.addFolder('Cursor Controls');
    cursorFolder.add(cursorControls, 'showRedDot')
        .name('Show Red Dot')
        .onChange((value) => {
            cursor.visible = value;
        });

    // Create the "Customization" folder
    const customizationFolder = gui.addFolder('Customization');

    customizationFolder.add(textureControls, 'currentTexture', textureControls.options)
        .name('Cat Texture')
        .onChange(changeTexture);

    changeEnvironment('Outside')

    customizationFolder.add(textureControls, 'currentEnvironment', textureControls.environments)
        .name('Environment')
        .onChange(changeEnvironment);

// Create the "Feed" folder
    const feedFolder = gui.addFolder('Feed');

// Move the "Apple", "Milk", and "Fish" controls to the "Feed" folder
    feedFolder.add({ addObject: () => {
            loadOBJectsStandard(
                catGroup.position.x + 1, catGroup.position.y - 0.57, catGroup.position.z,
                'models/food/apple1.obj',
                0.003, 0.003, 0.003,
                'models/food/apple.png',
                'white',
                0,
                0.01,
                0,
                6,
                "apple"
            );
        }}, 'addObject').name('Apple');

    feedFolder.add({ addObject: () => {
            loadObjWithMTL(
                "models/food/milk.obj",
                "models/food/milk.mtl",
                0.02, 0.02, 0.02,
                catGroup.position.x + 1, catGroup.position.y - 0.7, catGroup.position.z,
                12,
                "milk"
            );
        }}, 'addObject').name('Milk');

    feedFolder.add({ addObject: () => {
            loadOBJectsStandard(
                catGroup.position.x + 1, catGroup.position.y - 0.6, catGroup.position.z,
                'models/food/fish.obj',
                0.06, 0.06, 0.06,
                'models/food/fish.jpg',
                'white',
                THREE.Math.radToDeg(90),
                0,
                0.01,
                30,
                "fish"
            );
        }}, 'addObject').name('Fish');

    return catGroup;
    //return catGroup; // Return the group in case you need to animate it later
}

function createPawForLeg(leg, xOffset = 0) {
    const pawGeometry = new THREE.SphereGeometry(0.09, 16, 16);
    const pawMaterial = new THREE.MeshStandardMaterial({
        color: bodyMaterial.color,
        roughness: 0.8,
        metalness: 0.1
    });

    const paw = new THREE.Mesh(pawGeometry, pawMaterial);
    paw.position.y = -0.25;
    paw.scale.set(1, 0.4, 1.2);
    leg.add(paw);
    return paw;
}
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

// Toggle sitting/standing
function toggleSit() {
    if (!isAnimating) {
        isAnimating = true;
        animationStartTime = performance.now();
    }
}

function updateStats() {
    if (catControls.hunger > 0) {
        catControls.hunger -= 0.005;
        progressController.updateDisplay();
    }
    if (catControls.comfort > 0) {
        catControls.comfort -= 0.01;
        comfortController.updateDisplay();
    }
}

function addPettingEffect(position) {
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
        map: heartTexture,
        color: 0xFFFFFF,
        size: 0.2,
        transparent: true
    });

    const particle = new THREE.Vector3(
        position.x + (Math.random()) * 0.1,
        position.y + (Math.random()) * 0.1,
        position.z + (Math.random()) * 0.1
    );

    particleGeometry.setFromPoints([particle]);
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Remove particle after animation
    setTimeout(() => {
        scene.remove(particleSystem);
        particleGeometry.dispose();
        particleMaterial.dispose();
    }, 1000);
}

document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('mousemove', onMouseMove);

function onMouseDown(event) {
    if (event.button === 0) { // Left mouse button
        isPetting = true;
    }
}

function onMouseUp(event) {
    if (event.button === 0) { // Left mouse button
        isPetting = false;
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (cursorControls.showRedDot) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([plane, ...scene.children], true);

        if (intersects.length > 0) {
            cursor.position.copy(intersects[0].point);
            cursor.position.y += 0.001; // Just barely above the surface
        }
    }
}

function checkPetting() {
    if (!isPetting) return;

    const currentTime = performance.now();
    if (currentTime - lastPetTime < petCooldown) return;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(catGroup.children, true);

    if (intersects.length > 0) {
        if (catControls.comfort < 100) {
            catControls.comfort = Math.min(100, catControls.comfort + 3);
            comfortController.updateDisplay();
        }
        lastPetTime = currentTime;
        petCooldown += 100;
        //ADDED PARTICLE EFFECT, PLEASE CHANGE IT TO STARS OR SOMETHING LATER
        addPettingEffect(intersects[0].point);
    }
}

function changeTexture(textureName) {
    if (textureName === 'Orange Cat') {
        bodyMaterial.map = catFurTexture1;
    } else {
        bodyMaterial.map = catFurTexture2;
    }
    bodyMaterial.needsUpdate = true;
}

function loadOBJectsStandard(x, y, z, path, scalex, scaley, scalez, texturePath, colorMaterial, rotation, first, second, particles, food) {
    const loader = new THREE.OBJLoader();
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshStandardMaterial({
        color: colorMaterial,
        map: texture,
        roughness: 0.05,
        metalness: 0.45
    });

    loader.load(path, (object) => {
        object.traverse((node) => {
            if (node.isMesh) {
                node.material = material;
            }
        });

        object.position.set(x, y, z);
        object.scale.set(scalex, scaley, scalez);
        //object.rotation.x = Math.PI / 4;
        object.rotation.x = rotation;

        const rotationSpeed = 2.5; // Adjust the rotation speed as needed
        const animate = () => {
            object.rotation.y += rotationSpeed * first;
            object.rotation.z += rotationSpeed * second;
            //object.rotation.x += rotationSpeed * 0.01;
            requestAnimationFrame(animate);
        };
        animate();

        scene.add(object);
        addHeartParticles(catGroup.position, particles);
        updateProgress(food);

        // Remove the object after 3 seconds
        setTimeout(() => {
            scene.remove(object);
        }, 1000);


    });
}

function loadObjWithMTL(objPath, MTLpath, scalex, scaley, scalez, posX, posY, posZ, particles, food) {
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(MTLpath, (materials) => {
        materials.preload();

        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(objPath, (object) => {
            object.position.set(posX, posY, posZ);
            object.scale.set(scalex, scaley, scalez);
            scene.add(object);
            addHeartParticles(catGroup.position, particles);
            updateProgress(food);

            objects.push(object);

            // Remove the object after 3 seconds
            setTimeout(() => {
                scene.remove(object);
                objects.splice(objects.indexOf(object), 1);
            }, 1000);
        });
    });
}

function loadRegObjWithMTL(objPath, MTLpath, scalex, scaley, scalez, posX, posY, posZ, rotation){
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load( MTLpath, function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(objPath, function(object)
        {
            obj= object;
            obj.position.set(posX,posY,posZ);
            obj.scale.set(scalex,scaley,scalez);
            obj.rotation.y = rotation ;
            scene.add( obj );
        });
    });
}

function animateObj() {
    for (let i = 0; i < objects.length; i++) {
        objects[i].rotation.y += 0.01;
    }
    requestAnimationFrame(animateObj);
}

function updateEyesAndCursor() {
    if (!cursorControls.showRedDot) {
        cursor.visible = false;
        // Reset pupils to center
        if (leftPupil && rightPupil) {
            leftPupil.position.set(0.04, 0, 0);
            rightPupil.position.set(0.04, 0, 0);
        }
        return;
    }

    cursor.visible = true;

    if (leftPupil && rightPupil && leftEye && rightEye) {
        const leftEyePos = new THREE.Vector3();
        const rightEyePos = new THREE.Vector3();
        leftEye.getWorldPosition(leftEyePos);
        rightEye.getWorldPosition(rightEyePos);

        // Get cursor position in world space
        const cursorWorldPos = cursor.position.clone();

        // Calculate direction vectors in local space
        const catPosition = new THREE.Vector3();
        catGroup.getWorldPosition(catPosition);

        // Convert cursor position to cat
        const localCursor = cursorWorldPos.clone().sub(catPosition);

        // Calculate the relative position (left/right) of the cursor
        const eyeOffset = 0.06; // Adjust this value to control movement range
        const centerX = catPosition.x;

        // Calculate normalized offset (-1 to 1)
        const normalizedX = (localCursor.x - centerX);

        // Apply the offset to pupils
        const pupilOffset = normalizedX * eyeOffset;

        //leftPupil.position.x = 0.04 + pupilOffset;
        //rightPupil.position.x = 0.04 + pupilOffset;

        const normalizedY = (localCursor.y - catPosition.y);
        let verticalOffset = normalizedY * (eyeOffset * 0.5);
        if(verticalOffset > 0.03){
            verticalOffset = 0.03;
        }
        if(verticalOffset < -0.03){
            verticalOffset = -0.03;
        }
        leftPupil.position.y = verticalOffset;
        rightPupil.position.y = verticalOffset;

        const normalizedZ = (localCursor.z - catPosition.z);
        let verticalOffsetZ = normalizedZ * (eyeOffset * 0.5);
        if(verticalOffsetZ > 0.03){
            verticalOffsetZ = 0.03;
        }
        if(verticalOffsetZ < -0.03){
            verticalOffsetZ = -0.03;
        }
        leftPupil.position.z = verticalOffsetZ;
        rightPupil.position.z = verticalOffsetZ;
    }
}

function takeScreenshot() {
    renderer.render(scene, camera);

    // Convert the render to a data URL
    const dataURL = renderer.domElement.toDataURL('image/png');

    // Link
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'cat-screenshot.png';

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

animateObj()