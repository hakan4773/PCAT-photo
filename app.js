//gerekli modüller
const express = require('express'); 
const mongoose = require('mongoose');
const ejs = require('ejs'); 
const fileUpload = require('express-fileupload');
const methodOverride=require("method-override");  //Post ve Get metodunu Put  metoduna çevirmek için 
const app = express();
const photoControllers=require("./controllers/photoControllers")
const pageControllers=require("./controllers/pageControllers")

//TEMPLATE ENGİNE
app.set('view engine', 'ejs');

mongoose
  .connect('mongodb://127.0.0.1:27017/pcat-test-db', {})
  .then(() => console.log('Mongo DB ye bağlandı.'))
  .catch((err) => console.error('Bağlantı başarısız.', err));

//MİDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method',{
  methods:['POST','GET']}))


//photo ROUTES
app.get('/',photoControllers.getAllPhotos);//tüm fotoğraflar
app.get('/photos/:id',photoControllers.getPhoto);  //ilgili fotoğraf
app.post('/photos', photoControllers.CreatePhoto); //fotoğraf oluştur
app.put('/photos/:id',photoControllers.UpdatePhoto); //fotoğrafı güncelle
app.delete("/photos/:id",photoControllers.DeletePhoto)//fotoğrafı sil

//page routes
app.get('/addPhoto', pageControllers.getAddPhoto);
app.get('/about', pageControllers.getAbout);//about sayfası
app.get("/photos/edit/:id",pageControllers.EditPage) //foto güncelleme sayfası

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
