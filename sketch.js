//general
let tileScale = 2;
let isStartRecording = false, isStopRecording = false, startFrame = 0;
let moves = [], isComplete = false;
let hasStarted = false, level = 0;
let rewindCount = 0;
let lastPlayed = 0;

//assets
let player, playerSprite, inAir = false;
let clone;
let entrance, exit;
let stone, floor;
let button, door, isPressed = false;
let ground;

//common
function updatePlayer() {
  if (isStartRecording && !isStopRecording && !isComplete) {
    moves.push([player.x, player.y]);
  }

  for (let i = 0; i < ground.length; i++) {
    if (player.collides(ground[i])) {
        inAir = false;
    }
  }

  if (kb.presses('space') && !inAir) {
    player.ani = "jump";
    playerJumping.play();
    player.vel.y = -4.5 * tileScale;
    inAir = true;
	}

  if (kb.pressing('left')) {
		player.ani = "run";
    if (millis() - lastPlayed > 300) {
      playerRunning.play();
      lastPlayed = millis();
    }

		player.vel.x = -3.5 * tileScale;
		player.mirror.x = true;
    return;
	} else if (kb.pressing('right')) {
		player.ani = "run";
    if (millis() - lastPlayed > 300) {
      playerRunning.play();
      lastPlayed = millis();
    }

		player.vel.x = 3.5 * tileScale;
		player.mirror.x = false;
    return;
  }

  player.ani = "idle";
  player.vel.x = 0;
}

async function startLevel() {
  await sleep(1000);

  entrance.ani = "open";
  openingDoor.play();
  await sleep(300);
  
  entrance.ani.frame = 5;
  player.visible = true;

  entrance.ani = "close";
  openingDoor.play();
  await sleep(180);

  entrance.ani = "idle";

  isStartRecording = true;
}

async function checkExit() {
  if (player.overlapping(exit) == 30) {
    exit.ani = "open";
    openingDoor.play();
    await sleep(300);
    
    exit.ani.frame = 5;
    player.visible = false;
    player.pos = {x: -canvas.w, y: -canvas.h};

    exit.ani = "close";
    openingDoor.play();
    await sleep(180);
    
    exit.ani = "idle";

    isStopRecording = true;
    isComplete = true;
    moves = [];
  }
}

function checkReset() {
  if (kb.presses("Backspace") && !isStopRecording && rewindCount != 0) {
    isStopRecording = true;
    rewindCount--;

    rewinding.play();
    player.pos = {x: canvas.w / 4, y: canvas.h - 28 * tileScale - player.h};
  }
}

function playClone() {
  if (frameCount - startFrame < moves.length) {
    clone.pos = {x: moves[frameCount - startFrame][0], y: moves[frameCount - startFrame][1]};
  } else {
    clone.collider = "dynamic";
  }
}

function showRewinds() {
  textSize(50 * tileScale);
  stroke(245, 201, 7);
  strokeWeight(1.5 * tileScale);
  noFill();
  textFont("Cinzel Decorative");
  text("Rewinds Left: " + rewindCount, 230 * tileScale, 35 * tileScale);
}

//levels
function loadStartMenu() {
  isComplete = false;
  isStartRecording = false;
  isStopRecording = false;

  //title
  textSize(100 * tileScale);
  stroke(245, 201, 7);
  noFill();
  strokeWeight(3 * tileScale);
  textFont("Cinzel Decorative");
  text("Time Knight", canvas.w / 2, canvas.h / 3);
  
  //start
  fill(69, 53, 50);
  strokeWeight(1 * tileScale);
  rect(canvas.w / 2, canvas.h * 2/3, canvas.w / 4, canvas.w / 8, 20);
  fill(245, 201, 7);
  textSize(50 * tileScale);
  text("START", canvas.w / 2, canvas.h * 2/3);

  if (mouseIsPressed == true &&
      mouseX <= canvas.w / 2 + canvas.w / 8 && mouseX >= canvas.w / 2 - canvas.w / 8 &&
      mouseY <= canvas.h * 2/3 + canvas.w / 16 && mouseY >= canvas.h * 2/3 - canvas.w / 16) {
    starting.play();
    hasStarted = true;
    loadLevel1();
  }
}

