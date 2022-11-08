
// 加载纹理图片
const sonw = new THREE.TextureLoader().load('../images/snow.png')
// 定义材质
const material = new THREE.PointsMaterial({
    'size': 2,
    'transparent': true,
    'opacity': 0.6,
    'map': sonw,
    'sizeAttenuation': true,
    'color': 0xffffff,
    // 该融合模式表示，在画新像素时背景像素的颜色会被添加到新像素上。
    // 在本案例中，意味着黑色背景不会被加载出来，我们也可以把纹理背景定义为透明色，也会有类似效果。
    'blending': THREE.AdditiveBlending,
    'depthTest': false, // 解决贴图黑边的问题
    'depthWrite': false // 保证粒子之间不会互相影响
});
// 定义几何体
const geom = new THREE.BufferGeometry()
let veticsFloat32Array = []
const range = 100
for (let i = 0; i < 1000; i++) {
    
    const particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2)
    veticsFloat32Array.push(...particle.toArray())
}

// 初始化渲染粒子雨滴
function initRain(vetics) {
    const vertices = new THREE.Float32BufferAttribute(vetics, 3)
    geom.attributes.position = vertices
    const cloud = new THREE.Points(geom, material)
    scene.add(cloud)
    return cloud
}

// 帧率动画
const speed = 0.1;
let cloud = null
// 初始化雨滴
cloud = initRain(veticsFloat32Array)


// 动画
function renderScence() {
    requestAnimationFrame(renderScence)
    if (cloud) {
        scene.remove(cloud)
    }
    let rainPositionArray = Array.from(cloud.geometry.attributes.position.array)
    for (let i = 0; i < rainPositionArray.length; i += 3) {
        rainPositionArray[i + 1] -= speed
        if (rainPositionArray[i + 1] < 0) {
            rainPositionArray[i + 1] = Math.random() * range - range / 2
        }
    }
    cloud = initRain(rainPositionArray)
    // console.log(vs)
    renderer.render(scene, camera)
}

renderScence()