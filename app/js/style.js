// 该对象用于跟踪时间
var clock = new THREE.Clock();
// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 场景 - 舞台
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1c3a45);
// scene.fog = new THREE.FogExp2(0x1c3a45, 0.025);

// 右手坐标系
// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);
// 相机
/*
    透视摄像机 
    PerspectiveCamera(视野角度（FOV）,长宽比（aspect ratio）,近截面（near）,远截面（far）)
*/
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 50, 0);

// // 轨道控制器
const orbit = new THREE.OrbitControls(camera, renderer.domElement);
orbit.listenToKeyEvents(window);

orbit.enableRotate = false; //禁止旋转
// orbit.maxDistance = 20; //相机向外移动
orbit.maxDistance = 100; //相机向外移动
orbit.minDistance = 10; //相机向内移动

orbit.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
orbit.dampingFactor = 0.1;

orbit.screenSpacePanning = false;
orbit.maxPolarAngle = Math.PI / 6;

// 鼠标控制
orbit.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.PAN
}
// 键盘控制
orbit.keys = {
    LEFT: '', //left arrow
    UP: '', // up arrow
    RIGHT: '', // right arrow
    BOTTOM: '' // down arrow
}

/* ----限制场景平移范围  ----*/
// Limits
const maxX = 10
const minX = -10
const maxZ = 10
const minZ = -10

// State
let positionX
let positionZ
let phi
let theta


orbit.addEventListener('change', e => {
    const x = orbit.target.x;
    const z = orbit.target.z;

    let shallWeUpdateAngle = false

    if (x < minX || x > maxX) {
        orbit.target.setX(x < minX ? minX : maxX)
        camera.position.setX(positionX)
        shallWeUpdateAngle = true
    }
    if (z < minZ || z > maxZ) {
        orbit.target.setZ(z < minZ ? minZ : maxZ)
        camera.position.setZ(positionZ)
        shallWeUpdateAngle = true
    }

    if (shallWeUpdateAngle) {
        const distance = camera.position.distanceTo(orbit.target)
        camera.position.set(
            distance * Math.sin(phi) * Math.sin(theta) + orbit.target.x,
            distance * Math.cos(phi) + orbit.target.y,
            distance * Math.sin(phi) * Math.cos(theta) + orbit.target.z
        )
    }

    // Updating state
    positionX = camera.position.x
    positionZ = camera.position.z
    phi = orbit.getPolarAngle()
    theta = orbit.getAzimuthalAngle()
})
/* ----限制场景平移范围 end ----*/


const mapPng = "../images/map.png";
const site1 = "../images/ta.png";
const site2 = "../images/huoshan.png";
const site3 = "../images/long.png";
const site4 = "../images/lang.png";

// 加载图片文件
const textureLoader = new THREE.TextureLoader();
const bgPng = textureLoader.load(mapPng);


// 中心立方体
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, transparent: true, depthTest: false });  //纯色材质
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 1, 0);
scene.add(box);

// 场景网格线
const size = 300;
const divisions = 300;
const colorCenterLine = 0x072530;
const colorGrid = 0x072530;
const gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
gridHelper.position.set(0, 0, -10);
scene.add(gridHelper);

// 主地图
const planeGeometry = new THREE.PlaneGeometry(64, 36);
const planeMaterial = new THREE.MeshBasicMaterial({ map: bgPng, side: THREE.DoubleSide, transparent: true, depthTest: false });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, 0);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

// 场景云
const yun1 = new THREE.TextureLoader().load('../images/yun2.png');
const yZ1 = new THREE.PlaneGeometry(23.62, 23.62);
const yZ1Material = new THREE.MeshBasicMaterial({ map: yun1, side: THREE.DoubleSide, transparent: true, depthTest: false });
const yZ1Plane = new THREE.Mesh(yZ1, yZ1Material);
yZ1Plane.position.set(0, 45, 0);
scene.add(yZ1Plane);
yZ1Plane.rotation.x = -0.5 * Math.PI;


