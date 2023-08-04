const express = require("express");

const postModule = require("./posts-model");

const router = express.Router();

router.get('/api/posts',(req,res)=>{
    postModule.find(req.body)
    .then( posts => {
     res.status(200).json(posts);
    })
    .catch( error => {
     console.log(error);
     res.status(500).json({
        message:"The posts information could not be retrieved"
     })
    })
});

router.get('/api/posts/:id',(req,res)=>{
    postModule.findById(req.params.id)
    .then(post=>{
        if(post){ 
            res.status(200).json(post);
        } else{
            res.status(404).json({
                message:"The post with the specified ID does not exist"
            })
        }
    })
    .catch(error=>{
        res.status(500).json({
            message:"The post information could not be retrieved"
        })
    })
});

router.post('/api/posts',(req,res)=>{
    const {title, contents} = req.body;
    if(!title || !contents){
        res.status(400).json({
            message:"Please provide title and contents for the post"
        })
    } else {
        postModule.insert({title, contents})
        .then(({id}) => {
            return postModule.findById(id)
        })
        .then( post => {
        res.status(201).json(post)
        })
        .catch(err => {
         res.status(500).json({
            message:"There was an error while saving the post to the database"
         })
        })
    }
});

router.delete('/api/posts/:id', async (req,res)=>{
    try{
        const getPostbyId = await postModule.findById(req.params.id)
        if(!getPostbyId){
            res.status(404).json({
                message:'The post with specified ID does not exist'
            })
        }else{
           await postModule.remove(req.params.id)
           res.json(getPostbyId)
        }
    } catch(err){
        res.status(500).json({
            message:'The post could not be removed',
            err: err.message,
            stack: err.stack
        })
    }
});

router.put('/api/posts/:id',(req,res)=>{
    const {title, contents} = req.body;
    if(!title || !contents){
        res.status(400).json({
            message:'Please provide title and contents for the post'
        })
    }else{
       postModule.findById(req.params.id)
       .then( post =>{
        if(!post){
            res.status(404).json({
                message:'The post with the specified ID does not exist'
            })
        }else{
            return postModule.update(req.params.id, req.body)
        }})
        .then( data =>{
          if(data){
            return postModule.findById(req.params.id)
          }
        })
        .then( post=>{
         if(post){
            res.json(post)
         }
        })
        .catch(err =>{
        res.status(500).json({
            message:'The post information could not be modified',
            err: err.message,
            stack: err.stack
        })
       })
    }
});

router.get('/api/posts/:id/comments', async (req,res)=>{
try{
  const post = postModule.findById(req.params.id)
  if(post){
    const Messages = await postModule.findPostComments(req.params.id)
    res.status(200).json(Messages)
  } else{
    res.status(404).json({mesage:"The post with the specified ID does not exist"})
  }

} catch(err){
    res.status(500).json({
        message:'The comments information could not be retrived',
        err: err.message,
        stack: err.stack
    })
}
})

module.exports = router;
