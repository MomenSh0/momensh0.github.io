function init() {
    var scene = new THREE.Scene();
    
    scene.fog = new THREE.FogExp2( 0xFFFFFF, 0.001 );
    
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraOrigianPosition = {x: 0, y: 10, z: -200}
    camera.position.set(cameraOrigianPosition.x, cameraOrigianPosition.y, cameraOrigianPosition.z);
    camera.lookAt(scene.position);
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //var track = new THREE.TrackballControls(camera);
    
    
    // Window resize event -- adaptive layout
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        console.log("resize")
    })

    
    // Axes
//	var axes = new THREE.AxisHelper(100);
//	scene.add(axes);
    
    ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight);
    
    difficulties = {
        easy: 0,
        average: 1,
        hard: 2
    }
    difficulty = difficulties.easy;
    var stoneZIncreaseMin;
    var stoneZIncreaseMax;
    
    switch (difficulty) {
        case 0:
            ambientLight.intensity = 0.8;
            stoneZIncreaseMin = 3;
            stoneZIncreaseMax = 3;
            break;
        case 1:
            ambientLight.intensity = 0.5;
            stoneZIncreaseMin = 3;
            stoneZIncreaseMax = 5;
            break;
        case 2:
            ambientLight.intensity = 0.3;
            stoneZIncreaseMin = 3;
            stoneZIncreaseMax = 7;
            break;
    }
    
    spotLight = new THREE.SpotLight();
    spotLight.angle = 0.3;
    spotLight.rotation.x = 180;
    spotLight.decay = 2;
    scene.add(spotLight);
    
    
    // Collider array
    var collider = []
    var collider2 = []
    
    
    // Skybox
    skyBoxGeo = new THREE.BoxGeometry(512,512,512)
    faces = [
        new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/purplenebula_rt.png"), side: THREE.DoubleSide, fog: false}),//Right
        new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/purplenebula_lf.png"), side: THREE.DoubleSide, fog: false}),//Left
        new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/purplenebula_up.png"), side: THREE.DoubleSide, fog: false}),//Top
        new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/purplenebula_dn.png"), side: THREE.DoubleSide, fog: false}),//Bottom
        new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/purplenebula_bk.png"), side: THREE.DoubleSide, fog: false}),//Front
        new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/purplenebula_ft.png"), side: THREE.DoubleSide, fog: false}),//Back
    ]
    
    skyBoxMaterial = new THREE.MeshFaceMaterial(faces);
    skyBox = new THREE.Mesh(skyBoxGeo, skyBoxMaterial);
    skyBox.rotation.y = 180;
    scene.add(skyBox);
    
    
    var spaceShip;
    var edges;
    var spaceShipLoaded = false;
    spaceShipOrigianPosition = {x: 0, y: 0, z: -170}
    var loader = new THREE.JSONLoader();
    loader.load('spaceship/spaceship.json', function ( geometry ) {
        spaceShip = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("spaceship/S01_512.jpg"), side: THREE.DoubleSide}));
        //spaceShip.position.set(spaceShipOrigianPosition.x, spaceShipOrigianPosition.y, spaceShipOrigianPosition.z);
        spaceShip.position.z = -170;
        //spaceShip.scale = 0.1
        //collider.push(spaceShip)
        scene.add(spaceShip);
        spaceShipLoaded = true
    });
    
    
    stonesCount = 200;
    stonesGroup = new THREE.Object3D();
    var stoneMat = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load("img/rock-fire-2.jpg"),
//            side: THREE.DoubleSide,
//            transparent: true,
//            opacity: 0
        });
    var stoneGeo = new THREE.SphereGeometry(4);

    for (i = 0 ; i < stonesCount ; i++){
        stone = createNewStone();

        stonesGroup.add(stone);
    }
    scene.add(stonesGroup);
    
    function createNewStone(){
        stone = new THREE.Mesh(stoneGeo, stoneMat);

        stone.position.x = Math.random() * (100 - -100) + -100;
        stone.position.y = Math.random() * (200 - -200) + -200;
        stone.position.z = Math.random() * (300 - 100) + 100;
        //stone.position.z = 500
        
        collider.push(stone)
        collider2.push(stone)
        return stone;
    }
    
