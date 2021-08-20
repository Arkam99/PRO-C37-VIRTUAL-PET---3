var dog, happyDog, database, foodS, foodStock;
var happyDogImg, hungryDogImg;
var feedTime,lastFeed,foodObj,feed,addFood;
var changeState,readState,gameState = 0;
var bedroom,garden,washroom;


function preload()
{
	happyDogImg = loadImage("images/dogImg.png");
  hungryDogImg = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/BedRoom.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/WashRoom.png");

}

function setup() {
  database = firebase.database();
	createCanvas(1000 ,500);
  foodObj = new Food();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function (data){
    lastFeed = data.val();
  });
  stock = database.ref('Food');
  stock.on("value",readStock)

  readState = database.ref('gameState');
  readState.on("value",function (data){
    gameState = data.val();
  });

  

  dog = createSprite(900,250,1,1);
  dog.addImage(happyDogImg);
  dog.scale=0.2;

  addFood=createButton("Add Food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);

  food=createButton("Feed the Dog");
  food.position(800,95);
  food.mousePressed(feedDog);
}


function draw() {  
background(46, 139, 87); 
fill("white");

foodObj.display();

fill(255,255,254);
textSize(15);

if(lastFeed>=12){
  lastFeed = lastFeed%12;
    text("Last Feed : "+lastFeed+" PM",650,50);
}else if(lastFeed==0){
    text("Last Feed : 12 AM",650,50);
}else{
  text("Last Feed : "+lastFeed+" AM",650,50);
}
 // console.log(gameState);
  if(gameState!="hungry"){
    food.hide();
    addFood.hide();
    dog.remove();
  }else{
    food.show();
    addFood.show();
    dog.addImage(hungryDogImg);
  }

//console.log("lf"+lastFeed);
  curruntTime = hour()%12;
//  console.log("ct"+curruntTime);
  if(curruntTime==(lastFeed+1)){
    update("playing");
    foodObj.garden();
  }else if(curruntTime==(lastFeed+2)){
    update("sleeping");
    foodObj.bedroom();
  }else if(curruntTime>(lastFeed+2) && curruntTime<=(lastFeed+4)){
    update("bathing");
    foodObj.washroom();
  }else{
    update("hungry");
    foodObj.display();
  }

drawSprites();


}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
    dog.addImage(hungryDogImg);

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime:lastFeed+1
  })
}

function addFoods(){
  foodS++;
database.ref('/').update({
  Food:foodS
})
}
function update(state){
    database.ref('/').update({
      database:state
    });

  }
