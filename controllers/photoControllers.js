const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit =  3;

    const totalPhotos = await Photo.find({}).countDocuments();

    const photos = await Photo.find({})
      .sort('-dateCreated')
      .skip((page - 1) * limit)
      .limit(limit);

    res.render(("index"),{
    photos:photos,
    current:page,
    pages:Math.ceil(totalPhotos / limit) 
      })



  } catch (error) {
    console.log('bir hata oluştu.');
  }

  //const photos = await Photo.find({}).sort('-dateCreated'); //veritabanından verileri getir tarih sırasına göre yerleştir
  //res.render('index', { photos });
};

exports.getPhoto = async (req, res) => {
  //ilgili fotoğrafın id'sine göre detaylarına git
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo });
};

exports.CreatePhoto = async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    //Klasör var mı kontrol et yoksa oluştur.
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    let uploadImage = req.files.image;
    let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name;

    // Dosya yükleme işlemi
    await uploadImage.mv(uploadPath);

    // Yükleme işlemi başarılıysa veritabanına kaydet
    await Photo.create({
      ...req.body, //tüm verileri getir
      image: '/uploads/' + uploadImage.name,
    });

    // Başarılı olduğunda ana sayfaya yönlendir
    res.redirect('/');
  } catch (err) {
    // Hata durumunda kullanıcıya mesaj gönder
    console.error('Fotoğraf yükleme hatası:', err);
    res.status(500).send('Dosya yükleme sırasında bir hata oluştu.');
  }
};

exports.UpdatePhoto = async (req, res) => {
  //addPhoto sayfası
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
};

exports.DeletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let image = photo.image;
  const deleteİmage = __dirname + '/../public/' + image;
  await Photo.findByIdAndDelete(req.params.id);
  fs.unlinkSync(deleteİmage);
  res.redirect('/');
};
