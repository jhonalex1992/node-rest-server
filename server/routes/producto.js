const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const app = express()
const Producto = require('../models/producto');
const _ = require('underscore');

//===============================
// Obtener todos los productos
//===============================
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ disponible: true }, (err, size) => {
                res.json({
                    ok: true,
                    size,
                    productos
                })
            })

        })

});

//===============================
// Obtener un producto
//===============================
app.get('/productos/:id', (req, res) => {
    //populate usuario categoria
    let id = req.params.id;
    Producto.find({ _id: id })
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }
            res.json({
                producto
            })
        })
});

//===============================
// Buscar productos
//===============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })
})

//===============================
// Crear un producto
//===============================
app.post('/productos', verificaToken, (req, res) => {
    //grabar un usuario
    //grabar categoria
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })
});

//===============================
// Actualizar un producto
//===============================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id ingresado no existe'
                }
            });
        }
        res.json({
            ok: true,
            producto
        })
    })

});

//===============================
// borrar un producto
//===============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //cambiar el disponible a false
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'El producto ya no esta disponible',
            producto
        })
    })
});

module.exports = app;