import { gameObject } from "./classes/gameObject.js";
import { Pacman } from "./classes/pacman.js";
import { Food } from "./classes/food.js";
import { Cerezas } from "./classes/cerezas.js";
import {configGame} from "./constants.js";
import {ErrorPac} from "./classes/errorPac.js";
//0 -> pallcman, 1 -> roca, 2 -> food
/*
const map = [
  [0, 1, 1, 1],
  [2, 1, 1, 2],
  [2, 1, 1, 2],
  [1, 1, 1, 1]
];

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 2, 1],
  [1, 2, 1, 3, 2, 2, 1, 2, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 3, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 2, 1],
  [1, 2, 1, 2, 2, 3, 1, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 3, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
const ROWS = 10;
const COLUMNS = 10;
export const IMAGE_SIZE = 32;
export const WIDTH_CANVAS = IMAGE_SIZE * COLUMNS;
const HEIGHT_CANVAS = IMAGE_SIZE * ROWS;

const EXTRA_SIZE_HEIGHT=200;
 */
let imgRock;
let numberImagesLoaded = 0;
const arrRocks = [];

let imgCerezas;
const arrCerezas = [];


let imgFood;
const arrFood = [];

let imgPacmanLeft;
let imgPacmanRight, imgPacmanUp, imgPacmanDown, imgPacman;
let myPacman;
let wakaSound;
let timer = 0;
let startTimeGame = 0;
let endTimeGame = 0;

function preload() {
  imgRock = loadImage("../media/roca.png", handleImage, handleError);
  imgFood = loadImage("../media/food.png", handleImage, handleError);
  imgCerezas = loadImage("../media/cerezas.png", handleImage, handleError);
  imgPacman = loadImage("../media/pacLeft.png", handleImage, handleError);
  imgPacmanRight = loadImage("../media/pacRight.png", handleImage, handleError);
  imgPacmanUp = loadImage("../media/pacUp.png", handleImage, handleError);
  imgPacmanLeft = loadImage("../media/pacLeft.png", handleImage, handleError);
  imgPacmanDown = loadImage("../media/pacDown.png", handleImage, handleError);
  wakaSound = loadSound("../media/audio/WakaWaka.mp3");
}

  function handleError() {
  console.error("Error carregar alguna imatge");
  try {
    throw new ErrorPac(20, "Falta imatge per carregar");
  } catch (error) {
    console.error("Error carregar alguna imatge");
    showError();
  }
}

function handleImage() {
  console.error("Images carregada correctament");
  numberImagesLoaded++;
}

function setup() {
  createCanvas(configGame.WIDTH_CANVAS, configGame.HEIGHT_CANVAS + configGame.EXTRA_SIZE_HEIGHT).parent("sketch-pacman");
  for (let filaActual = 0; filaActual < configGame.ROWS; filaActual++) {
    for (let columnaActual = 0; columnaActual < configGame.COLUMNS; columnaActual++) {
      if (configGame.map[filaActual][columnaActual] === 1) {
        const roca = new gameObject(filaActual, columnaActual);
       // console.log("\n he creat una roca a posicio: fila -> " + filaActual + " columna -> " + columnaActual);
        arrRocks.push(roca);
      }
      else if (configGame.map[filaActual][columnaActual] === 2) {
        const food = new Food(filaActual, columnaActual);
      //  console.log("\n he craat una food a posicio: fila -> " + filaActual + " columna -> " + columnaActual);
        arrFood.push(food);
      }
      else if (configGame.map[filaActual][columnaActual] === 3) {
        myPacman = new Pacman(filaActual, columnaActual);
       // console.log("\n he craat una pacaman a posicio: fila -> " + filaActual + " columna -> " + columnaActual);
      }
      else if (configGame.map[filaActual][columnaActual] === 4) {
        const cerezas = new Cerezas(filaActual, columnaActual);
        arrCerezas.push(cerezas);
      }
      else {
        //Error objecte no defini

      }
    } // fi for columnes
  } // fi for files
  console.log("array rocks mida es : ", arrRocks.length);
  console.log("array foods mida es : ", arrFood.length);
startTimeGame = millis();
} // fi setup