const yun2 = new THREE.TextureLoader().load('../images/yun1.png');
const yZ2 = new THREE.PlaneGeometry(30.33, 16.1);
const yZ2Material = new THREE.MeshBasicMaterial({ map: yun2, side: THREE.DoubleSide, transparent: true, depthTest: false });
const yZ2Plane = new THREE.Mesh(yZ2, yZ2Material);
yZ2Plane.position.set(0, 35, 0);
scene.add(yZ2Plane);
yZ2Plane.rotation.x = -0.5 * Math.PI;

const yun3 = new THREE.TextureLoader().load('../images/yun2.png');
const yZ3 = new THREE.PlaneGeometry(23.62, 23.62);
const yZ3Material = new THREE.MeshBasicMaterial({ map: yun3, side: THREE.DoubleSide, transparent: true, depthTest: false });
const yZ3Plane = new THREE.Mesh(yZ3, yZ3Material);
yZ3Plane.position.set(0, 20, 0);
scene.add(yZ3Plane);
yZ3Plane.rotation.x = -0.5 * Math.PI;

// 飞行器
const icon1 = textureLoader.load(site1);
const icon_Sprite1 = new TextureAnimator(icon1, 23, 1, 23, 100);

const s2Site1 = new THREE.PlaneGeometry(5.24 * 0.8, 7.47 * 0.8);
const s2Site1Material = new THREE.MeshBasicMaterial({ map: icon1, side: THREE.DoubleSide, transparent: true, depthTest: false });
const s2Site1Plane = new THREE.Mesh(s2Site1, s2Site1Material);
s2Site1Plane.position.set(-2.4, 0.1, 6);
scene.add(s2Site1Plane);
s2Site1Plane.rotation.x = -0.5 * Math.PI;


// 火山
const icon2 = textureLoader.load(site2);
const icon_Sprite2 = new TextureAnimator(icon2, 25, 1, 25, 100);

const s2Site2 = new THREE.PlaneGeometry(11.74 * 0.8, 8 * 0.8);
const s2Site2Material = new THREE.MeshBasicMaterial({ map: icon2, side: THREE.DoubleSide, transparent: true, depthTest: false });
const s2Site2Plane = new THREE.Mesh(s2Site2, s2Site2Material);
s2Site2Plane.position.set(7, 0.1, 2);
scene.add(s2Site2Plane);
s2Site2Plane.rotation.x = -0.5 * Math.PI;

// 龙
const icon3 = textureLoader.load(site3);
const icon_Sprite3 = new TextureAnimator(icon3, 33, 1, 33, 60);

const s2Site3 = new THREE.PlaneGeometry(7.81 * 0.8, 5.3 * 0.8);
const s2Site3Material = new THREE.MeshBasicMaterial({ map: icon3, side: THREE.DoubleSide, transparent: true, depthTest: false });
const s2Site3Plane = new THREE.Mesh(s2Site3, s2Site3Material);
s2Site3Plane.position.set(4, 0.1, -6.5);
scene.add(s2Site3Plane);
s2Site3Plane.rotation.x = -0.5 * Math.PI;

// 狼
const icon4 = textureLoader.load(site4);
const icon_Sprite4 = new TextureAnimator(icon4, 45, 1, 45, 80);

const s2Site4 = new THREE.PlaneGeometry(5 * 0.8, 6.31 * 0.8);
const s2Site4Material = new THREE.MeshBasicMaterial({ map: icon4, side: THREE.DoubleSide, transparent: true, depthTest: false });
const s2Site4Plane = new THREE.Mesh(s2Site4, s2Site4Material);
s2Site4Plane.position.set(-6, 0.1, -9);
scene.add(s2Site4Plane);
s2Site4Plane.rotation.x = -0.5 * Math.PI;


// 章鱼
const icon5 = new THREE.TextureLoader().load('../images/zy.png');
const icon_Sprite5 = new TextureAnimator(icon5, 60, 1, 60, 75); // texture, #horiz, #vert, #total, duration.

