var camera, scene, renderer, controls;
var geometry, material, cube, sphere;
var spotlight;
var clock = new THREE.Clock();

init();
render();

function init() {
    showSplashScreen();
    gui = new dat.GUI();

    const style = document.createElement('style');
    style.textContent = `
        /* Main */
        .dg.main {
            background: rgba(0, 0, 0, 0.7) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 10px !important;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
        }
    
        /* List items and controllers */
        .dg li:not(.folder) {
            background: transparent !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            transition: all 0.2s ease-in-out !important;
        }
    
        .dg li:not(.folder):hover {
            background: rgba(255, 255, 255, 0.1) !important;
        }
    
        /* Text elements */
        .dg .property-name {
            color: rgba(255, 255, 255, 0.9) !important;
            text-shadow: none !important;
            font-weight: 450;
        }
    
        .dg .title {
            color: rgba(255, 255, 255, 0.9) !important;
        }
    
        /* Input fields */
        .dg .c input[type=text] {
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 4px !important;
            color: rgba(255, 255, 255, 0.9) !important;
            border: none !important;
            padding: 2px 5px !important;
        }
    
        /* Sliders */
        .dg .c .slider {
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 10px !important;
            margin-top: 6px !important;
        }
    
        .dg .c .slider-fg {
            background: rgba(255, 255, 255, 0.5) !important;
            border-radius: 10px !important;
        }
    
        /* Additional styles for better visibility */
        .dg .button {
            background: rgba(255, 255, 255, 0.1) !important;
            color: rgba(255, 255, 255, 0.9) !important;
            border-radius: 4px !important;
        }
    
        .dg .close-button {
            color: rgba(255, 255, 255, 0.9) !important;
            background: rgba(255, 255, 255, 0.1) !important;
        }
    
        .dg li.folder {
            color: rgba(255, 255, 255, 0.9) !important;
        }
    `;

    document.head.appendChild(style);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.set(4, 2, 0);

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
        roughness : 1,
        metalness: 0} );
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


    spotlight = new THREE.SpotLight('rgb(255,255,255)');
    spotlight.angle = Math.PI;
    spotlight.position.set(0, 4, 2);
    spotlight.intensity = 0.8;
    spotlight.castShadow = true;
    scene.add(spotlight);
    spotlight.penumbra = 1;
    //var spotLightHelper = new THREE.SpotLightHelper( spotlight );
    //scene.add( spotLightHelper );

    let spotlight2 = new THREE.SpotLight('rgb(255,255,255)');
    spotlight2.angle = Math.PI;
    spotlight2.position.set(8, 4, 0);
    spotlight2.intensity = 0.8;
    spotlight2.castShadow = true;
    scene.add(spotlight2);
    spotlight2.penumbra = 1;

}

function update()
{
    updateEyesAndCursor();
    controls.update();
    updateStats();
}

function showSplashScreen() {
    const splash = document.createElement('div');
    splash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        font-family: Arial, sans-serif;
        z-index: 1000;
    `;

    splash.innerHTML = `
        <h1 style="margin-bottom: 20px;">Whisker the cat</h1>
        <div style="text-align: center; line-height: 1.6;">
            <p>Filip Kušnír, Daniel Štefanka</p>
            <p>KPI FEI</p>
            <p>Technická univerzita Košice</p>
            <p>Počítačová grafika</p>
            <p>2024/2025</p>
        </div>
        <button style="
            margin-top: 20px;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
        ">Start Application</button>
    `;

    document.body.appendChild(splash);

    splash.querySelector('button').addEventListener('click', () => {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.remove();
        }, 500);
    });
}