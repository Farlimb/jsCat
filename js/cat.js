// cat.js
class Cat {
    constructor() {
        this.group = new THREE.Group();
        this.parts = {};
        this.states = this.defineStates();
        this.isAnimating = false;
        this.isSitting = false;
        this.animationDuration = 1000;
        this.animationStartTime = 0;

        this.initialize();
    }

    initialize() {
        this.createMaterials();
        this.createBody();
        this.createHead();
        this.createLegs();
        this.createTail();
        this.setupAnimations();
        this.setupGUI();

        this.group.position.set(0, 1, 0);
    }

    createMaterials() {
        const textureLoader = new THREE.TextureLoader();
        this.materials = {
            body: new THREE.MeshStandardMaterial({
                map: textureLoader.load('texture/catFur.jpg'),
                roughness: 0.7,
                metalness: 0.1
            }),
            eyes: new THREE.MeshPhongMaterial({
                color: 0x000000,
                shininess: 100,
                specular: 0x666666
            }),
            nose: new THREE.MeshStandardMaterial({
                color: 0xFFA7A7,
                roughness: 0.3,
                metalness: 0.1
            }),
            highlight: new THREE.MeshBasicMaterial({
                color: 0xffffff
            }),
            whisker: new THREE.LineBasicMaterial({
                color: 0xFFFFFF,
                linewidth: 1
            }),
            mouth: new THREE.LineBasicMaterial({
                color: 0x000000
            })
        };
    }

    createBody() {
        const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.parts.body = new THREE.Mesh(bodyGeometry, this.materials.body);
        this.parts.body.scale.set(1.2, 0.8, 0.9);
        this.group.add(this.parts.body);
    }

    createBasicHead() {
        const headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const head = new THREE.Mesh(headGeometry, this.materials.body);
        head.position.set(0.6, 0.2, 0);
        head.scale.set(0.8, 0.8, 0.8);
        return head;
    }

    addEars(head) {
        const earGeometry = new THREE.ConeGeometry(0.15, 0.3, 4);

        const leftEar = new THREE.Mesh(earGeometry, this.materials.body);
        leftEar.position.set(0.1, 0.3, 0.2);
        leftEar.rotation.x = THREE.Math.degToRad(-30);
        leftEar.rotation.z = THREE.Math.degToRad(-20);
        head.add(leftEar);

        const rightEar = leftEar.clone();
        rightEar.position.set(0.1, 0.3, -0.2);
        rightEar.rotation.x = THREE.Math.degToRad(30);
        rightEar.rotation.z = THREE.Math.degToRad(-20);
        head.add(rightEar);
    }

    addEyes(head) {
        const eyeGeometry = new THREE.SphereGeometry(0.06, 32, 32);
        const highlightGeometry = new THREE.SphereGeometry(0.02, 32, 32);

        const leftEye = new THREE.Mesh(eyeGeometry, this.materials.eyes);
        leftEye.position.set(0.35, 0.05, 0.15);
        leftEye.scale.set(1, 1.5, 1);
        head.add(leftEye);

        const rightEye = leftEye.clone();
        rightEye.position.set(0.35, 0.05, -0.15);
        head.add(rightEye);

        const leftHighlight = new THREE.Mesh(highlightGeometry, this.materials.highlight);
        leftHighlight.position.set(0.02, 0.02, 0.02);
        leftEye.add(leftHighlight);

        const rightHighlight = leftHighlight.clone();
        rightEye.add(rightHighlight);
    }

    addNose(head) {
        const noseGeometry = new THREE.ConeGeometry(0.05, 0.05, 3);
        const nose = new THREE.Mesh(noseGeometry, this.materials.nose);
        nose.position.set(0.38, -0.05, 0);
        nose.rotation.x = Math.PI * 0.5;
        head.add(nose);
    }

