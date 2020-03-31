
let isPressed = false;
let p = document.getElementById("info");
let ASPECT = window.innerWidth / window.innerHeight;
let controls;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let isActive = false;


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, ASPECT, 0.1 , 1000 );


    const renderer = new THREE.WebGLRenderer();

    renderer.setSize ( window.innerWidth, window.innerHeight); // check with divided by 2!!!
    renderer.shadowMap.enabled = true;
    renderer.setClearColor( 0xfff6e6 );


    document.body.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls(camera, renderer.domElement);


    const geometry = new THREE.IcosahedronGeometry(10,0);
    const mat = new THREE.MeshLambertMaterial({

        wireframe: true

    });
    const ico = new THREE.Mesh( geometry, mat );

    ico.position.set(0, 0, -5);
    scene.add (ico);
    camera.position.z = 25;


    const light = new THREE.PointLight( 0xffffff, 1 );


    light.position.set(10, 0, 20);


    scene.add( light );


    console.log(ico.geometry.vertices);


    for (var i in ico.geometry.vertices){


            const geometry2 = new THREE.SphereGeometry(0.7,10,10);
            const sphere = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( {

                color: 0x0099ff,
                //wireframe: true

            } ));

            sphere.userData.index = i;
            sphere.userData.type= 'in';
            sphere.position.copy(ico.geometry.vertices[i]);
            ico.add(sphere);

        const geometry3 = new THREE.SphereGeometry(2);
        const sphere2 = new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial({color: 0xFF1111}) );
        sphere2.material.transparent = true;
        sphere2.material.opacity = 0.1;
        sphere2.material.wireframe = true;
        sphere2.userData.index = i;
        sphere2.userData.type= 'out';
        sphere2.scale.set(1,1,1);
        sphere2.position.copy(ico.geometry.vertices[i]);

      //sphere2.renderOrder = 1;

        ico.add(sphere2);
    }

    document.addEventListener('mousedown', (e) => { isPressed = true; });

    document.addEventListener('mouseup', () => { isPressed = false; });


window.addEventListener('mousemove', (e) => {

    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse.clone(), camera );

    const objects = raycaster.intersectObjects(ico.children); ///important

    let ids = [];
    console.log(ids);
    if (objects.length>0){

        isActive = true;

        for ( const i in objects ) {
            if(objects[i].object.userData.index){

                ids.push(objects[i].object.userData.index);
            }
        }
        console.log(ids);
        ids = ids.length>0 ? ids[0] : -1;
        console.log(ids);

    }else {
        ids = -1;
        isActive = false;
    }

    if(!isPressed){
        for(let i in ico.children){


            if (ico.children[i].userData.type ==='in') {
                if (ico.children[i].userData.index===ids) {
                    ico.children[i].material.color.setHex(0x78F9F6);
                    ico.children[i].scale.set(1.5,1.5,1.5);

                } else {

                    ico.children[i].material.color.setHex(0x0099ff);
                    ico.children[i].scale.set(1,1,1);
                }
            }
            if (ico.children[i].userData.type ==='out') {

                if (ico.children[i].userData.index===ids) {
                    ico.children[i].material.opacity = 0.4;
                } else {
                    ico.children[i].material.opacity = 0.1;
                }
            }

        }
    }



});


function animate() {

    requestAnimationFrame( animate );
    if(!isPressed && !isActive){

        ico.rotation.x += 0.006;
    }
    

    controls.update();
    renderer.render( scene, camera );

}
animate();