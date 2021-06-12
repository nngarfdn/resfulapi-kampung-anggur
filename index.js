//import required module
const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //post body handler
const Sequelize = require('sequelize'); //Database ORM
const { check, validationResult } = require('express-validator/check'); //form validation
const { matchedData, sanitize } = require('express-validator/filter'); //sanitize form params
const multer  = require('multer'); //multipar form-data
const path = require('path');
const crypto = require('crypto');

//Set body parser for HTTP post operation
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//set static assets to public directory
app.use(express.static('public'));
const uploadDir = '/img/';
const storage = multer.diskStorage({
    destination: "./public"+uploadDir,
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)  

        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
})

const upload = multer({storage: storage, dest: uploadDir });

//Set app config
const port = 3000;
const baseUrl = 'http://localhost:'+port;

//Connect to database
const sequelize = new Sequelize('kampunganggur', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

//Define models
const toko = sequelize.define('toko', {
    'id': {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'kode': Sequelize.STRING,
    'namatoko': Sequelize.STRING,
    'kontak': Sequelize.STRING,
    'description': Sequelize.TEXT,
    'image': {
        type: Sequelize.STRING,
        //Set custom getter for book image using URL
        get(){
            const image = this.getDataValue('image');
            return uploadDir+image;
        }
    },
    'createdAt': {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },    
    'updatedAt': {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },   
    
}, {
    //prevent sequelize transform table name into plural
    freezeTableName: true,
})


//Define models
const anggur = sequelize.define('anggur', {
    'id': {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'kode': Sequelize.STRING,
    'nama': Sequelize.STRING,
    'namailmiah': Sequelize.STRING,
    'description': Sequelize.TEXT,
    'image': {
        type: Sequelize.STRING,
        //Set custom getter for book image using URL
        get(){
            const image = this.getDataValue('image');
            return uploadDir+image;
        }
    },
    'createdAt': {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },    
    'updatedAt': {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },   
    
}, {
    //prevent sequelize transform table name into plural
    freezeTableName: true,
})



/**
 * Set Routes for CRUD
 */

//get all books
app.get('/toko/', (req, res) => {
    toko.findAll().then(toko => {
        res.json(toko)
    })
})

//get all anggur
app.get('/anggur/', (req, res) => {
    anggur.findAll().then(anggur => {
        res.json(anggur)
    })
})


//get book by isbn
app.get('/toko/:kode', (req, res) => {
    toko.findOne({where: {kode: req.params.kode}}).then(toko => {
        res.json(toko)
    })
})

app.get('/anggur/:kode', (req, res) => {
    anggur.findOne({where: {kode: req.params.kode}}).then(anggur => {
        res.json(anggur)
    })
})

//Insert operation
app.post('/toko/', [
    //File upload (karena pakai multer, tempatkan di posisi pertama agar membaca multipar form-data)
    upload.single('image'),

    //Set form validation rule
    check('kode')
        .isLength({ min: 5 })
        .isNumeric()
        .custom(value => {
            return toko.findOne({where: {kode: value}}).then(b => {
                if(b){
                    throw new Error('Kode sudah digunakan');
                }            
            })
        }
    ),
    check('namatoko')
        .isLength({min: 2}),
    
    check('kontak')
        .isLength({min: 8}),

    check('description')
     .isLength({min: 10})

],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    toko.create({
        namatoko: req.body.namatoko,
        kode: req.body.kode,
        kontak: req.body.kontak,
        description: req.body.description,
        image: req.file === undefined ? "" : req.file.filename
    }).then(newToko => {
        res.json({
            "status":"success",
            "message":"Berhasil menambah toko",
            "data": newToko
        })
    })
})

app.post('/anggur/', [
    //File upload (karena pakai multer, tempatkan di posisi pertama agar membaca multipar form-data)
    upload.single('image'),

    //Set form validation rule
    check('kode')
        .isLength({ min: 5 })
        .isNumeric()
        .custom(value => {
            return anggur.findOne({where: {kode: value}}).then(b => {
                if(b){
                    throw new Error('Kode sudah digunakan');
                }            
            })
        }
    ),
    check('nama')
        .isLength({min: 2}),
    check('namailmiah')
        .isLength({min: 2}),
    check('description')
     .isLength({min: 5})

],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    anggur.create({
        nama: req.body.nama,
        kode: req.body.kode,
        namailmiah: req.body.namailmiah,
        description: req.body.description,
        image: req.file === undefined ? "" : req.file.filename
    }).then(newAnggur => {
        res.json({
            "status":"success",
            "message":"Berhasil menambah data",
            "data": newAnggur
        })
    })
})

//Update operation
app.put('/toko/', [
    //File upload (karena pakai multer, tempatkan di posisi pertama agar membaca multipar form-data)
    upload.single('image'),

    //Set form validation rule
    check('kode')
        .isLength({ min: 5 })
        .isNumeric()
        .custom(value => {
            return toko.findOne({where: {kode: value}}).then(b => {
                if(!b){
                    throw new Error('Kode tidak ditemukan');
                }            
            })
        }
    ),
    check('namatoko')
        .isLength({min: 2}),
    check('kontak')
        .isLength({min: 8})
        .isNumeric(),
    check('description')
     .isLength({min: 10})

],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    const update = {
        namatoko: req.body.namatoko,
        kode: req.body.kode,
        kontak: req.body.kontak,
        description: req.body.description,
        image: req.file === undefined ? "" : req.file.filename
    }
    toko.update(update,{where: {kode: req.body.kode}})
        .then(affectedRow => {
            return toko.findOne({where: {kode: req.body.kode}})      
        })
        .then(b => {
            res.json({
                "status": "success",
                "message": "Berhasil update toko",
                "data": b
            })
        })
})

