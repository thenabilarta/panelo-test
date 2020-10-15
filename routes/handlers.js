const express = require('express');
const router = express.Router();
const axios = require('axios');
const orm = require('../config/orm');
const con = require('../config/connection');
const request = require('request');
const fs = require('fs');

const download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

router.get('/', function (req, res) {
  orm.selectAll(function (error, dataproduk) {
    res.render('index', { dataproduk, style: 'index' });
  });
});

router.get('/edit/:id', function (req, res) {
  const id = req.params.id;
  con.query(`SELECT * FROM dataproduk WHERE id = ${id}`, function (
    err,
    result
  ) {
    res.render('edit', { result, style: 'edit' });
  });
});

router.get('/api/product', async (req, res) => {
  const data = await axios.get(
    'https://resto.technopresent.com/api/productlist/3'
  );
  const products = await data.data.products;

  for (var keys in products) {
    var product = products[keys].products;
    for (var key in product) {
      const uri = product[key].preview.content;
      const id = uri.split('/');
      const uriString = id.slice(-1)[0];

      download(
        'https:' + product[key].preview.content,
        './public/img/' + uriString,
        function () {
          console.log('done');
        }
      );

      const item = {
        'id': '',
        'product_id': product[key].id,
        'product_name': product[key].title,
        'product_price': product[key].price.price,
        'product_image': uriString,
      };

      con.query(
        "SELECT product_id FROM dataproduk WHERE product_id = '" +
          product[key].id +
          "'",
        function (error, result) {
          if (result.length === 0) {
            con.query('INSERT INTO dataproduk SET ?', item, function (
              error,
              result
            ) {
              console.log('Data berhasil tersimpan');
            });
          } else {
            return;
          }
        }
      );
    }
  }
});

router.post('/', (req, res) => {
  const nama = req.body.nama;
  const harga = req.body.harga;
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  const file = req.files.gambar;
  console.log(file);
  const img_name = file.name;

  if (
    file.mimetype == 'image/jpeg' ||
    file.mimetype == 'image/png' ||
    file.mimetype == 'image/gif'
  ) {
    file.mv('public/img/' + file.name, function (err) {
      if (err) return res.status(500).send(err);
      var sql = `INSERT INTO dataproduk (id, product_id, product_name, product_price, product_image) VALUES('', '', '${nama}', '${harga}', '${img_name}')`;

      con.query(sql, function (err, result) {
        res.redirect('/');
      });
    });
  } else {
    message =
      "This format is not allowed , please upload file with '.png','.gif','.jpg'";
    console.log({ message });
  }
  // upload(req, res, (err) => {
  //   if (err) throw err;
  //   var sql =
  //     "INSERT INTO dataproduk (picture) VALUES('" + req.file.filename + "')";
  //   connection.query(sql, function (err, results) {
  //     console.log(results);
  //   });
  // });

  // orm.insertOne(nama, harga, gambar, function (error, dataproduk) {
  //   if (error) {
  //     return res.status(401).json({
  //       message: 'Not able to add mahasiswa',
  //     });
  //   }
  //   return res.send({
  //     id: dataproduk.insertId,
  //     nama: nama,
  //     harga: harga,
  //     gambar: gambar,
  //   });
  // });
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  orm.deleteOne(id, function (err, dataproduk) {
    if (err) {
      return res.status(501).json({
        message: 'deleted',
      });
    }
    return res.json({
      id,
    });
  });
});

router.put('/api/edit', (req, res) => {
  const nama = req.body.nama;
  const harga = req.body.harga;
  const gambar = req.body.gambar;
  const id = req.body.id;

  orm.updateOne(id, nama, harga, gambar, function (error, result) {
    if (error) {
      return res.status(401).json({
        message: 'Not able to edit produk',
      });
    }
    res.send(result);
  });
});

module.exports = router;