const s2Site5 = new THREE.PlaneGeometry(5 * 0.8, 4.57 * 0.8);
const s2Site5Material = new THREE.MeshBasicMaterial({ map: icon5, side: THREE.DoubleSide, transparent: true, depthTest: false });
const s2Site5Plane = new THREE.Mesh(s2Site5, s2Site5Material);
s2Site5Plane.position.set(-13.5, 0.1, -1);
scene.add(s2Site5Plane);
s2Site5Plane.rotation.x = -0.5 * Math.PI;



// 地图轮廓
const mhor1 = new THREE.TextureLoader().load('../images/mhor1.png');
const mhor1Pg = new THREE.PlaneGeometry(10.79 * 1.8, 6.95 * 1.8);

const mhor1Material = new THREE.MeshBasicMaterial({ map: mhor1, side: THREE.DoubleSide, transparent: true, opacity: 0, depthTest: false });
const mhor1Plane = new THREE.Mesh(mhor1Pg, mhor1Material);
mhor1Plane.position.set(3, 0, 6.5);
scene.add(mhor1Plane);
mhor1Plane.rotation.x = -0.5 * Math.PI;


const mhor2 = new THREE.TextureLoader().load('../images/mhor2.png');
const mhor2Pg = new THREE.PlaneGeometry(11.29 * 1.8, 9.6 * 1.8);

const mhor2Material = new THREE.MeshBasicMaterial({ map: mhor2, side: THREE.DoubleSide, transparent: true, opacity: 0, depthTest: false });
const mhor2Plane = new THREE.Mesh(mhor2Pg, mhor2Material);
mhor2Plane.position.set(11, 0.2, -2);
scene.add(mhor2Plane);
mhor2Plane.rotation.x = -0.5 * Math.PI;
mhor2Plane.rotation.z = -0.03 * Math.PI;


const mhor3 = new THREE.TextureLoader().load('../images/mhor3.png');
const mhor3Pg = new THREE.PlaneGeometry(11.61 * 1.8, 8.5 * 1.8);
const mhor3Material = new THREE.MeshBasicMaterial({ map: mhor3, side: THREE.DoubleSide, transparent: true, opacity: 0, depthTest: false });
const mhor3Plane = new THREE.Mesh(mhor3Pg, mhor3Material);

mhor3Plane.position.set(0, 1, -4);
scene.add(mhor3Plane);
mhor3Plane.rotation.x = -0.5 * Math.PI;


const mhor4 = new THREE.TextureLoader().load('../images/mhor4.png');
const mhor4Pg = new THREE.PlaneGeometry(17.05 * 1.8, 8 * 1.8);
const mhor4Material = new THREE.MeshBasicMaterial({ map: mhor4, side: THREE.DoubleSide, transparent: true, opacity: 0, depthTest: false });
const mhor4Plane = new THREE.Mesh(mhor4Pg, mhor4Material);

mhor4Plane.position.set(-1.2, 0.6, -7);
scene.add(mhor4Plane);
mhor4Plane.rotation.x = -0.5 * Math.PI;


const mhor5 = new THREE.TextureLoader().load('../images/mhor6.png');
const mhor5Pg = new THREE.PlaneGeometry(8.56 * 2, 7.89 * 2);
const mhor5Material = new THREE.MeshBasicMaterial({ map: mhor5, side: THREE.DoubleSide, transparent: true, opacity: 0, depthTest: false });
const mhor5Plane = new THREE.Mesh(mhor5Pg, mhor5Material);

mhor5Plane.position.set(-12.05, 0, 2.25);
scene.add(mhor5Plane);
mhor5Plane.rotation.x = -0.5 * Math.PI;


// 光
var light = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(light);

const boxId = box.id;
const taId = s2Site1Plane.id;
const huoshanId = s2Site2Plane.id;
const longId = s2Site3Plane.id;
const langId = s2Site4Plane.id;
const zyId = s2Site5Plane.id;

