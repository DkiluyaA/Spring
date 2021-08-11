import * as THREE from 'three'
import React from "react";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {Curves} from "three/examples/jsm/curves/CurveExtras";

export const Spring = (setOpen) => {
    let scene, camera, renderer, controls;
    let WIGHT = window.innerWidth;
    let HEIGHT = window.innerHeight;
    let directionalLight;
    let positionX;
    let material;

    const gui = new dat.GUI();
    let draggable = new THREE.Object3D();
    const raycaster = new THREE.Raycaster();
    const clickMouse = new THREE.Vector2();

    const initCamera = () => {
        camera = new THREE.PerspectiveCamera(45, WIGHT / HEIGHT, 0.2, 1200)
        camera.position.set(0, -300, 300);
        scene.add(camera)
    }

    const initRenderer = () => {
        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})

        renderer.setClearColor(0xffffff)
        renderer.setSize(WIGHT, HEIGHT)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio))

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }

    const initSpring = () => {
        const cubeTextureLoader = new THREE.CubeTextureLoader()
        const environmentMapTexture = cubeTextureLoader.load([
            'textures/0/px.jpg',
            'textures/0/nx.jpg',
            'textures/0/py.jpg',
            'textures/0/ny.jpg',
            'textures/0/pz.jpg',
            'textures/0/nz.jpg'
        ])
        material = new THREE.MeshStandardMaterial()
        material.metalness = 0.7
        material.roughness = 0.15
        material.envMap = environmentMapTexture;
        gui.add(material, 'metalness').min(0).max(1).step(0.0001)
        gui.add(material, 'roughness').min(0).max(1).step(0.0001)

        const extrudePath = new Curves.HelixCurve();

        const params = {
            spline: 'HelixCurve',
            scale: 4,
            extrusionSegments: 500,
            radiusSegments: 3,
            closed: true,
            animationView: false,
            lookAhead: false,
            cameraHelper: false,
        };

        const geometryTube = new THREE.TubeGeometry(extrudePath, params.extrusionSegments, 2, params.radiusSegments, params.closed);
        const meshTube = new THREE.Mesh(geometryTube, material);
        meshTube.castShadow = true;
        meshTube.userData = {
            ...meshTube.userData,
            draggable: true,
            name: 'tube',
        };

        scene.add(meshTube);

    }

    const initPlane = () => {
        const materialPlane = new THREE.MeshStandardMaterial();

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            materialPlane
        )

        plane.position.z = -3
        plane.receiveShadow = true;

        scene.add(plane);

    }


    const initAmbientLight = () => {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75)
        scene.add(ambientLight)

    }

    const initDirectionalLight = () => {
        directionalLight = new THREE.DirectionalLight(0xffffff, 0.9)
        directionalLight.position.set(75, 150, 180);

        directionalLight.shadow.mapSize.width = 2048
        directionalLight.shadow.mapSize.height = 2048

        directionalLight.shadowCameraLeft = -300;
        directionalLight.shadowCameraRight = 300;
        directionalLight.shadowCameraTop = 300;
        directionalLight.shadowCameraBottom = -300;

        directionalLight.castShadow = true;

        scene.add(directionalLight)

        gui.add(directionalLight.position, 'x').min(-160).max(160).step(0.001)
        gui.add(directionalLight.position, 'y').min(-180).max(180).step(0.001)
        gui.add(directionalLight.position, 'z').min(120).max(180).step(0.001)
    }


    const initControls = () => {
        controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
    }


    const init = () => {
        scene = new THREE.Scene();

        initCamera();
        initRenderer();
        initControls();

        initPlane();
        initSpring();

        initAmbientLight();
        initDirectionalLight();

        const container = document.getElementById('app')
        container.appendChild(renderer.domElement);
    }

    const render = () => {
        directionalLight.position.x = positionX * 100;
        renderer.render(scene, camera)
        window.requestAnimationFrame(render)
    }

    window.addEventListener('resize', () => {
        WIGHT = window.innerWidth
        HEIGHT = window.innerHeight

        camera.aspect = WIGHT / HEIGHT
        camera.updateProjectionMatrix()

        renderer.setSize(WIGHT, HEIGHT)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    window.addEventListener('click', (event) => {
        clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(clickMouse, camera);
        const found = raycaster.intersectObjects(scene.children);

        if (found.length > 0 && found[0].object.userData.draggable) {
            draggable = found[0].object;
            setOpen(true);
        }
    })

    window.addEventListener('mousemove', (event) => {
        positionX = event.clientX / WIGHT - 0.5;
    })

    init();
    render();
}
