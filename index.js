const express= require("express");
const app= express();

const port=process.env.PORT || 9000;

app.get("/",(req,res)=> {
    res.redirect("/posts");
});

const path= require("path");
const{v4: uuidv4}=require('uuid');
uuidv4();
const methodOverride= require("method-override");


app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

let posts=[
    {
        id: uuidv4(),
        username:"SolitudeWriter",
        content:"Life has a strange way of teaching us things. Sometimes the people we thought would stay forever leave without notice, and sometimes the smallest decisions end up changing everything. What I’ve learned is that nothing is permanent — not happiness, not pain. The only thing we can do is make the most of the present moment"
    },

     {
        id: uuidv4(),
        username:"WordsUnfold",
        content:"In college, most of us are just trying to figure out who we are and what we want. Don’t feel bad if you don’t have everything planned. Your 20s are meant for experimenting, failing, and learning. What really matters is building skills, confidence, and the courage to take risks when the opportunity comes"
    },

    {
        id: uuidv4(),
        username:"TruthSeeker",
        content:"Stop comparing your chapter 2 with someone else’s chapter 20. Growth is not a race, it’s a journey. Some people bloom early, others later, but every flower has its own season. Trust your pace and keep moving forward"
    },
];

app.get("/posts",(req,res)=>{
    res.render("index",{posts});
});

app.get("/posts/new",(req,res)=>{
    res.render("new");
});

app.post("/posts",(req,res)=>{
    let{username,content}=req.body;
    let id= uuidv4();
    posts.push({id,username,content})
    res.redirect("/posts");
});

app.get("/posts/:id",(req,res)=>{
    let {id}= req.params;
    let post= posts.find((p)=> id === p.id);
    res.render("show.ejs",{post});
})

app.patch("/posts/:id",(req,res)=>{
    let{id}=req.params;
    let newcontent= req.body.content;
  let post= posts.find((p)=> id === p.id);
  post.content= newcontent;
    res.redirect("/posts");
});



app.get("/posts/:id/edit",(req,res)=>{
    let{id}= req.params;
    let post=posts.find((p)=> id=== p.id);
    res.render("edit.ejs",{post});
})

app.delete("/posts/:id",(req,res)=>{
     let{id}= req.params;
     posts=posts.filter((p)=> id!== p.id);
     res.redirect("/posts");

});


app.post("/posts/:id/like", (req, res) => {
    let { id } = req.params;
    let post = posts.find(p => p.id === id);
    if (post) {
        post.likes = (post.likes || 0) + 1;
    }
    res.redirect("/posts");
});


app.post("/posts/:id/comment", (req, res) => {
    let { id } = req.params;
    let { comment } = req.body;
    let post = posts.find(p => p.id === id);
    if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push(comment);
    }
    res.redirect("/posts");
});


app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})