// 地图轮廓光
const mhor1PlaneId = mhor1Plane.id;
const mhor2PlaneId = mhor2Plane.id;

//声明raycaster和mouse变量
// 光线投射 -- 模型添加点击事件
function onMouseClick(event) {

    // const raycaster = new THREE.Raycaster();
    // var mouse = new THREE.Vector2();
    // //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
    // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    // raycaster.setFromCamera(mouse, camera);

    // // 获取raycaster直线和所有模型相交的数组集合
    // var intersects = raycaster.intersectObjects(scene.children);

    /*****************************方式2**********************************/
    // 获取屏幕坐标
    let vector = new THREE.Vector3(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5)
    // 将屏幕坐标转换为three.js场景坐标（鼠标点击位坐标置转三维坐标）
    vector = vector.unproject(camera)

    // 摄像机位置向场景发射“光线”
    const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
    // 判断指定的对象中哪些被该光线照射到了
    const intersects = raycaster.intersectObjects([box, s2Site1Plane, s2Site2Plane, s2Site3Plane, s2Site4Plane, s2Site5Plane])

    /******************************方式2end*********************************/

    console.log(intersects);
    //遍历所有模型 单独设置
    for (let i = 0; i < intersects.length; i++) {
        // intersects[i].object.material.color.set(0xff0000);

        if (intersects[i].object.id === boxId) {
            intersects[i].object.material.color.set(0xFF0000);
            // intersects[i].object.rotation.x += 1;
            // intersects[i].object.rotation.y += 1;
            console.log(orbit);
            console.log(camera);
        }
        if (intersects[i].object.id === taId) {
            intersects[i].object.material.color.set(0xFF0000);

            TweenMax.to(orbit.target, 0.5, { x: -2.5, y: 0, z: 6 });
            TweenMax.to(camera.position, 0.5, { x: -2.5, y: 10, z: 6 });

            scene.remove(scene.getObjectByName("particles_rainy"));
            scene.remove(scene.getObjectByName("particles_snowy"));
            scene.remove(scene.getObjectByName("particles_huo"));
            scene.remove(scene.getObjectByName("particles_tu"));

            if (rainy_sw != 5) {
                rainy_sw = 5;
                console.log('rainy_sw==' + rainy_sw);
                createParticles();
            }
        }

        if (intersects[i].object.id === huoshanId) {
            intersects[i].object.material.color.set(0xFF0000);

            TweenMax.to(orbit.target, 0.5, { x: 7.2, y: 0, z: 0.45 });
            TweenMax.to(camera.position, 0.5, { x: 7.2, y: 10, z: 0.45 });

            scene.remove(scene.getObjectByName("particles_rainy"));
            scene.remove(scene.getObjectByName("particles_snowy"));
            scene.remove(scene.getObjectByName("particles_feng"));
            scene.remove(scene.getObjectByName("particles_tu"));

            if (rainy_sw != 3) {
                rainy_sw = 3;
                createParticles();
            }
        }

        if (intersects[i].object.id === longId) {
            intersects[i].object.material.color.set(0xFF0000);

            TweenMax.to(orbit.target, 0.5, { x: 2, y: 0, z: -6.5 });
            TweenMax.to(camera.position, 0.5, { x: 2, y: 10, z: -6.5 });

            scene.remove(scene.getObjectByName("particles_rainy"));
            scene.remove(scene.getObjectByName("particles_snowy"));
            scene.remove(scene.getObjectByName("particles_huo"));
            scene.remove(scene.getObjectByName("particles_feng"));

            if (rainy_sw != 4) {
                rainy_sw = 4;
                createParticles();
            }
        }

        if (intersects[i].object.id === langId) {
            intersects[i].object.material.color.set(0xFF0000);

            TweenMax.to(orbit.target, 0.5, { x: -4, y: 0, z: -8 });
            TweenMax.to(camera.position, 0.5, { x: -4, y: 10, z: -8 });

            scene.remove(scene.getObjectByName("particles_rainy"));
            scene.remove(scene.getObjectByName("particles_huo"));
            scene.remove(scene.getObjectByName("particles_feng"));
            scene.remove(scene.getObjectByName("particles_tu"));


            if (rainy_sw != 2) {
                rainy_sw = 2;
                createParticles();
            }
        }

        if (intersects[i].object.id === zyId) {
            intersects[i].object.material.color.set(0xFF0000);

            TweenMax.to(orbit.target, 0.5, { x: -10, y: 0, z: -0.6 });
            TweenMax.to(camera.position, 0.5, { x: -10, y: 10, z: -0.6 });

            scene.remove(scene.getObjectByName("particles_snowy"));
            scene.remove(scene.getObjectByName("particles_huo"));
            scene.remove(scene.getObjectByName("particles_feng"));
            scene.remove(scene.getObjectByName("particles_tu"));

            if (rainy_sw != 1) {
                rainy_sw = 1;
                createParticles();
            }
        }
    }
}

