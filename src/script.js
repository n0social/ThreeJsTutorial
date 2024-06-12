//npm install parcel --save-dev
//npm install three
//parcel ./src/index.html
//npm install dat.gui


//imports
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'; //package used to change the color of elements on the fly

//import images
import background from '//src//img//background.jpg';

//Create a render
const renderer = new THREE.WebGLRenderer();

//set shadows to true to enable shadows
renderer.shadowMap.enabled = true;

//Set size of window
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//Create a Scene
const scene = new THREE.Scene();

//Add a camera
const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000
)

//Add movement to camera
const orbit = new OrbitControls(camera,renderer.domElement);
//Add axis to show where items will be placed
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

//Set camera position
camera.position.set(0,2,5)

//Update Camera movement to show movmeent
orbit.update();

//Create an element
const boxGeometry = new THREE.BoxGeometry(); //Create element
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00}); //Add color to element
const box = new THREE.Mesh(boxGeometry, boxMaterial); //Fuze element and material
scene.add(box); //Add element to scene

//Add a plane
const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({color:0xFFFFFF, side:THREE.DoubleSide}); //Change the color and add a double side to the plane
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane);
plane.receiveShadow = true;

plane.rotation.x = -0.5 * Math.PI;

const gridHelper = new THREE.GridHelper(30); //30 is used to increase grid size
scene.add(gridHelper);

//Create a Sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({color:0xFFFFF});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(-10, 5, 0)
sphere.castShadow = true;

//add ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//add directional light

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;

//Directional Light Helper
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight,5);
scene.add(dLightHelper);
//Add Shadow helper to directional Light to see where light and shadow will cast
const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);

//Add Fog
//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);

//Add For more options
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

//Change Background
//renderer.setClearColor(0xFFFFFFF);
//change background to image
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(background);
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([
//     background,
// ]);

//Add Texture to cube
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
    
    map: textureLoader.load(background),
});

//OR TO change Material of cube
// box2.material.map = textureLoader.load(background);

const box2 = new THREE.Mesh(box2Geometry,box2Material);
scene.add(box2);
box2.position.set(0, 15,10);


// //add Spotlight
// const spotLight = new THREE.SpotLight(0xFFFFFF);
// scene.add(spotLight);
// spotLight.position.set(-100, 100, 0);
// spotLight.castShadow = true;
// spotLight.angle = 0.02;

//Spotlight Helper
// const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper);

//Add Gui to change color of elements from import
const gui = new dat.GUI();

const options = {
    sphereColor:'#ffea00',
    wireframe:false,
    speed:0.01,
    // angle:0.2,
    // pneumbra:0,
    // intensity:1,
};
gui.addColor(options, "sphereColor").onChange(function(e){
    sphere.material.color.set(e);//The variable e contains the colors code
});

gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);

// gui.add(options, 'angle', 0, 1);
// gui.add(options, 'pneumbra', 0, 1);
// gui.add(options, 'intensity', 0, 1);

//Make the sphere bounce
let step = 0;

//Select objects from the scene
const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2-1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();
//select the specific object, the previous will only console.log the fact that the mouse registers objects
const sphereId = sphere.id;

//Create a function to rotate element
function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    //Make the sphere bounce
    step += options.speed;
    sphere.position.y = 10 *Math.abs(Math.sin(step));

    // spotLight.angle = options.angle;
    // spotLight.pneumbra = options.pneumbra;
    // spotLight.intensity = options.intensity;
    // sLightHelper.update();

    rayCaster.setFromCamera(mousePosition,camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    for(let i = 0; i < intersects.length; i++) {
        if(intersects[i].object.id === sphereId)
            intersects[i].object.material.color.set(0xFF0000);
    }

    //Render camera and scene within function to continuously render animation
    renderer.render(scene,camera);

}
//Render Animation
renderer.setAnimationLoop(animate);

//resize window to fit all sizes
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});