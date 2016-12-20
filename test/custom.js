function init() {
    var scene = new THREE.Scene();
    
   // scene.fog = new THREE.Fog(0x1c1c1c, 0.015, 150);
    
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
    cameraOrigianPosition = {x: 0, y: 10, z: -150}
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
    })

    
    // Axes
	//var axes = new THREE.AxisHelper(100);
	//scene.add(axes);
    
    
    // Collider array
    var collider = []
    
    
    // Skybox
    skyBoxGeo = new THREE.BoxGeometry(100000,100000,100000)
    faces = [
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/right.png"), side: THREE.DoubleSide}),//Right
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/left.png"), side: THREE.DoubleSide}),//Left
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/top.png"), side: THREE.DoubleSide}),//Top
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/bottom.png"), side: THREE.DoubleSide}),//Bottom
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/front.png"), side: THREE.DoubleSide}),//Front
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/back.png"), side: THREE.DoubleSide}),//Back
    ]
    
    skyBoxMaterial = new THREE.MeshFaceMaterial(faces);
    skyBox = new THREE.Mesh(skyBoxGeo, skyBoxMaterial);
    scene.add(skyBox);
    
    
    // Floor
    floorTxtr = new THREE.TextureLoader().load("img/floor.png");
    floorTxtr.wrapS = floorTxtr.wrapT = THREE.RepeatWrapping;
    floorTxtr.repeat.set(1,10);
    var floorGeometry = new THREE.PlaneGeometry(30, 300, 1, 1);
    var floor = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({map: floorTxtr, side: THREE.DoubleSide}));
    floor.rotation.x = -0.5 * Math.PI;
    floor.position.x = 0;
    floor.position.y = 0;
    floor.position.z = 0;
    scene.add(floor);
    
    // Roof
    roofTxtr = new THREE.TextureLoader().load("img/wall-2.jpg");
    roofTxtr.wrapS = roofTxtr.wrapT = THREE.RepeatWrapping;
    roofTxtr.repeat.set(1,5);
    var roofGeometry = new THREE.PlaneGeometry(30, 300, 1, 1);
    var roof = new THREE.Mesh(roofGeometry, new THREE.MeshBasicMaterial({map: roofTxtr, side: THREE.DoubleSide}));
    roof.rotation.x = -0.5 * Math.PI;
    roof.position.x = 0;
    roof.position.y = 50;
    roof.position.z = 0;
    scene.add(roof);
    
    // Walls
    var wallGeometryLeftRight = new THREE.PlaneGeometry(300, 50, 1, 1);
    wallTxtr = new THREE.TextureLoader().load("img/wall-2.jpg");
    wallTxtr.wrapS = wallTxtr.wrapT = THREE.RepeatWrapping;
    wallTxtr.repeat.set(7,2);
    // Left Wall
    var leftWall = new THREE.Mesh(wallGeometryLeftRight, new THREE.MeshBasicMaterial({map: wallTxtr, side: THREE.DoubleSide}));
    leftWall.rotation.y = -0.5 * Math.PI;
    leftWall.position.x = 15;
    leftWall.position.y = 25;
    leftWall.position.z = 0;
    leftWall.name = "wall";
    scene.add(leftWall);
    // Right Wall
    var rightWall = new THREE.Mesh(wallGeometryLeftRight, new THREE.MeshBasicMaterial({map: wallTxtr, side: THREE.DoubleSide}));
    rightWall.rotation.y = -0.5 * Math.PI;
    rightWall.position.x = -15;
    rightWall.position.y = 25;
    rightWall.position.z = 0;
    rightWall.name = "wall";
    scene.add(rightWall);
    
    var wallGeometryFrontBack = new THREE.PlaneGeometry(30, 50, 1, 1);
    frontBackWallTxtr = new THREE.TextureLoader().load("img/wall-2.jpg");
    frontBackWallTxtr.wrapS = frontBackWallTxtr.wrapT = THREE.RepeatWrapping;
    frontBackWallTxtr.repeat.set(1,2);
    // Front Wall
    var frontWall = new THREE.Mesh(wallGeometryFrontBack, new THREE.MeshBasicMaterial({map: frontBackWallTxtr, side: THREE.DoubleSide}));
    frontWall.position.x = 0;
    frontWall.position.y = 25;
    frontWall.position.z = 150;
    frontWall.name = "frontWall";
    scene.add(frontWall);
    // Back Wall
    var backWall = new THREE.Mesh(wallGeometryFrontBack, new THREE.MeshBasicMaterial({map: frontBackWallTxtr, side: THREE.DoubleSide}));
    backWall.position.x = 0;
    backWall.position.y = 25;
    backWall.position.z = -150;
    backWall.name = "wall";
    scene.add(backWall);
    
    collider.push(rightWall)
    collider.push(leftWall)
    collider.push(frontWall)
    collider.push(backWall)
    
    
    // Fire Balls
    fireBallStarterZ = -100;
    fireBallZIncrement = 15;
    fireBallsCount = 10;
    for(i = 0; i < fireBallsCount ; i++){
        var fireBall = new THREE.Mesh(new THREE.SphereGeometry(3,20,20), new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("img/fire.jpg"), side: THREE.DoubleSide}));
        if(i%2 == 0){
            fireBall.position.x = 10;
        } else {
            fireBall.position.x = -10;
        }
        fireBall.position.y = 3;
        fireBall.position.z = fireBallStarterZ + i*fireBallZIncrement;
        fireBall.name = "fireBall"+i;
        scene.add(fireBall);
        collider.push(fireBall)
    }
    
    
    // Character
    var characterGeometry = new THREE.BoxGeometry(4, 4, 4);
    var faces = [
        new THREE.MeshBasicMaterial({color:0xFFFFFF}),//Right
        new THREE.MeshBasicMaterial({color:0xFFFFFF}),//Left
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('img/momen.png'),side:THREE.DoubleSide}),//Top
        new THREE.MeshBasicMaterial({color:0xFFFFFF}),//Bottom
        new THREE.MeshBasicMaterial({color:0xFFFFFF}),//Front
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('img/cat.jpg'),side:THREE.DoubleSide})//Back
    ]
    var character = new THREE.Mesh(characterGeometry, new THREE.MeshFaceMaterial(faces));
    characterOrigianPosition = {x: 0, y: 2, z: -125}
    character.position.set(characterOrigianPosition.x, characterOrigianPosition.y, characterOrigianPosition.z);
    scene.add(character);
    

    // Keyboard events
    window.onkeydown = onKeyDown
    window.onkeyup = onKeyUp

    function onKeyDown(ev){
        if(ev.keyCode == 37){ //Right
            keys.right = true
        } else if (ev.keyCode == 38){ //Up
            keys.up = true
        } else if (ev.keyCode == 39){ //Left
            keys.left = true
        } else if (ev.keyCode == 40){ //Down
            keys.down = true
        }
    }
    function onKeyUp(ev){
        if(ev.keyCode == 37){ //Right
            keys.right = false
        } else if (ev.keyCode == 38){ //Up
            keys.up = false
        } else if (ev.keyCode == 39){ //Left
            keys.left = false
        } else if (ev.keyCode == 40){ //Down
            keys.down = false
        }
    }
    

    // Vars
    keys = {}
    clock = new THREE.Clock()
    movespeed = 17
    lives = 10
    gameOver = false;
    freezCharacter = false;
    
    oddFireBallsMovingLeft = false;
    oddFireBallsMovingRight = false;
    evenFireBallsMovingLeft = false;
    evenFireBallsMovingRight = false;
    
    fireBallsIncrement = 0.50
    fireBallsRotaion = 0.15
    
    
    // Audio
    music = new Audio('audio/music.mp3');
    music.play();
    music.volume = 0.5;
    
    music.addEventListener("ended", function(){
        gameOver = true;
    });
    
    
    // Update function
    function update(delta){
        
        var prevPosition = {x: character.position.x, z: character.position.z}
        
        if(keys.right){ //Right
            character.position.x += movespeed*delta
            camera.position.x += movespeed*delta
        }
        if (keys.up){ //Up
            character.position.z += movespeed*delta
            camera.position.z += movespeed*delta
        }
        if (keys.left){ //Left
            character.position.x -= movespeed*delta
            camera.position.x -= movespeed*delta
        }
        if (keys.down){ //Down
            character.position.z -= movespeed*delta
            camera.position.z -= movespeed*delta
        }
        
        
        for(i = 0; i < fireBallsCount ; i++){
            if(i%2 == 0){
                if(evenFireBallsMovingLeft == false){
                    scene.getObjectByName("fireBall"+i,true).rotation.z += fireBallsRotaion;
                    scene.getObjectByName("fireBall"+i,true).position.x -= fireBallsIncrement;

                    if (parseInt(scene.getObjectByName("fireBall0",true).position.x) == -10){
                        evenFireBallsMovingLeft = true;
                        evenFireBallsMovingRight = false;
                    }
                } else {
                    scene.getObjectByName("fireBall"+i,true).rotation.z -= fireBallsRotaion;
                    scene.getObjectByName("fireBall"+i,true).position.x += fireBallsIncrement;
                    
                    if (parseInt(scene.getObjectByName("fireBall0",true).position.x) == 10){
                        evenFireBallsMovingLeft = false;
                        evenFireBallsMovingRight = true;
                    }
                }
            } else {
                if(oddFireBallsMovingLeft == false){
                    scene.getObjectByName("fireBall"+i,true).rotation.z -= fireBallsRotaion;
                    scene.getObjectByName("fireBall"+i,true).position.x += fireBallsIncrement;

                    if (parseInt(scene.getObjectByName("fireBall1",true).position.x) == 10){
                        oddFireBallsMovingLeft = true;
                        oddFireBallsMovingRight = false;
                    }
                } else {
                    scene.getObjectByName("fireBall"+i,true).rotation.z += fireBallsRotaion;
                    scene.getObjectByName("fireBall"+i,true).position.x -= fireBallsIncrement;

                    if (parseInt(scene.getObjectByName("fireBall1",true).position.x) == -10){
                        oddFireBallsMovingLeft = false;
                        oddFireBallsMovingRight = true;
                    }
                }
            }
        }
        
        // if moving
		//if(keys.up || keys.down || keys.left || keys.right){
            dead = false;
            isDead = false;
			character.updateMatrix()
			originPoint = character.position.clone()
			
			for(vertex=0 ; vertex < character.geometry.vertices.length ; vertex++){
				
				localVertex = character.geometry.vertices[vertex].clone()
				globalVertex = localVertex.applyMatrix4(character.matrix)
				direction = globalVertex.sub(character.position)
				
				ray = new THREE.Raycaster(originPoint, direction.clone().normalize())
				intersect = ray.intersectObjects(collider)
				
				if(intersect.length > 0 && intersect[0].distance < direction.length()){
                    //console.log(intersect[0])
                    for(i = 0; i < intersect.length; i++){
                        if(intersect[i].object.geometry instanceof THREE.SphereGeometry){
                            isDead = true;
                            //console.log("IS Dead")
                        }
                    }
                    if (isDead){
                        //console.log("Dead")
                        dead = true;
                        character.position.set(characterOrigianPosition.x, characterOrigianPosition.y, characterOrigianPosition.z);
                        camera.position.set(cameraOrigianPosition.x, cameraOrigianPosition.y, cameraOrigianPosition.z);
                    }else if(intersect[0].object.name == "frontWall") {
                        //console.log("Win")
                        character.position.x = prevPosition.x
                        character.position.z = prevPosition.z
                        camera.position.x = prevPosition.x
                        camera.position.z = prevPosition.z - 25
                        music.pause()
                        new Audio('audio/win.mp3').play();
                        freezCharacter = true;
                        document.getElementById("playAgain").style.display = "block"
                    }else {
                        //console.log("wall")
                        character.position.x = prevPosition.x
                        character.position.z = prevPosition.z
                        camera.position.x = prevPosition.x
                        camera.position.z = prevPosition.z - 25
                    }
                }
            }
            
            if(dead) {
                lives -= 1
                console.log(lives)
                document.getElementById("lives").innerHTML = lives
                if(lives == 0){
                    console.log("Game Over")
                    gameOver = true;
                    document.getElementById("gameOver").style.display = "block"
                }
            }
		//}
    }
    
    // Render
    function render() {        
        delta = clock.getDelta()
        if(!gameOver){
            if(!freezCharacter){
                update(delta)
                renderer.render(scene, camera);
                requestAnimationFrame(render);
            }
        } else {
            music.pause();
            new Audio('audio/lose.mp3').play();
            document.getElementById("gameOver").style.display = "block"
        }
        
        //track.update();
        
    }
    document.getElementById("output").appendChild(renderer.domElement);
    render();
};
window.onload = init;