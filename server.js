var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Usuario = require('./app/models/usuario');

mongoose.connect('mongodb://lldc21:91555830l@ds159400.mlab.com:59400/testedb')


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.port || 8000;

var router = express.Router();

const jwt = require('jsonwebtoken');
const supersecret = 'senhaqualquer';

//rota1
router.get('/login',(req, res)=>{
    const jwtData = {
        email: 'llldc21@gmail.com',
        userName: 'Lucas'
    }
    const jwtParams = {
        algorithm: 'HS256',
        expiresIn: 60*60*24,
    }
    jwt.sign(jwtData, supersecret, jwtParams, (error, data)=>{
        if(error) return res.json({erroror: true, message:'Falha ao gerar o token'})
        res.json({erroror: false, token: data})
    });
})

router.use((req, res, next)=>{
    const token = req.headers['authorization']
    if(!token) return res.json({erroror: true, message: 'Nenhum token recebido.'});
    jwt.verify(token, supersecret, (error, data)=>{
        if(error) return res.json(error)
        next()
    })
})

router.get('/', (req, res)=>{
    res.json({message: 'Bem vindo ao CRUD'})
});

//rota2
router.route('/usuarios')
.post(function(req, res){
    var usuario = new Usuario();
    usuario.nome = req.body.nome;
    usuario.login = req.body.login;
    usuario.senha = req.body.senha;
    usuario.save(function(erroror){
        if(erroror)
            res.send(erroror);
        res.json({message:'Usuario criado!'});
    });
})
.get(function(req, res){
    Usuario.find(function(error, usuario){
        if(error)
            res.send(error);
        res.json(usuario);
    });
});

//rota3
router.route('/usuarios/:usuario_id')
.get(function(req, res){
    Usuario.findById(req.params.usuario_id, function(erroror, usuario){
        if(erroror)
            res.send(erroror);
        res.json(usuario);
    });
})

.put(function(req, res){
    Usuario.findById(req.params.usuario_id, function(erroror, usuario){
        if(erroror)
            res.send(erroror);
        usuario.nome = req.body.nome;
        usuario.login = req.body.login;
        usuario.senha = req.body.senha;
        usuario.save(function(erroror){
            if(erroror)
                res.send(erroror);
            res.json({message: 'Usuario atualizado!'})

        });
    });
})

.delete(function(req, res){
    Usuario.remove({_id: req.params.usuario_id}, function(erroror){
        if(erroror)
            res.send(erroror);
        res.json({message:'Usuario excluido com sucesso!'})
    });
});

app.use('/crud', router);

app.listen(port);
console.log('Servidor iniciado a porta '+ port);