app.put('/anggur/', [
    //File upload (karena pakai multer, tempatkan di posisi pertama agar membaca multipar form-data)
    upload.single('image'),

    //Set form validation rule
    check('kode')
        .isLength({ min: 5 })
        .isNumeric()
        .custom(value => {
            return anggur.findOne({where: {kode: value}}).then(b => {
                if(!b){
                    throw new Error('Kode tidak ditemukan');
                }            
            })
        }
    ),
    check('nama')
        .isLength({min: 2}),
    check('namailmiah')
        .isLength({min: 2}),
        
    check('description')
     .isLength({min: 5})

],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    const update = {
        nama: req.body.nama,
        kode: req.body.kode,
        namailmiah: req.body.namailmiah,
        description: req.body.description,
        image: req.file === undefined ? "" : req.file.filename
    }
    anggur.update(update,{where: {kode: req.body.kode}})
        .then(affectedRow => {
            return anggur.findOne({where: {kode: req.body.kode}})      
        })
        .then(b => {
            res.json({
                "status": "success",
                "message": "Berhasil update anggur",
                "data": b
            })
        })
})

app.delete('/toko/:kode',[
    //Set form validation rule
    check('kode')
        .isLength({ min: 5 })
        .isNumeric()
        .custom(value => {
            return toko.findOne({where: {kode: value}}).then(b => {
                if(!b){
                    throw new Error('Kode tidak ditemukan');
                }            
            })
        }
    ),
], (req, res) => {
    toko.destroy({where: {kode: req.params.kode}})
        .then(affectedRow => {
            if(affectedRow){
                return {
                    "status":"success",
                    "message": "Berhasil hapus toko",
                    "data": null
                } 
            }

            return {
                "status":"error",
                "message": "Failed",
                "data": null
            } 
                
        })
        .then(r => {
            res.json(r)
        })
})

app.delete('/anggur/:kode',[
    //Set form validation rule
    check('kode')
        .isLength({ min: 5 })
        .isNumeric()
        .custom(value => {
            return anggur.findOne({where: {kode: value}}).then(b => {
                if(!b){
                    throw new Error('kode not found');
                }            
            })
        }
    ),
], (req, res) => {
    anggur.destroy({where: {kode: req.params.kode}})
        .then(affectedRow => {
            if(affectedRow){
                return {
                    "status":"success",
                    "message": "data anggur berhasil dihapus",
                    "data": null
                } 
            }

            return {
                "status":"error",
                "message": "Failed",
                "data": null
            } 
                
        })
        .then(r => {
            res.json(r)
        })
})




app.listen(port, () => console.log("kampung-anggur-rest-api run on "+baseUrl ))