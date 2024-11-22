import express from 'express';
import multer from 'multer';

const app = express();

const upload = multer({ dest: 'uploads/'});

app.post('/photos', upload.single('image'), (req, res) => {
  const filename = req.file.filename;
  const path = `/profile/${filename}`;
  res.json({ path });
});

app.use('/profile', express.static('uploads/'));

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