window.addEventListener('click', onMouseClick, false);

// 划过当前选中
function onMouseMove(event) {
    // 获取屏幕坐标
    let vector = new THREE.Vector3(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5)
    // 将屏幕坐标转换为three.js场景坐标（鼠标点击位坐标置转三维坐标）
    vector = vector.unproject(camera)
    // 摄像机位置向场景发射“光线”
    const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize())
    // 判断指定的对象中哪些被该光线照射到了
    // const intersects = raycaster.intersectObjects([mhor1Plane, mhor2Plane, mhor3Plane, mhor4Plane, mhor5Plane], false)
    const intersects = raycaster.intersectObjects([s2Site1Plane, s2Site2Plane, s2Site3Plane, s2Site4Plane, s2Site5Plane], false)
    /******************************方式2end*********************************/

    if (intersects.length == 0) {
        TweenMax.to(mhor5Plane.material, 0.5, { opacity: 0 });
    }

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.id === zyId) {
            // TweenMax.to(mhor5Plane.material, 0.5, { opacity: 1 });
            // scene.remove(scene.getObjectByName("particles_rainy"));
            // rainy_sw = 2;
            // createParticles();
        }
    }
}
window.addEventListener('mousemove', onMouseMove, false);


//生成snowgui设置配置项
var cloud = null;
var rainy_sw = 3; // 1雨2雪3晴4阴