function loadLevel1() {
  isComplete = false;
  isStartRecording = false;
  isStopRecording = false;
  level = 1;
  rewindCount = 0;

  floor = new Tiles(
    [
      "                           ===========",
      "                          =============",
      "                         ===============",
      "                        =================",
      "                       ===================",
      "                      =====================",
      "                     =======================",
      "==============================================================="
    ],
    0, canvas.h - (16 * 7 + 8) * tileScale,
    16 * tileScale, 16 * tileScale
  );

  exit.pos = {x: canvas.w * 3/4, y: canvas.h - 45 * tileScale};
  entrance.pos = {x: canvas.w / 4, y: canvas.h - 45 * tileScale};

  player.pos = {x: canvas.w / 4, y: canvas.h - 28 * tileScale};
  player.visible = false;

  startLevel();
}

function clearLevel1() {
  stone.removeAll();
  player.pos = {x: -canvas.w, y:-canvas.h};
  clone.pos = {x: -canvas.w, y:-canvas.h};
  entrance.pos = {x: -canvas.w, y:-canvas.h};
  exit.pos = {x: -canvas.w, y:-canvas.h};
}

function loadLevel2() {
  isComplete = false;
  isStartRecording = false;
  isStopRecording = false;
  level = 2;
  rewindCount = 1;

  new Tiles(
    [
      "                           =",
      "                          ==",
      "                         ===",
      "                        ====",
      "                       =====",
      "==============================================================="
    ],
    0, canvas.h - (16 * 5 + 8) * tileScale,
    16 * tileScale, 16 * tileScale
  );

  exit.pos = {x: canvas.w * 3/4, y: canvas.h - 45 * tileScale};
  entrance.pos = {x: canvas.w / 4, y: canvas.h - 45 * tileScale};

  player.pos = {x: canvas.w / 4, y: canvas.h - 28 * tileScale};
  player.visible = false;

  door.pos = {x: canvas.w * 17/24, y: canvas.h - 43 * tileScale};
  button.pos = {x: canvas.w / 2, y: canvas.h - 20 * tileScale};
  isPressed = false;

  startLevel();
}

function clearLevel2() {
  stone.removeAll();
  door.pos = {x: -canvas.w, y:-canvas.h};
  button.pos = {x: -canvas.w, y:-canvas.h};
  player.pos = {x: -canvas.w, y:-canvas.h};
  clone.pos = {x: -canvas.w, y:-canvas.h};
  entrance.pos = {x: -canvas.w, y:-canvas.h};
  exit.pos = {x: -canvas.w, y:-canvas.h};
}

function loadEndMenu() {
  //title
  textSize(70 * tileScale);
  stroke(245, 201, 7);
  strokeWeight(2.5 * tileScale);
  textFont("Cinzel Decorative");
  text("To be Continued...", canvas.w / 2, canvas.h / 2);
}

function checkButton() {
  if (level == 2) {
    if (player.colliding(button) > 0 || clone.colliding(button) > 0) {
      if (!isPressed) {
        pressingButton.play();
      }
      
      isPressed = true;
      button.ani.scale.y = tileScale;
      door.moveTowards({x: canvas.w * 17/24, y: canvas.h + 43 * tileScale}, 0.1);
    } else {
      if (isPressed) {
        pressingButton.play();
      }
      
      isPressed = false;
      button.ani.scale.y = tileScale * 2;
      door.moveTowards({x: canvas.w * 17/24, y: canvas.h - 43 * tileScale}, 0.1);
    }
  }
}

