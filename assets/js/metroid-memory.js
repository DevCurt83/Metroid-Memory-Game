/* pic1 - missiles, pic2 - screw attack, pic3 - morph ball, pic4 - combat visor, pic5 - ped suit*/
let timerControl = false;
let flipControl = false;
let score = 0;
const pictures = {
  picture1: ["https://i.imgur.com/nG2oMZo.png", 1],
  picture2: ["https://i.imgur.com/R3NQCfM.png", 2],
  picture3: ["https://i.imgur.com/jgfyXkJ.png", 3],
  picture4: ["https://i.imgur.com/D2azNje.png", 4],
  picture5: ["https://i.imgur.com/KGiel9E.png", 5]
};
const dangerZone = new Howl({
          src: ['assets/Memory Game Sounds/danger.mp3']
}); 
const defeatEnemies = new Howl({
          src: ['assets/Memory Game Sounds/defeat enemies.mp3']
});
const doorsUnlocked = new Howl({
  src: ['assets/Memory Game Sounds/doors unlocked.mp3']
});
const outOfTime = new Howl({
  src: ['assets/Memory Game Sounds/game over.mp3']
}); 
const music = new Howl({
  src:['assets/Memory Game Sounds/brinstar green fade in.mp3'],
  volume: 0.5
})

const gameMessages = ["Well Done", "Nice Work", "keep it going", "Good", "Keep trying", "Try Again", "You Completed the Game!!" ];
//hold which img-container(div containing flippable imgs) was clicked
let thisPush = [];
//store chosen card box no.
let chosenCards = [];
//store chosen card src
let chosenCardSrc = [];

let cards = document.querySelectorAll('.img-container');


function flipCard() {
  if(flipControl) {
    this.classList.toggle('flip');
    this.removeEventListener('click', flipCard)
    thisPush.push(this);
    //determine which box- was clicked and push into an array
    chosenCards.push(this.children[0].classList[1]);
    chosenCardSrc.push(this.children[0].src);
    $(".game-popups").fadeTo(500,0.00);
  //compare the two chosen src's if array length equals 2
  if(chosenCardSrc.length == 2) {
    //if the two src's match I need the picture from pictures object to remain visible
    if(chosenCardSrc[0] == chosenCardSrc[1]) {
      console.log("Hello World");
      score++;
      console.log(score);
      //remove eventListener for the two matching cards that were chosen
      clickStop();
      clearArr();
      //choose random congratulating comment
      let commentChoice = Math.floor((Math.random() * 3));
      document.querySelector("#msg-text").textContent = gameMessages[commentChoice];
      $(".game-popups").fadeTo(100,1.00);
      $(".game-popups").css("visibility", "visible");
    }
    // if two cards do not match flip both back to original state
    if(chosenCardSrc.length == 2 && chosenCardSrc[0] !== chosenCardSrc[1]) {
      flipControl = false;
      thisPush[0].addEventListener('click', flipCard);
      thisPush[1].addEventListener('click', flipCard);
      setTimeout(cardMismatch, 500);
    }
  }
  }
}

function cardMismatch () {
  thisPush.forEach(function(egg){
         egg.classList.remove('flip');
         clearArr();
         flipControl = true;
      });
}



function clickStop() {
   thisPush[0].removeEventListener("click", flipCard);
   thisPush[1].removeEventListener("click", flipCard);
}

//--------------------------------- the fisher yates shuffle ------------------------
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;

}
var randomArry = shuffle(numbers);
setSelector();
//------------------------------------------------------------------------------------------------
function setSelector() {
     var objKey = 1;
     // iterate through array adding src and value from pictures object
   randomArry.forEach(function(num) { // original arry[arryIndex].forEach
    $(".box-" + num).attr({
        src: pictures['picture' + objKey][0],
        value: pictures['picture' + objKey][1]
   });
    //stop same picture from being added more than 4 times
    objKey += 1;
    if(objKey === 6) {
      objKey = 1;
    }
   });
}
//store player choices
let playerSelection = [];

//fadeIn picture on click
$(".img-container").on("click", function(){
  if(flipControl) {
  $(":nth-child(1)", this).fadeIn(500, function() {
    //push values into playerSelection array
     playerSelection.push($(this).attr("value"));
     playerSelection.push($(this).attr('class').split(/\s+/));

  //if 2 of the same values aren't chosen consecutively, re-hide the 2 pictures
  if(playerSelection.length === 4){
    if(playerSelection[0] !== playerSelection[2]) {
      //maybe on the right track but below doesnt work on 2nd thoughts
    $(playerSelection[1][1], playerSelection[3][1]).fadeOut(500, function() {
      playerSelection = [];
     });
   }
    }
  });
 }
});
const endOfGame = document.querySelectorAll(".end-game");
function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    let myLet = setInterval(countdown, 1000);
    

function countdown() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if(score === 10) {
          endOfGame[0].style.display = "flex";
          flipControl = false;
          stopCountdown();
          music.stop();
          doorsUnlocked.play();   
        }
        //warn player there not much time left
        if(timer === 20) {
          dangerZone.play();
          $("#time").css("color", "red");
        }
        //stop countdown when timer reaches 0 and offer chance to reset game
        console.log(timer);
        if (--timer < 0) {
           timer = duration;
           music.stop();
           outOfTime.play();
           stopCountdown();
           //get game over screen to pop up when time is up and all pairs aren't matched 
           if(score < 10){
             endOfGame[1].style.display = "flex";
             flipControl = false;
           }
        }
    }
    function stopCountdown() {
    clearInterval(myLet);
  }    
}

let level;
function init() {
  if(level !== undefined) {
    $("#game-rules").css("display", "none");
    flipControl = true;
    var levelSelect = 60 * level,
    display = document.querySelector('#time');
    startTimer(levelSelect, display);
    defeatEnemies.play();
    music.play();
    cards.forEach(card => card.addEventListener('click', flipCard));
}
  if(level === undefined) {

  }
};
function difficulty(int) {
    level = int;
    console.log(int);
}

//clear arrays function
function clearArr () {
         chosenCardSrc = [];
         chosenCards = [];
         thisPush = [];
         playerSelection = [];
}
function reset() {
    clearArr();  
    $(".img-container").removeClass("flip");
    score = 0;
    endOfGame[0].style.display = "none";
    endOfGame[1].style.display = "none";
    $("#game-rules").css("display", "flex");
    $("#time").css("color", "green");
    level = undefined;
    console.log(level);
    shuffle(numbers);
    setSelector();
}