const express = require("express");
//const {fork} = require("child_process")
const randoms = require("../calculoFork/calculo")

const app = express();
const { Router } = express;
const router = new Router();

//GET RANDOM
router.get("/", (req, res) => {
    let cant = 100000000
    if (req.query.cant){cant = req.query.cant};

    let objRepeat = {};
    //Bucle FOR para generar numeros del 1 al 1000, y generar un objeto con los numeros que se repitan
    for (let i = 0; i < cant; i++) {
        nroRandom = Math.trunc(Math.random()*(1001)); //Genero un numero aleatorio del 1 al 1000
        //IF para fijarse si el objeto ya tiene ese numero, si no lo tiene lo genera, si lo tiene le suma 1
        if (objRepeat.hasOwnProperty(nroRandom) === false){
            objRepeat[nroRandom] = 1
        } else {
            objRepeat[nroRandom]++
        }
    }
    res.json(objRepeat);
});

//EXPORT MODULO ROUTER
module.exports = router;
