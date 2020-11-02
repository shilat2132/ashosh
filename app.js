var express = require ("express");
var app = express();
var mon = require ("mongoose")
var bp = require("body-parser")
var me = require ("method-override")

mon
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://user:user@cluster0.xelap.mongodb.net/bake?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to DB!"))
  .catch((error) => console.log(error.message));

  app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bp.urlencoded({ extended: true }));
app.use(me("_method"));

  var ca = new mon.Schema ({
    category: String,
      name: String,
      img: String ,
      price: Number,
      condition: String

  })
   
var Cake = mon.model ("Cake", ca)

var or = new mon.Schema({
  name: String, 
  phone: Number,
  shopping: String,
  delivery: String,
  address: String ,
  notes: String ,
  date: { type: Date, default: Date.now }
})

var Order = mon.model("Order", or)

//orders routes
//get orders index
app.get("/orders/index", function(req, res){
  Order.find({}, function(err, arr){
    if(err){
      res.send("error")
    }
    else{
      res.render("orders", {arr: arr})
    }
  })
})

app.delete("/orders/index/delete/:id", function(req, res){
var id = req.params.id;
Order.findByIdAndDelete(id, function(err){
  if (err){
    res.send("error")
  }
  else{
    res.redirect("/orders/index")
  }
})
})

//create order
app.post("/:index/show/:id/order", function(req, res){
  var id = req.params.id;
  var index = req.params.index;
  var newOrder = req.body.order;
  Order.create(newOrder, function(err, newOrder){
    if(err){
      res.send("error")
    }
    else{
      res.redirect("/"+ index + "/show/"+ id)
    }
  })
})

// Routes
// home
app.get("/", function(req, res){
    res.render("home")
})

// add a cake
//get create
app.get("/:index/create", function(req, res){
  var index = req.params.index;
  res.render("create", {index:index});
})
//post route
app.post("/:index/create", function(req, res){
  var newCake = req.body.cake;
  var index = req.params.index;
  Cake.create(newCake, function(err, newCake){
    if (err){
      res.send("sorry error")
    }
    else{
      res.redirect ("/"+ index)
    }
  })
})

//show route
app.get("/:index/show/:id", function(req, res){
  var id = req.params.id;
  var index = req.params.index;
  Cake.findById(id, function(err, food){
    Cake.find({category: index}, function(err1, arr){
    if(err || err1){
      res.send("error")
    }
    else{
      res.render("show", {id: id, food: food, index:index, arr: arr})
    }
  })
  })
})



//edit routes
//get
app.get("/:index/edit/:id", function(req, res){
 var id = req.params.id;
 var index = req.params.index;
 Cake.findById(id, function(err, food){
   if(err){
     res.send("error")
   }
   else{
     res.render("edit", {id: id, food: food, index: index})
   }
 })
})

// put
app.put("/:index/edit/:id", function(req, res){
  var id = req.params.id;
  var newFood = req.body.cake;
  var index = req.params.index;
  Cake.findByIdAndUpdate(id, newFood, function(err, updated){
    if(err){
      res.send("error")
    }
    else{
      res.redirect("/"+ index + "/show/" + id)
    }
  })
})

//delete route
app.delete("/:index/delete/:id", function(req, res){
  var id = req.params.id;
  var index = req.params.index;
Cake.findByIdAndDelete(id, function(err){
  if(err){
    res.send("error")
  }
  else{
    res.redirect("/"+ index)
  }
})

})
  




// index
app.get("/:index", function(req, res){
  var index = req.params.index
Cake.find({category: index}, function(err, catArr){
  if (err){
    res.send("error")
  }
  else{
  res.render ("index", {index: index, catArr: catArr})

  }
})
})


  app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log("goodddd");
  })


