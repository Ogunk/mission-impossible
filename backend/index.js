// index.js

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');

//Passing the database table
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;

//offline configuration for working in localhost else connect to AWS
const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;

if(IS_OFFLINE === true) {
    dynamoDb = new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    console.log(dynamoDb);
}
else{
    dynamoDb = new AWS.DynamoDB.DocumentClient();
};

app.use(bodyParser.json({ strict: false }));

//Entry page of the api
app.get('/', function (req, res) {
  res.send('Hello World!')
});

// Get Product by id endpoint
app.get('/product/:IDPRODUIT', function (req, res) {
    //Getting the id from the url and parsing it to int
    const params = {
        TableName: PRODUCTS_TABLE,
        Key: {
            IDPRODUIT: parseInt(req.params.IDPRODUIT)
        }
    };

    //Getting the product from the database
    //if error or not found print it
    //else print success and print json format of the product
    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get the product' });
        }
        if (result.Item != null) {
            const {IDPRODUIT,DESCRIPTION, TYPE, REFERENCE, CATEGORIE} = result.Item;
            res.status(200).json({ IDPRODUIT, DESCRIPTION,TYPE, REFERENCE, CATEGORIE });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    });
});

// TODO :Get Product by name endpoint
app.get('/productByName/:NOMCOMMERCIAL', function (req, res) {
    const params = {
        TableName: PRODUCTS_TABLE,
        Key: {
            NOMCOMMERCIAL: req.params.NOMCOMMERCIAL
        }
    };

    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get the product' });
        }
        if (result.Item) {
            const {IDPRODUIT,DESCRIPTION, TYPE, REFERENCE, CATEGORIE} = result.Item;
            res.status(200).json({ IDPRODUIT, DESCRIPTION,TYPE, REFERENCE, CATEGORIE });
        } else {
            res.status(404).json({ error: "Product not found" });
        }
    });
});

// Create Product endpoint
app.post('/add-products', function (req, res) {
    const {IDPRODUIT,TYPE,REFERENCE,NOMCOMMERCIAL,DESCRIPTION,CATEGORIE,PRIXDEVENTEHT,PRIXDEVENTETTC,PRIXACHAT,TVA,QUANTITE,UNITES,QUANTITEDISPONIBLE,QUANTITERESERVE,SEUILALERTE,STOCKVALO,LARGEUR,PROFONDEUR,LONGUEUR,HAUTEUR,POIDS,MARQUE} = req.body;
    //checking if the the product ID is a number and stop if it is not
    if (typeof IDPRODUIT !== 'number') {
        res.status(400).json({error: '"IDPRODUIT" must be a number'});
    }
    //Attributs we are going to insert in the table
    const params = {
        TableName: PRODUCTS_TABLE,
        Item: {
            IDPRODUIT: IDPRODUIT,
            TYPE: TYPE,
            REFERENCE: REFERENCE,
            NOMCOMMERCIAL: NOMCOMMERCIAL,
            DESCRIPTION: DESCRIPTION,
            CATEGORIE: CATEGORIE,
            PRIXDEVENTEHT: PRIXDEVENTEHT,
            PRIXDEVENTETTC: PRIXDEVENTETTC,
            PRIXACHAT: PRIXACHAT,
            TVA: TVA,
            QUANTITE: QUANTITE,
            UNITES: UNITES,
            QUANTITEDISPONILE: QUANTITEDISPONIBLE,
            QUANTITERESERVE: QUANTITERESERVE,
            SEUILALERTE: SEUILALERTE,
            STOCKVALO: STOCKVALO,
            LARGEUR: LARGEUR,
            PROFONDEUR: PROFONDEUR,
            LONGUEUR: LONGUEUR,
            HAUTEUR: HAUTEUR,
            POIDS: POIDS,
            MARQUE : MARQUE
        }
    };

    //Inserting the attributs
    //if fail get the error
    //else print success and the inserted object
    dynamoDb.put(params, (error) => {
        if (error) {
            console.log(error);
            res.status(400).json({error: 'Could not create the product'});
        }
        res.status(200).json({IDPRODUIT,TYPE,REFERENCE,NOMCOMMERCIAL,DESCRIPTION,CATEGORIE,PRIXDEVENTEHT,PRIXDEVENTETTC,PRIXACHAT,TVA,QUANTITE,UNITES,QUANTITEDISPONIBLE,QUANTITERESERVE,SEUILALERTE,STOCKVALO,LARGEUR,PROFONDEUR,LONGUEUR,HAUTEUR,POIDS,MARQUE});
    });

});

module.exports.handler = serverless(app);