//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

const itemsSchema={
  name:String

}
const Item=mongoose.model("Item",itemsSchema)

const Item1=new Item({
  name:"Eat Food"
})

const Item2=new Item({
  name:"Sleep"
})
const Item3=new Item({
  name:"Work  "
})

const defaultItems=[Item1,Item2,Item3];

async function insertItemsToDB(defaultItems) {
  try {
    await Item.insertMany(defaultItems);
    console.log("Added To DB");
  } catch (err) {
    console.error("Error:", err.message);
    // You might choose to rethrow the error or handle it differently based on your use case.
    throw err;
  }
}

insertItemsToDB(defaultItems)
  .then(() => {
    console.log("Insertion completed successfully.");
  })
  .catch((error) => {
    console.error("Error in insertion:", error.message);
  });


  async function findItemsInDB() {
    try {
      const foundItems = await Item.find({});
      console.log("DB:", foundItems);
    } catch (err) {
      console.error("Error:", err.message);
      // You might choose to rethrow the error or handle it differently based on your use case.
      throw err;
    }
  }
  
  // Usage
  findItemsInDB()
    .then(() => {
      console.log("Find operation completed successfully.");
    })
    .catch((error) => {
      console.error("Error in find operation:", error.message);
    });
    


app.get("/", function(req, res) {


  res.render("list", {listTitle:"Today", newListItems: items});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
