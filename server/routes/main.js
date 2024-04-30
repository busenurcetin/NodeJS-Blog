const express = require("express");
const router = express.Router();
const Post = require("../models/Post");


/* Get Home */

router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});




// function insertPostData(){
//   Post.insertMany([
//     {
//       title: "Building blog",
//       body: "This is body text"
//     },
//     {
//       title: "Building blog",
//       body: "This is body text"
//     },
//     {
//       title: "Building blog",
//       body: "This is body text"
//     },
//     {
//       title: "Building blog",
//       body: "This is body text"
//     },
//     {
//       title: "Building blog",
//       body: "This is body text"
//     },
//     {
//       title: "Building blog",
//       body: "This is body text"
//     }
//   ])
// }

// insertPostData();


/* GET POST */


router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
      currentRoute: `/post/${slug}`
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


router.post("/search", async (req,res)=>{
  try{
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    let searchTerm= req.body.searchTerm;
    const searchNoSpeacialChar = searchTerm.replace(/[^a-zA-z0-9]/g, '');
    const data = await Post.find({
      $or:[
        {title: {$regex: new RegExp(searchNoSpeacialChar, "i")}},
        {body: {$regex: new RegExp(searchNoSpeacialChar, "i")}},
      ]
    });
    res.render("search",{
      data,
      locals, 
      currentRoute: '/search'
    });
  } catch(error){
    console.log(error);
  }
})


router.get("/about", (req,res)=>{
  res.render('about', {
    currentRoute: '/about'
  });
});

router.get("/contact", (req,res)=>{
  res.render('contact', {
    currentRoute: '/contact'
  });
});

module.exports = router;