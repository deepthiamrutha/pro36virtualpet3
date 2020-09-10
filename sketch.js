// CREATE ALL THE VARIABLES
var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState,back,milk;
var Lastfeed;
function preload(){
  //LOADING ALL THE IMAGES 
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
garden=loadImage("Garden.png");
washroom=loadImage("Wash Room.png");
bedroom=loadImage("Bed Room.png");

}

function setup() {
  database=firebase.database();
  createCanvas(800,600);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(500,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.30;
  
  feed=createButton("Feed the dog");
  feed.position(500,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(600,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  // background(back);
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
    if(currentTime>(lastFed+5)){
      dog.addImage(sadDog);
    }
    dog.visible=true;
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
    dog.visible=false;
   }else{
    feed.show();
    addFood.show();
  dog.visible=true;
   }
   var feedTime=database.ref('FeedTime');
   feedTime.on("value",function(data){
     Lastfeed=data.val();
   })
    foodObj.display();
   textSize(30);
   fill("pink");
   if(Lastfeed>=12){
     text("last Fed :"+Lastfeed%12+"pm",300,550);
   }
   else if(Lastfeed===0){
     text("last Fed : 12am",500,450);
   }
   else{
     text("last Fed :"+Lastfeed+"pm",300,550);
   }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
