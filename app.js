var express = require ("express");
var app = express();
var mon = require ("mongoose")
var bp = require("body-parser")
var me = require ("method-override")

mon
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://user:user@cluster0.xelap.mongodb.net/bookash?retryWrites=true&w=majority",
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

  var bo = new mon.Schema ({
      name: String,
      cover: String,
      author: String,
      year: Number,
      price: String,
      summary: String
      // comments:{
      //   comment: [{
      //     name: String,
      //     text: String,
      //     email: String
      //  }]
      // }
     

  })
   
var Book = mon.model ("Book", bo)


// Routes
// home
app.get("/", function(req, res){
  Book.find({}, function(err, bookArr){
    if(err){res.send("err")}
    else{    res.render("home", {bookArr: bookArr})
  }
  })
})

// add a book
//get create
app.get("/addbook", function(req, res){
  res.render("create");
})
//post route
app.post("/createbook", function(req, res){
  var newBook = req.body.book;
  Book.create(newBook, function(err, newBook){
    if (err){
      res.send("sorry error")
    }
    else{
      res.redirect ("/")
    }
  })
})
// show
app.get("/showbook/:id", function(req, res){
  Book.findById(req.params.id, function(err, book){
    if(err){res.send("error")}
    else{res.render("show", {book: book})}
  })
})


//edit routes
//get
app.get("/editbook/:id", function(req, res){
 var id = req.params.id;
 Book.findById(id, function(err, book){
   if(err){
     res.send("error")
   }
   else{
     res.render("edit", {id: id, book: book})
   }
 })
})

// put
app.put("/updatebook/:id", function(req, res){
  var id = req.params.id;
  var newBook = req.body.book;
  Book.findByIdAndUpdate(id, newBook, function(err, updated){
    if(err){
      res.send("error")
    }
    else{
      res.redirect("/showbook/" + id)
    }
  })
})

//delete route
app.delete("/deletebook/:id", function(req, res){
  var id = req.params.id;
Book.findByIdAndDelete(id, function(err){
  if(err){
    res.send("error")
  }
  else{
    res.redirect("/")
  }
})

})
  



  app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log("goodddd");
  })


