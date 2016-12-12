function init() {
    var scene = new THREE.Scene();
    
    scene.fog = new THREE.FogExp2(0x000000, 0.001);
    
    boom = new Audio('audio/boom.mp3');
    boom.volume = 0.2;
    
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraOrigianPosition = {x: 0, y: 0, z: -200}
    camera.position.set(cameraOrigianPosition.x, cameraOrigianPosition.y, cameraOrigianPosition.z);
    camera.lookAt(scene.position);
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth, window.innerHeight);    
    
    // Window resize event -- adaptive layout
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        console.log("resize")
    })
    
    ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight);
    
    spotLight = new THREE.SpotLight();
    spotLight.angle = 0.3;
    spotLight.rotation.x = 180;
    spotLight.decay = 2;
    scene.add(spotLight);
    
    
    // Collider array
    var collider = []        
    
    // Skybox
    skyBoxGeo = new THREE.BoxGeometry(512,512,512)
    faces = [
        new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load("img/purplenebula_rt.png"), side: THREE.DoubleSide, fog: false}),//Right
        new THREE.MeshBasicMaterial(0x000000),//Left
        new THREE.MeshBasicMaterial(0x000000),//Top
        new THREE.MeshBasicMaterial(0x000000),//Bottom
        new THREE.MeshBasicMaterial(0x000000),//Front
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
    
    for (i = 0 ; i < stonesCount ; i++){
        stone = createNewStone();

        stonesGroup.add(stone);
    }
    scene.add(stonesGroup);
    
    function createNewStone(){
        stoneGeo = new THREE.SphereGeometry(4);
        stone = new THREE.Mesh(stoneGeo, stoneMat);

        stone.position.x = Math.random() * (100 - -100) + -100;
        stone.position.y = Math.random() * (200 - -200) + -200;
        stone.position.z = Math.random() * (300 - 100) + 100;
        //stone.position.z = 500
        
        collider.push(stone)
        return stone;
    }
    
    spaceShipContainerGeo = new THREE.BoxGeometry(4,2.5,8);
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
    
    gameOver = false;
    score = 1;
    if(localStorage.topScore == null){ localStorage.setItem("topScore", 0); }
    var topScore = localStorage.topScore;
    
    $("#topScore").html(topScore);
    
    blaster = 0;
    blasterFinished = 0;
    canBlast = 1;
    scoreWhenLastBlast = -1;
    
    // Keyboard events
    window.onkeydown = onKeyDown
    window.onkeyup = onKeyUp
    function onKeyDown(ev){
        //console.log(ev.keyCode);
        if(ev.keyCode == 77){//M
            if(music.paused){
                music.play();
            } else {
                music.pause();
            }
        }
        if(ev.keyCode == 66){//B
            if(canBlast == 1){
                blaster = 1;
            }
        }
    }
    function onKeyUp(ev){}
    
    function update(){
        
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
                }
                
                if(parseInt(score) > (scoreWhenLastBlast+50) && scoreWhenLastBlast != -1){
                    canBlast = 1;
                    blasterFinished = 0;
                    document.getElementById("blaster").innerHTML = "ON";
                }
                
                if(blaster == 1 && blasterFinished == 0){
                    for(i = 0 ; i < stonesGroup.children.length ; i++){
                        stonesGroup.children[i].position.z -= Math.random() * (2 - 1) + 1;
                        stonesGroup.children[i].position.z += Math.random() * (2 - 1) + 1;
                    }
                    setTimeout(function(){
                        for(i = 0 ; i < stonesGroup.children.length ; i++){
                            stonesGroup.children[i].position.z += 5;
                        }
                    },1000);
                    if(stonesGroup.children[100].position.z >= 200){
                        blasterFinished = 1;
                        canBlast = 0;
                        blaster = 0;
                        document.getElementById("blaster").innerHTML = "OFF";
                        scoreWhenLastBlast = parseInt(score);
                    }
                } else {
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
                            gameOverText += "<br/> <span style='color:green'>New High Score !</span> <br/>";
                        }
                        gameOverText += "<br> Click to play again."
                        $("#gameOverText").html(gameOverText)
                        //console.log("Score: "+parseInt(score))
                        boom.play();
                        boom.addEventListener("ended", function(){
                            boom.pause();
                        });
                    }
                }
            },1000);
            
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    
    
    // Render
    function render() {
        if(!gameOver){
            update();
        } else {
            $("#gameOver").show()
            music.pause();
        }

    }
    document.getElementById("output").appendChild(renderer.domElement);
    render();
};
window.onload = init;