//    spaceShipGeo = new THREE.BoxGeometry(4,4,4);
//    spaceShipMat = new THREE.MeshBasicMaterial(0xa3a3a3);
//    spaceShip = new THREE.Mesh(spaceShipGeo, spaceShipMat);
//    scene.add(spaceShip);
//    spaceShipLoaded = true;
    
    spaceShipContainerGeo = new THREE.BoxGeometry(4,3,8);
    spaceShipContainerMat = new THREE.MeshBasicMaterial({color: 0xa3a3a3, transparent: true, opacity: 0});
    spaceShipContainer = new THREE.Mesh(spaceShipContainerGeo, spaceShipContainerMat);
    //xyz = spaceShip.position.clone();
    //spaceShipContainer.position.copy(xyz);
    collider.push(spaceShipContainer)
    scene.add(spaceShipContainer);

    
    var mouse = {x: 0, y: 0};
    document.addEventListener('mousemove', onMouseMove, false);
    function onMouseMove(event) {
        // Update the mouse variable
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

     // Make the sphere follow the mouse
      var vector = new THREE.Vector3(mouse.x, mouse.y, -170);
        vector.unproject( camera );
        var dir = vector.sub( camera.position ).normalize();
        //var distance = - camera.position.z / dir.z;
        var distance = 30;
        var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
        spaceShip.position.copy(pos);
        //spaceShip.position.z = -170;
    };
    
//    shots = new THREE.Object3D();
//    scene.add(shots);
//    isShooting = false;
//    function shoot(){
//        shGeo = new THREE.BoxGeometry(1,1,1);
//        shMat = new THREE.MeshLambertMaterial({color: 0xff0000});
//        sh = new THREE.Mesh(shGeo, shMat);
//        //if(shots.children.length > 0){
//            //console.log(shots.children.length-1)
//            sh.name = "shot-"+String(shots.children.length)
//        //}
//        sh.position.set(spaceShipContainer.position.x, spaceShipContainer.position.y, spaceShipContainer.position.z);
//        isShooting = true;
//        collider2.push(sh);
//        shots.add(sh);
//    }
    
    
    gameOver = false;
    //mouseClicked = false;
    score = 1;
    if(localStorage.topScore == null){ localStorage.setItem("topScore", 0); }
    var topScore = localStorage.topScore;
    
//    $.getJSON("js/json.json", function(data) {
//        topScore = data["topScore"];
//        $("#topScore").html(topScore);
//    });
    
    $("#topScore").html(topScore);
//    
    //document.getElementById("topScore").innerHTML = topScore;
    
