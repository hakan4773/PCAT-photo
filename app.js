//gerekli modüller
const express = require('express'); 
const mongoose = require('mongoose');
const ejs = require('ejs'); 
const fileUpload = require('express-fileupload');
const methodOverride=require("method-override");  //Post metodunu Put metoduuna çevirmek için 
const Photo = require('./models/Photo');
const app = express();
const fs=require("fs");
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
app.use(methodOverride('_method'))
//ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort("-dateCreated");//veritabanından verileri getir tarih sırasına göre yerleştir
  res.render('index', { photos });
});

app.get('/photos/:id', async (req, res) => { //ilgili fotoğrafın id'sine göre detaylarına git
  //console.log(req.params.id)
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
});


app.get('/about', (req, res) => { //about sayfası
  res.render('about');
});

app.get('/addPhoto', (req, res) => {  //addPhoto sayfası
  res.render('addPhoto');
});


app.post('/photos', async (req, res) => {
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) { //Klasör var mı kontrol et yoksa oluştur.
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {

    let uploadImage = req.files.image;
    let uploadPath = __dirname + '/public/uploads/' + uploadImage.name;

    // Dosya yükleme işlemi
    await uploadImage.mv(uploadPath);

    // Yükleme işlemi başarılıysa veritabanına kaydet
    await Photo.create({
      ...req.body,//tüm verileri getir
      image: "/uploads/" + uploadImage.name
    });

    // Başarılı olduğunda ana sayfaya yönlendir
    res.redirect('/');
  } catch (err) {
    // Hata durumunda kullanıcıya mesaj gönder
    console.error("Fotoğraf yükleme hatası:", err);
    res.status(500).send("Dosya yükleme sırasında bir hata oluştu.");
  }
});

//foto güncelleme
app.get("/photos/edit/:id",async (req,res)=>{
  const photo = await Photo.findById(req.params.id);
  res.render("edit",{photo})
})

app.put('/photos/:id', async (req, res) => {  //addPhoto sayfası
const photo=await Photo.findOne({_id:req.params.id})
photo.title=req.body.title
photo.description=req.body.description
photo.save()
res.redirect(`/photos/${req.params.id}`)
});

app.delete("/photos/:id",async (req,res)=>{
const photo=await Photo.findByIdAndDelete(req.params.id)
let image=photo.image
const deleteİmage=__dirname +"/public/uploads/"+image
console.log("Silinecek dosyanın yolu:", deleteİmage);

fs.unlink(deleteİmage)
res.redirect('/');

})




const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