//生成粒子的方法
function createParticles() {
    // var img = rainy_sw == 1 ? "snow.png" : rainy_sw == 2 ? "snow.png" : rainy_sw == 3 ? "flamex.png" : rainy_sw == 4 ? "snowflake.png" : rainy_sw == 5 ? "snowflake.png" : "";
    // var name = rainy_sw == 1 ? "particles_rainy" : rainy_sw == 2 ? "particles_snowy" : rainy_sw == 3 ? "particles_huo" : rainy_sw == 4 ? "particles_tu" : rainy_sw == 4 ? "particles_feng" : "";
    var img, name;

    console.log(rainy_sw);

    switch (rainy_sw) {
        case 1:
            img = "snow.png";
            name = "particles_rainy";
            break;
        case 2:
            img = "snow.png"
            name = "particles_snowy";

            break;
        case 3:
            img = "flamex.png"
            name = "particles_huo";

            break;
        case 4:
            img = "snow.png"
            name = "particles_tu";

            break;
        case 5:
            img = "raindrop.png"
            name = "particles_feng";
            break;
        case 6:
            img = "snowflake.png"
            name = "particles_none";
            break;
        default:
            break;
    }


    var texture = new THREE.TextureLoader().load("../images/" + img);

    var guicolor, guisize, guiopacity;
    //存放粒子数据的网格
    var geom = new THREE.BufferGeometry();
    //样式化粒子的THREE.PointCloudMaterial材质
    if (rainy_sw == 1) {
        guicolor = 0x00BFFF;
        guisize = 0.2;
        guiopacity = 1;
    }
    if (rainy_sw == 2) {
        guisize = 0.2;
        guiopacity = 0.8;
        guicolor = 0xffffff;
    }
    if (rainy_sw == 3) {
        guisize = 0.1;
        guiopacity = 0.6;
        guicolor = 0xffffff;
    }
    if (rainy_sw == 4) {
        guisize = 0.2;
        guiopacity = 0.6;
        guicolor = 0xffffff;
    }
    if (rainy_sw == 5) {
        guisize = 0.2;
        guiopacity = 0.5;
        guicolor = 0xffffff;
    }

    var material = new THREE.PointsMaterial({
        size: guisize,
        transparent: true,
        opacity: guiopacity,
        vertexColors: false,
        map: texture,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        color: new THREE.Color(guicolor),
        depthTest: false  //设置解决透明度有问题的情况
    });

    var posintions = [];
    var colors = [];
    var velocities = [];
    var x, y, z;
    var range = 50;
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            posintions.push(Math.random() * range - range / 2,
                Math.random() * range - range / 2,
                Math.random() * range - range / 2);

            if (rainy_sw == 1) {
                // 定义粒子（雨滴）如何水平移动,横向运动速度的范围是-0.16～+0.16
                x = ((Math.random() - 0.5) / 100);
                // 定义雨滴以多快的速度落下,纵向运动速度的范围是0.1～0.3
                y = (0.1 + Math.random() / 5);
            }
            if (rainy_sw == 2) {
                x = (Math.random() - 0.5) / 30;
                y = 0.01 + Math.random() / 10;
                z = Math.random() * 50;
            }

            if (rainy_sw == 3) {
                x = (Math.random() - 0.5) / 30;
                y = 0.01 + Math.random() / 10;
                z = Math.random() * 50;
            }

            if (rainy_sw == 4) {
                x = (Math.random() - 0.5) / 30;
                y = 0.01 + Math.random() / 10;
                z = Math.random() * 50;
            }

            if (rainy_sw == 5) {
                x = (Math.random() - 0.5) / 30;
                y = 0.01 + Math.random() / 10;
                z = Math.random() * 50;
            }


            velocities.push(x, y, z);
        }
    }
    // for (var i = 0; i < 15000; i++) {


    //     // var color = new THREE.Color(0xffffff);
    //     // var asHSL = {};
    //     // color.getHSL(asHSL);
    //     // color.setHSL(asHSL.h, asHSL.s, asHSL.l * Math.random());
    //     // colors.push(color.r, color.g, color.b);
    // }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(posintions, 3));
    // geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

    //生成模型，添加到场景当中
    cloud = new THREE.Points(geom, material);
    cloud.verticesNeedUpdate = true;
    cloud.name = name;

    console.log(cloud.name);
    scene.add(cloud);
}
function snowRender() {

    if (cloud == null) return false;
    //产生雨滴动画效果
    var pos_BufferAttr = cloud.geometry.getAttribute('position');
    var vel_BufferAttr = cloud.geometry.getAttribute('velocity');

    for (var i = 0; i < pos_BufferAttr.count; i++) {
        var pos_x = pos_BufferAttr.getX(i);
        var pos_y = pos_BufferAttr.getY(i);
        var pos_z = pos_BufferAttr.getZ(i);

        var vel_x = vel_BufferAttr.getX(i);
        var vel_y = vel_BufferAttr.getY(i);
        var vel_z = vel_BufferAttr.getZ(i);

        pos_x = pos_x - vel_x;
        pos_y = pos_y - vel_y;
        pos_z = pos_z - vel_z;

        // console.log(pos_x);
        // console.log(pos_y);
        // console.log(pos_z);

        if (pos_x <= -20 || pos_x >= 20) vel_x = vel_x * -1;
        if (pos_y <= 0) pos_y = 30;


        pos_BufferAttr.setX(i, pos_x);
        pos_BufferAttr.setY(i, pos_y);

        vel_BufferAttr.setX(i, vel_x);
    }

    //设置实时更新网格的顶点信息
    pos_BufferAttr.needsUpdate = true;
    vel_BufferAttr.needsUpdate = true;

    // requestAnimationFrame(snowRender);
    // renderer.render(scene, camera);
}