    addMouth(head) {
        const mouthCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0.38, -0.1, -0.1),
            new THREE.Vector3(0.38, -0.15, 0),
            new THREE.Vector3(0.38, -0.1, 0.1)
        );
        const mouthPoints = mouthCurve.getPoints(50);
        const mouthGeometry = new THREE.BufferGeometry().setFromPoints(mouthPoints);
        const mouth = new THREE.Line(mouthGeometry, this.materials.mouth);
        head.add(mouth);

        const innerMouthGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0.32, -0.12, -0.05),
            new THREE.Vector3(0.32, -0.12, 0.05)
        ]);
        const innerMouth = new THREE.Line(innerMouthGeometry, this.materials.mouth);
        head.add(innerMouth);
    }

    addWhiskers(head) {
        const whiskerSets = [
            { y: 0, length: 0.6, angles: [-0.1, 0, 0.1] },
            { y: -0.05, length: 0.5, angles: [-0.15, 0, 0.15] },
            { y: -0.1, length: 0.4, angles: [-0.2, 0, 0.2] }
        ];

        whiskerSets.forEach(set => {
            set.angles.forEach(angle => {
                const rightWhisker = this.createWhisker(0.34, set.y, 0.1, set.length, angle, true);
                const leftWhisker = this.createWhisker(0.34, set.y, -0.1, set.length, angle, false);
                head.add(rightWhisker);
                head.add(leftWhisker);
            });
        });
    }

    createWhisker(startX, startY, startZ, length, angle, isRight) {
        const points = [
            new THREE.Vector3(startX, startY, startZ),
            new THREE.Vector3(
                startX,
                startY + length * Math.sin(angle) * 0.2,
                startZ + (isRight ? 1 : -1) * length * Math.cos(angle)
            )
        ];
        const whiskerGeometry = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.Line(whiskerGeometry, this.materials.whisker);
    }

    createHead() {
        const head = this.createBasicHead();
        this.addEars(head);
        this.addEyes(head);
        this.addNose(head);
        this.addMouth(head);
        this.addWhiskers(head);

        this.parts.head = head;
        this.group.add(head);
    }

    createTail() {
        const tailCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.45, 0, 0),
            new THREE.Vector3(-0.6, 0.2, 0),
            new THREE.Vector3(-0.8, 0.4, 0),
            new THREE.Vector3(-0.9, 0.3, 0)
        ]);
        const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.06, 8, false);
        this.parts.tail = new THREE.Mesh(tailGeometry, this.materials.body);
        this.parts.body.add(this.parts.tail);
    }

    createLegs() {
        this.parts.frontLegs = {
            left: this.createLeg(0.3, -0.5, 0.2, false),
            right: this.createLeg(0.3, -0.5, -0.2, false)
        };

        this.parts.backLegs = {
            left: this.createLeg(-0.3, -0.5, 0.2, true),
            right: this.createLeg(-0.3, -0.5, -0.2, true)
        };
    }

    createLeg(x, y, z, isBack) {
        const geometry = new THREE.CylinderGeometry(0.08, 0.08, isBack ? 0.55 : 0.5, 16);
        if (isBack) {
            geometry.translate(0, 0.275, 0);
        }
        const leg = new THREE.Mesh(geometry, this.materials.body);
        leg.position.set(x, y, z);
        this.group.add(leg);
        this.createPawForLeg(leg);
        return leg;
    }

    createPawForLeg(leg) {
        const pawGeometry = new THREE.SphereGeometry(0.09, 16, 16);
        const paw = new THREE.Mesh(pawGeometry, this.materials.body);
        paw.position.y = -0.25;
        paw.scale.set(1, 0.4, 1.2);
        leg.add(paw);
        return paw;
    }

    defineStates() {
        return {
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
    }

    setupAnimations() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 's') {
                this.toggleSit();
            }
        });
    }


    animate(currentTime) {
        if (!this.isAnimating) return;

        const elapsed = currentTime - this.animationStartTime;
        const progress = Math.min(elapsed / this.animationDuration, 1);

        const currentState = this.isSitting ? this.states.standing : this.states.sitting;
        const targetState = this.isSitting ? this.states.sitting : this.states.standing;

        // Animate body
        this.parts.body.position.y = this.lerp(
            currentState.body.position.y,
            targetState.body.position.y,
            progress
        );
        this.parts.body.scale.y = this.lerp(
            currentState.body.scale.y,
            targetState.body.scale.y,
            progress
        );
        this.parts.body.scale.z = this.lerp(
            currentState.body.scale.z,
            targetState.body.scale.z,
            progress
        );

        // Animate head
        this.parts.head.position.y = this.lerp(
            currentState.head.position.y,
            targetState.head.position.y,
            progress
        );

        // Animate back legs
        const backLegRotation = this.lerp(
            currentState.backLegs.rotation.z,
            targetState.backLegs.rotation.z,
            progress
        );
        const backLegPosY = this.lerp(
            currentState.backLegs.position.y,
            targetState.backLegs.position.y,
            progress
        );
        const backLegPosX = this.lerp(
            currentState.backLegs.position.x,
            targetState.backLegs.position.x,
            progress
        );

        this.parts.backLegs.left.rotation.z = backLegRotation;
        this.parts.backLegs.right.rotation.z = backLegRotation;
        this.parts.backLegs.left.position.y = backLegPosY;
        this.parts.backLegs.right.position.y = backLegPosY;
        this.parts.backLegs.left.position.x = backLegPosX;
        this.parts.backLegs.right.position.x = backLegPosX;

        // Animate tail
        this.parts.tail.rotation.x = this.lerp(
            currentState.tail.rotation.x,
            targetState.tail.rotation.x,
            progress
        );

        if (progress === 1) {
            this.isAnimating = false;
            this.isSitting = !this.isSitting;
        }
    }

    lerp(start, end, t) {
        return start + (end - start) * t;
    }

    updateAnimation(progress) {
        const lerp = (start, end, t) => start + (end - start) * t;
        const currentState = this.isSitting ? this.states.standing : this.states.sitting;
        const targetState = this.isSitting ? this.states.sitting : this.states.standing;

        // Animate body
        this.parts.body.position.y = lerp(
            currentState.body.position.y,
            targetState.body.position.y,
            progress
        );
        this.parts.body.scale.y = lerp(
            currentState.body.scale.y,
            targetState.body.scale.y,
            progress
        );
        this.parts.body.scale.z = lerp(
            currentState.body.scale.z,
            targetState.body.scale.z,
            progress
        );

        // Animate head
        this.parts.head.position.y = lerp(
            currentState.head.position.y,
            targetState.head.position.y,
            progress
        );

        // Animate back legs
        const backLegRotation = lerp(
            currentState.backLegs.rotation.z,
            targetState.backLegs.rotation.z,
            progress
        );
        const backLegPosY = lerp(
            currentState.backLegs.position.y,
            targetState.backLegs.position.y,
            progress
        );
        const backLegPosX = lerp(
            currentState.backLegs.position.x,
            targetState.backLegs.position.x,
            progress
        );

        this.parts.backLegs.left.rotation.z = backLegRotation;
        this.parts.backLegs.right.rotation.z = backLegRotation;
        this.parts.backLegs.left.position.y = backLegPosY;
        this.parts.backLegs.right.position.y = backLegPosY;
        this.parts.backLegs.left.position.x = backLegPosX;
        this.parts.backLegs.right.position.x = backLegPosX;

        // Animate tail
        this.parts.tail.rotation.x = lerp(
            currentState.tail.rotation.x,
            targetState.tail.rotation.x,
            progress
        );
    }

    toggleSit() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animationStartTime = performance.now();
        }
    }

    setupGUI() {
        const catControls = {
            sit: () => this.toggleSit(),
            progress: 0
        };

        gui.add(catControls, 'sit').name('Sit/Stand');
        const progressController = gui.add(catControls, 'progress', 0, 100).name('Hunger');

        gui.add({
            click: () => {
                catControls.progress = (catControls.progress + 10) % 110;
                progressController.updateDisplay();
            }
        }, 'click').name('Feed');
    }
}