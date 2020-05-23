const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const app = express()
const Categoria = require('../models/categoria');


//////////////////////////////
//Muestra todas las categorias
//////////////////////////////
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            })
        })
});

//////////////////////////////
//Mostrat una categoria por id
//////////////////////////////

app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById()
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro la categoria'
                }
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});


//////////////////////////////
//Crear categoria
//////////////////////////////
app.post('/categoria', verificaToken, (req, res) => {
    // Regresar nueva categoria
    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


//////////////////////////////
//Actualizar categoria
//////////////////////////////
app.put('/categoria/:id', verificaToken, (req, res) => {
    // Regresar nueva categoria
    //req.usuario._id
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

//////////////////////////////
//Borrar categoria
//////////////////////////////
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // Regresar nueva categoria
    //req.usuario._id
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria eliminada'
        });
    });
});

module.exports = app;