// createParticles();
// snowRender();

// 更新画布
function animate(delta) {
    box.rotation.x = 20 + 10 * Math.cos(delta / 10000);
    box.rotation.y = 2 + 10 * Math.abs(Math.sin(delta / 10000));

    snowRender()
    update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


function update() {
    var delta = clock.getDelta();
    // 更新 -轨道控制器
    orbit.update(delta)
    icon_Sprite1.update(1000 * delta);
    icon_Sprite2.update(1000 * delta);
    icon_Sprite3.update(1000 * delta);
    icon_Sprite4.update(1000 * delta);
    icon_Sprite5.update(1000 * delta);
}

// 窗口缩放
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
};
window.addEventListener('resize', onWindowResize);


// 加载精灵图动画
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
    // note: texture passed by reference, will be updated by the update function.
    // 通过引用传递的纹理，将由更新函数更新。

    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;
    // how many images does this spritesheet contain?
    //  usually equals tilesHoriz * tilesVert, but not necessarily,
    //  if there at blank tiles at the bottom of the spritesheet. 
    // 这个 spritesheet 包含多少张图片？
    // 通常等于tiles Horiz * tiles Vert，但不一定，
    // 如果在 spritesheet 底部的空白图块处。
    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

    // how long should each image be displayed?
    // 每张图片应该显示多长时间？
    this.tileDisplayDuration = tileDispDuration;

    // how long has the current image been displayed?
    this.currentDisplayTime = 0;

    // which image is currently being displayed?
    // 当前正在显示哪个图像？
    this.currentTile = 0;

    this.update = function (milliSec) {

        this.currentDisplayTime += milliSec;
        while (this.currentDisplayTime > this.tileDisplayDuration) {
            this.currentDisplayTime -= this.tileDisplayDuration;
            this.currentTile++;
            if (this.currentTile == this.numberOfTiles)
                this.currentTile = 0;
            var currentColumn = this.currentTile % this.tilesHorizontal;
            texture.offset.x = currentColumn / this.tilesHorizontal;
            var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
            texture.offset.y = currentRow / this.tilesVertical;
        }
    };
}

// GUI
const gui = new dat.GUI();
const options = {
    boxColor: '#ffea00',
    wireframe: true,
}

gui.addColor(options, 'boxColor').onChange(function (e) {
    box.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function (e) {
    box.material.wireframe = e;
});

// 更新相机
function updateCamera() {
    camera.updateProjectionMatrix()
}

gui.add(camera, 'fov', 1, 180).onChange(updateCamera)
gui.add(camera, 'near', 1, 200).onChange(updateCamera)
gui.add(camera, 'far', 1, 200).onChange(updateCamera)


class PositionGUI {
    constructor(obj, name) {
        this.obj = obj
        this.name = name
    }
    get modify() {
        return this.obj[this.name]
    }
    set modify(v) {
        this.obj[this.name] = v
    }
}
const folder = gui.addFolder('全局Position')
folder.add(new PositionGUI(camera.position, 'x'), 'modify', 0, 200).name('x')
folder.add(new PositionGUI(camera.position, 'y'), 'modify', 0, 200).name('y')
folder.add(new PositionGUI(camera.position, 'z'), 'modify', 0, 200).name('z')





// 按钮事件 控制场景放大缩小
window.onload = function () {
    const btn_up = document.querySelectorAll('.btn_up')[0];
    console.log(btn_up);
    btn_up.onclick = function () {
        // camera.position.set(0, 15, 0);
        console.log(camera.position);
    };
};

// 入场动画
setTimeout(() => {
    TweenMax.fromTo(camera.position, 2, { x: 0, y: 50, z: 0 }, { x: 0, y: 20, z: 0 });
    setTimeout(() => {
        orbit.maxDistance = 20; //相机向外移动
    }, 2000);
}, 2000);
