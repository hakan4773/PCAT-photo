const Photo=require("../models/Photo")

exports.getAbout = (req, res) => { //about sayfası
    res.render('about');
  }
  exports.getAddPhoto= (req, res) => {  //addPhoto sayfası
    res.render('addPhoto');
  }

  exports.EditPage= async (req,res)=>{
    const photo = await Photo.findById(req.params.id);
    res.render("edit",{photo})
  }