//main
function preload() {
  playerIdle = loadAni("Player Idle (78x58).png", {frameSize: [78, 58], frames: 11});
  playerJump = loadAni("Player Jump (78x58).png", {frameSize: [78, 58], frames: 1});
  playerRun = loadAni("Player Run (78x58).png", {frameSize: [78, 58], frames: 8});
  doorIdle = loadAni("Door Idle (46x56).png", {frameSize: [46, 56], frames: 1});
  doorOpen = loadAni("Door Opening (46x56).png", {frameSize: [46, 56], frames: 5});
  doorClose = loadAni("Door Closing (46x56).png", {frameSize: [46, 56], frames: 3});
  floorTile = loadImage("Floor.png");
  buttonTile = loadImage("Button.png");
  doorTile = loadImage("Door.png");

  bgm = loadSound("BGM.wav");
  playerRunning = loadSound("Player Walk.wav");
  playerJumping = loadSound("Player Jump.wav");
  pressingButton = loadSound("Press Button.wav");
  openingDoor = loadSound("Door Open.wav");
  starting = loadSound("Starting.wav");
  rewinding = loadSound("Rewinding.wav");
}

function loadAssets() {
  //set up player
  player = new Sprite(-canvas.w, -canvas.h, 37, 24, "dynamic");
  player.rotationLock = true;
  player.addAni("idle", playerIdle);
  player.addAni("jump", playerJump);
  player.addAni("run", playerRun);
  player.anis.offset = {x: 12, y: -1};
  player.layer = 2;
  player.friction = 0;
  player.scale = tileScale;
  player.bounciness = 0;
  
  //setup clone
  clone = new Sprite(-canvas.w, -canvas.h, 37, 24, "kinematic");
  clone.rotationLock = true;
  clone.addAni("idle", playerIdle);
  clone.anis.offset = {x: 12, y: -1};
  clone.layer = 2;
  clone.friction = 0;
  clone.visible = false;
  clone.scale = tileScale;
  clone.bounciness = 0;
  
  //setup entrance
  entrance = new Sprite();
  entrance.pos = {x: -canvas.w, y: -canvas.h};
  entrance.collider = "none";
  entrance.layer = 1;
  entrance.anis.offset.y = -1;
  entrance.addAni("open", doorOpen);
  entrance.addAni("close", doorClose);
  entrance.addAni("idle", doorIdle);
  entrance.scale = tileScale;
  
  //setup exit
  exit = new Sprite();
  exit.pos = {x: -canvas.w, y: -canvas.h};
  exit.layer = 1;
  exit.collider = "kinematic";
  exit.anis.offset.y = -1;
  exit.addAni("open", doorOpen);
  exit.addAni("close", doorClose);
  exit.addAni("idle", doorIdle);
  exit.scale = tileScale;

  //setup stone tile
  stone = new Group();
  stone.w = 16 * tileScale;
  stone.h = 16;
  stone.tile = "=";
  stone.collider = "static";
  stone.img = floorTile;
  stone.scale = tileScale;

  //setup button
  button = new Sprite(-canvas.w, -canvas.h, 16, 4, "kinematic");
  button.layer = 1;
  button.anis.offset = {x: 1, y: -6};
  button.img = buttonTile;
  button.scale = tileScale;
  button.scale.y *= 2;
  button.bounciness = 0;

  //setup door
  door = new Sprite(-canvas.w, -canvas.h, 5, 18, "kinematic");
  door.layer = 1;
  door.anis.offset = {x: 5, y: -1};
  door.img = doorTile;
  door.scale = tileScale * 2;
  door.scale.y *= 2;

  ground = new Array();
  ground.push(stone, button, player, clone);
}

function setup() {
  new Canvas("16:9");
  tileScale = canvas.w / 1000;
  world.gravity.y = 15 * tileScale;
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  
  loadAssets();
  bgm.loop();
}

function draw() {
  clear();
  background(34, 12, 13);
  
  if (!hasStarted) {
    loadStartMenu();
  } else {
    if (isComplete == true) {
      if (level == 1) {
        clearLevel1();
        loadLevel2();
      } else if (level == 2) {
        clearLevel2();
        loadEndMenu();
      }
    } else {
      checkReset();
  
      if (isStartRecording && isStopRecording && !isComplete) {
        if (startFrame == 0) {
          startFrame = frameCount;
          clone.visible = true;
        }
  
        playClone();
      }
  
      updatePlayer();
  
      checkButton();
    
      checkExit();

      showRewinds();
    }
  }
}