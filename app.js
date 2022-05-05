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


var co = new mon.Schema({
  bookid: String,
  name: String,
  email: String,
  text: String
})
var Comment = mon.model ("Comment", co)
  var bo = new mon.Schema ({
      name: String,
      cover: String,
      author: String,
      year: Number,
      price: String,
      summary: String,
      comments: [co]
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


// create a comment
app.post("/createcomment/:id", function(req, res){
  var com = req.body.comment
  var id = req.params.id
  com.bookid = id
  Comment.create(com, function(err, newCom){
    if(err){res.send("error")}
    else{
      Book.findByIdAndUpdate(id, {comments:newCom}, function(err2, found){
        if(err){ res.send("error")}
        else{ res.redirect("/showbook/"+ id)}
      })


    }
  })
})


// show
app.get("/showbook/:id", function(req, res){
  Book.findById(req.params.id, function(err, book){
    if(err){res.send("error")}
    else{
      res.render("show", {book: book})}
  })
})

// comments index
app.get("/commentsindex/:id", function(req,res){
  var id = req.params.id
  Book.findById(id, function(err, found){
    if(err){res.send("error")}
    else{
      res.render("commentsindex", {commentsarr: found.comments})
    }
  })
})

// edit comment
app.get("/editcomment/:id", function(req,res){
  var id = req.params.id
  Comment.findById(id, function(err, foundcomment){
    if(err){res.send("error")}
    else{
      console.log(foundcomment.email)
      res.render("editcomment", {comment: foundcomment})}
    
  })
})

app.put("/editcomment/:id", function(req, res){
  var id = req.params.id
  var updatedC = req.body.comment
  Comment.findByIdAndUpdate(id, updatedC, function(err, edited){
    if(err){res.send("error")}
else{
  Book.findByIdAndUpdate (edited.bookid, {comments:edited}, function(err2, updatebook){
    if(err2){res.send("error")}
    else{
      res.redirect("/showbook/"+ edited.bookid)
    }
  })
}
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


