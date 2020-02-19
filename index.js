// les essentiels
const express = require('express');
const app = express();

// les données
const games = require('./games.json');

// des données définies dans app.locals sont disponibles dans TOUTES les vues rendues depuis app, c'est à dire toutes les vues :-)
app.locals.games = games;

// partons directement sur un routeur, c'est plus propre
const router = require('./modules/router');

// bonne pratique, ça évite de le chercher dans le code
const port = 3000;

// configuration d'express
// le moteur de rendu sera ejs
app.set('view engine', 'ejs');
// les vues se situent dans le dossier views
app.set('views', 'views');
// et pour les routes, on utilisera notre routeur, configuré dans un module séparé
app.use(router);

// écouter un port
app.listen(port, () => console.log('Server listening on port ' + port));