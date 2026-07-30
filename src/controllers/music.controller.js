const musicModel = require('../models/music.model');
const jwt = require('jsonwebtoken');
const {uploadFile} = require('../services/storage.services');

async function createMusic(req,res){

    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    try{
         const decoded = jwt.verify(token,process.env.JWT_SECRET);
         if(decoded.role !== 'artist'){
            return res.status(403).json({message:" you don't have permission to create music"});
         }
   

        const{title}= req.body;
        const file = req.file;

        const result = await uploadFile(file.buffer.toString('base64'));  

        const music = await musicModel.create({
            uri:result.url,
            title,
            artist:decoded.id 
        })

        res.status(201).json({message:'Music created successfully',music:{
            id:music._id,
            title:music.title,
            uri:music.uri,
            artist:music.artist
        }})


    }
    catch(error){
        console.log(error);
        return res.status(401).json({message:'Unauthorized'});
    } 

}
module.exports = {createMusic};