function draw() {
  background(171, 248, 168);
  // arrRocks.forEach((roca) => roca.showObject(imgRock));
  //Pintem roques
  for (let i = 0; i < arrRocks.length; i++) {
    arrRocks[i].showObject(imgRock);
  }

  //Pintem food
  for (let i = 0; i < arrFood.length; i++) {
    arrFood[i].showObject(imgFood);
  }

  for (let i = 0; i < arrCerezas.length; i++) {
    arrCerezas[i].showObject(imgCerezas);
  }

  //comprovar colisions pacman amb roques
  for (let i = 0; i < arrRocks.length; i++) {
    myPacman.testCollideRock ( arrRocks[i]);
  }

//comprovar colisions pacman amb food
  for (let i = 0; i < arrFood.length; i++) {
    let resultTest = myPacman.testCollideFood(arrFood[i]);
    if (resultTest) {
      myPacman.scorePacman = myPacman.scorePacman + arrFood[i].pointsFood;
      arrFood.splice(i, 1);
    }
  }


  //pINTEM ScoreBoard
 // textFont(font);
  textSize(20);
  textAlign(CENTER, CENTER);
  timer = parseInt( millis() - startTimeGame);
  text("Score: " + myPacman.scorePacman, 150, configGame.HEIGHT_CANVAS + 50);
//   text("Score: " + myPacman.scorePacman, 150, HEIGHT_CANVAS + 50);
  text("Time: " + timer, 150, configGame.HEIGHT_CANVAS + 100);
  //Pintem pacman
  //myPacman.showObject(imgPacman);
  switch(myPacman.directionPacman){
    case 1: //Move right
            myPacman.showObject(imgPacmanRight);
            break;
    case 2: //Move up
            myPacman.showObject(imgPacmanUp);
            break;
    case 3: //Move left
            myPacman.showObject(imgPacmanLeft);
            break
    case 4: //Move down
            myPacman.showObject(imgPacmanDown);
            break;
    default : myPacman.showObject(imgPacman);

  }
  testFinishGame();
  // wakaSound.play();
} // fi draw

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    console.log("Dreta");
    myPacman.moveRight();
  } else if (keyCode === LEFT_ARROW) {
    console.log("Esquerra");
    myPacman.moveLeft();
  } else if (keyCode === UP_ARROW) {
    console.log("Amunt");
    myPacman.moveUp();
  } else if (keyCode === DOWN_ARROW) {
    console.log("Abaix");
    myPacman.moveDown();
  } else {
    console.log("Error, tecla no reconeguda");
    let error = new ErrorPac(101, "Press a valid key");
    error.toString();
  }
}

function showError(){
  let errorImage = new ErrorPac(105, "Error 2loading image");
  errorImage.toString();
  const parent = document.getElementById("error-holder");
  const node = document.createElement("media");
  node.setAttribute("src", "./media/tristesa.webp");
  node.setAttribute("alt", "Imatge Error");
  node.setAttribute("width", 300);
  node.setAttribute("height", 300);

  parent.appendChild(node);
  noLoop();
  remove();
}

function testFinishGame(){
  if (arrFood.length === 0){
    //Fi del joc
    noLoop();
    let theconfirm =confirm("Fi del joc, has guanyat. Desitja jugar una altra partida ?");
    loop`();`
    if( theconfirm)
    {
      restartGame();
    }
    else {
      alert("Gracies per jugar");
    }
    loop();
  }/*
  else if {
    //test if loose game
  }
  else {
    //continume
  }*/
}
/*globalThis: globalThis object. This is done to ensure
that the p5.js library can call these functions when needed.
 */
globalThis.setup = setup;
globalThis.draw = draw;
globalThis.preload = preload;
globalThis.keyPressed = keyPressed;