//    document.getElementById('output').onclick = function() {
//        mouseClicked = true;
//    }
    
    function update(){
        
//        if(mouseClicked){
//            shoot()
//            console.log(shots);
//            mouseClicked = false;
//        }
//        
//        if(shots.children.length > 0){
//            for(i = 0 ; i < shots.children.length ; i++){
//                shots.children[i].position.z += 2;
//            }
//        }
//        
        if(spaceShipLoaded == true) {
            spX = spaceShip.position.x;
            spY = spaceShip.position.y - 2;
            spZ = spaceShip.position.z;
            spaceShipContainer.position.set(spX, spY, spZ);
            spotLight.position.set(spX, spY, spZ);
            
            if(gameStarted == true){
                score += 0.1;
                document.getElementById("score").innerHTML = parseInt(score);
                if(parseInt(score) > topScore) {
                    $("#newHighScoreText").css("display", "block")
                    //document.getElementById("newHighScoreText").style.display = "block"
                }
            
                for(i = 0 ; i < stonesGroup.children.length ; i++){
                    if(stonesGroup.children[i].position.z < cameraOrigianPosition.z){
                        //stonesGroup.children[i].position.z += 300
                        stonesGroup.children[i].position.x = Math.random() * (100 - -100) + -100;
                        stonesGroup.children[i].position.y = Math.random() * (100 - -100) + -100;
                        stonesGroup.children[i].position.z = Math.random() * (300 - 1) + 1;
                        //stonesGroup.children[i].material.opacity = 0
                    } else {
                        //stonesGroup.children[i].material.opacity += 0.05
                        stonesGroup.children[i].position.z -= (Math.random() * (stoneZIncreaseMax - stoneZIncreaseMin) + stoneZIncreaseMin);
                    }
                }
            }
        };
        

        //console.log(stonesGroup.children.length)
        
        //console.log(spaceShip)
        //console.log(collider)
        if(spaceShipLoaded){
            setTimeout(function(){
                isDead = false;
                spaceShipContainer.updateMatrix()
                originPoint = spaceShipContainer.position.clone()

                for(vertex=0 ; vertex < spaceShipContainer.geometry.vertices.length ; vertex++){

                    localVertex = spaceShipContainer.geometry.vertices[vertex].clone()
                    globalVertex = localVertex.applyMatrix4(spaceShipContainer.matrix)
                    direction = globalVertex.sub(spaceShipContainer.position)

                    ray = new THREE.Raycaster(originPoint, direction.clone().normalize())
                    intersect = ray.intersectObjects(collider)

                    if(intersect.length > 0 && intersect[0].distance < direction.length()){
                        isDead = true;
                        //console.log("Dead")
                    }
                    if(isDead){
                        gameOver = true;
                        gameOverText = "Game Over ! <br/>";
                        if (parseInt(score) > topScore) {
                            localStorage.setItem("topScore", parseInt(score))
                            $("#topScore").html(parseInt(score))
                            //document.getElementById("topScore").innerHTML = parseInt(score);
                            
                            gameOverText += "<br/> <span style='color:green'>New High Score !</span> <br/>";
                        }
                        gameOverText += "<br> Click to play again."
                        $("#gameOverText").html(gameOverText)
                        //document.getElementById("gameOverText").innerHTML = gameOverText;
                        //console.log("Score: "+parseInt(score))
                    }
                }
            },1000);
            
        }
        
//        if(shots.children.length > 0){
//            var index
//            namesToRemove = []
//            for(i = 0 ; i < shots.children.length ; i++){
//                console.log("i : "+i);
//                console.log("chl : "+shots.children.length)
//                index = i;
//                shots.children[i].updateMatrix()
//                originPoint = shots.children[i].position.clone()
//
//                for(vertex=0 ; vertex < shots.children[i].geometry.vertices.length ; vertex++){
//
//                    localVertex = shots.children[i].geometry.vertices[vertex].clone()
//                    globalVertex = localVertex.applyMatrix4(shots.children[i].matrix)
//                    direction = globalVertex.sub(shots.children[i].position)
//
//                    ray = new THREE.Raycaster(originPoint, direction.clone().normalize())
//                    intersect = ray.intersectObjects(collider2)
//
//                    if(intersect.length > 0 && intersect[0].distance < direction.length()){
//                        childName = shots.children[i].name;
//                        if(namesToRemove.indexOf(childName) == -1){
//                             console.log(intersect);
//                            //console.log(shots.children[i].name);
//                            //console.log(intersect)
//                            //intersect[0].object.position.z += 100
//                            intersect[0].object.position.x = Math.random() * (100 - -100) + -100;
//                            intersect[0].object.position.y = Math.random() * (100 - -100) + -100;
//                            intersect[0].object.position.z = Math.random() * (300 - 1) + 1;
//                            //scene.remove(scene.getObjectByName(shots.children[i].name))
//                            namesToRemove.push(childName);
//                            //shots.remove(shots.getChildByName(shots.children[i].name))
//                            //collider2.shift();
//                            //shots.children[i].position.y = 500;
//                            //shots.remove(shots.children[0])
//    //                        if(intersect[0].mesh.object instanceof THREE.SphereGeometry) {
//    //                            console.log(intersect);
//    //    //                        shots.remove(shots.children[i]);
//    //    //                        intersect[1].position.z += 100
//    //                        }   
//                        }
//                        
//                    }
//                }
//                if(namesToRemove.length > 0){
//                    for(i = 0 ; i < namesToRemove.length ; i++){
//                        shots.remove(shots.getObjectByName(namesToRemove[i]))
//                    }
//                }
//            }
//        }
        
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    
    
    // Render
    function render() {
        if(!gameOver){
            update();
        } else {
            $("#gameOver").show()
            //document.getElementById("gameOver").style.display = "block"
        }
        //track.update();

    }
    document.getElementById("output").appendChild(renderer.domElement);
    render();
};
window.onload = init;
