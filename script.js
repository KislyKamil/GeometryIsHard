
let isPressed = false;
let p = document.getElementById("info");
let ASPECT = window.innerWidth / window.innerHeight;
let controls, ico, renderer, scene, camera, axesHelper, sphere, sphere2;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let isActive = false;


function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, ASPECT, 0.1 , 1000 );

    console.log(camera);

    //renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize ( window.innerWidth, window.innerHeight); // check with divided by 2!!!
    renderer.shadowMap.enabled = true;
    renderer.setClearColor( 0xfff6e6 );

    document.body.appendChild( renderer.domElement );

    axesHelper = new THREE.AxesHelper(12);


    controls = new THREE.OrbitControls(camera, renderer.domElement);


    const geometry = new THREE.IcosahedronGeometry(10,0);
    const mat = new THREE.MeshLambertMaterial({

        wireframe: true

    });
    ico = new THREE.Mesh( geometry, mat );

    ico.position.set(0, 0, 0);
    scene.add (ico);

    // Uncomment to show axes in 3D
    // scene.add(axesHelper);

    camera.position.z = 25;


    const light = new THREE.PointLight( 0xffffff, 1 );


    light.position.set(10, 0, 20);


    scene.add( light );


    for (var i in ico.geometry.vertices){


        const geometry2 = new THREE.SphereGeometry(0.7,10,10);
         sphere = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( {

            color: 0x0099ff,
            //wireframe: true

        } ));

        sphere.userData.index = i;
        sphere.userData.type= 'in';
        sphere.position.copy(ico.geometry.vertices[i]);
        ico.add(sphere);

        const geometry3 = new THREE.SphereGeometry(2);
        sphere2 = new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial({color: 0xFF1111}) );
        sphere2.material.transparent = true;
        sphere2.material.opacity = 0.1;
        sphere2.material.wireframe = true;
        sphere2.userData.index = i;
        sphere2.userData.type= 'out';
        sphere2.scale.set(1,1,1);
        sphere2.position.copy(ico.geometry.vertices[i]);

        console.log(sphere2); //test

        //sphere2.renderOrder = 1;

        ico.add(sphere2);
    }

    function mouseLocation(e){

        mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

        return mouse;
    }

    document.addEventListener('mousedown', (e) => {

        isPressed = true;
        raycaster.setFromCamera( mouseLocation(e), camera );
        let obj = raycaster.intersectObjects(ico.children);


        if (obj.length > 1){

            for(let i in obj){

                if (obj[i].object.userData.type === "in"){

                    obj = obj[i];
                }
            }


            for(let i=0; i < obj.geometry.vertices.length; i++){

                
            }
        }


    });

    document.addEventListener('mouseup', () => { isPressed = false; });


    window.addEventListener('mousemove', (e) => {


        raycaster.setFromCamera( mouseLocation(e), camera );

        const objects = raycaster.intersectObjects(ico.children); ///important stuff

        let ids = [];
        if (objects.length>0){

            isActive = true;

            for ( const i in objects ) {
                if(objects[i].object.userData.index){

                    ids.push(objects[i].object.userData.index);
                }
            }

            ids = ids.length>0 ? ids[0] : -1;


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

    window.addEventListener('resize', () => {

        camera.aspect = ASPECT;
        camera.updateProjectionMatrix();

        renderer.setSize ( window.innerWidth, window.innerHeight);


    });

}


function animate() {

    requestAnimationFrame( animate );
    if(!isPressed && !isActive){

        ico.rotation.x += 0.006;
    }
    
    controls.update();
    renderer.render( scene, camera );

}
init();
animate();