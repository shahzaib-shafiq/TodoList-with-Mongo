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

//MongoDb  Schema

const itemsSchema={
  name:String

}
//MongoDb Model 

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

// Asynchronous function to find all items in the database
async function findItemsInDB() {
  try {
    const foundItems = await Item.find({});

    return foundItems;
  } catch (err) {
    console.error("Error:", err.message);
    // You might choose to rethrow the error or handle it differently based on your use case.
    throw err;
  }
}

app.get("/", async function(req, res) {
  try {
    const foundItems = await findItemsInDB();
    if (foundItems.length===0)
    {
      insertItemsToDB(defaultItems)
      .then(() => {
        console.log("Insertion completed successfully.");
      })
      .catch((error) => {
        console.error("Error in insertion:", error.message);
      });
        res.redirect("/")
    }
    else
    {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
      console.log("Find operation completed successfully.");
    }
  } catch (error) {
    console.error("Error in find operation:", error.message);

    // Handle the error appropriately, e.g., show an error page.
    res.status(500).send("Error in finding items.");
  }
});
app.post("/", function(req, res){


  const itemName = req.body.newItem;
  const newItem=Item({
    name:itemName
  })
  newItem.save();
  res.redirect("/");

  });


  app.post("/delete",function(req,res){
  const checkboxItemId= req.body.checkbox;
  Item.findByIdAndRemove(checkboxItemId)
  .then(() => {
    console.log("Deleted");
  })
  .catch((err) => {
    console.error("Error in find operation:", err.message);
  });

res.redirect("/");

  })


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
