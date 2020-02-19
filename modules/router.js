const express = require('express');
const router = express.Router();

const moment = require('moment');
// pour pouvoir jouer à la fourchette à l'envers, on récupère notre bon vieux module (qui brille encore une fois par sa réutilisabilité)
const ettehcruof = require('./ettehcruof');
// initialisation de la première partie, tout le reste se fera automatiquement
ettehcruof.newGame();

moment.locale('fr');

// les données, réimportées parce que j'en ai besoin aussi dans mon routeur
// heureusement, require a un système de cache donc pas d'alourdissement de l'application
const games = require('../games.json');

router.use((request, response, next) => {
    let date = moment();
    let ip = request.ip;
    let url = request.url;
    console.log(`[${date.format("LLLL")} ${ip}] ${url}`);
    next();
});

// les fichiers statiques se situent dans le dossier public
router.use(express.static("public"));

// définir les routes
router.get('/', (request, response, next) => {
    response.render('index');
});

// un peu moche mais ça marche
// en plaçant ce middleware spécifique avant le "générique", on intercepte la requête /game/ettehcruof (et uniquement celle-là), et on laisse passer toutes les autres /game/*

// le but sera d'intercepter les requêtes suivantes
// http://localhost:3000/game/ettehcruof => pas de paramètre
// http://localhost:3000/game/ettehcruof?anwser=moins => 1 paramètre nommé answer dont la valeur est "moins"
// http://localhost:3000/game/ettehcruof?coucou=zenith => 1 paramètre nommé coucou dont la valeur est "zenith"

router.get('/game/ettehcruof', (request, response, next) => {
    console.log('url interceptée par le mw ettehcruof');
    
    // pour décider du message qu'on affichera au joueur
    let message;
    // pour décider des boutons qu'on affichera au joueur
    let buttons = 'playButtons';

    // request.query contient les paramètres GET de la requête
    let answer = request.query.answer;

    switch (answer) {
        case 'moins':
            ettehcruof.less();
            message = "Ok, c'est " + ettehcruof.getProposition() + " ?";
            break;
        case 'plus':
            ettehcruof.more();
            message = "Ok, c'est " + ettehcruof.getProposition() + " ?";
            break;
        case 'bravo':
            message = "Trop fort ! Express ftw";
            ettehcruof.newGame();
            buttons = 'resetButtons';
            break;
        // correspond à pas de paramètre dans l'url
        default:
            message = "Bienvenue ! Je propose " + ettehcruof.getProposition();
            break;
    }

    // ettehcruof étant le 3e jeu, son indice est 2
    // ça, en fait, c'est extrêmement moche : ça sous-entend qu'il faudra toujours s'assurer qu'ettehcruof est le 3e jeu de la liste, sinon ça plantera
    //let theGame = games[2];

    // on ajoute ces deux infos en tant que propriétés de l'objet jeu
    //theGame.message = message;
    //theGame.buttons = buttons;

    // pour que ces 2 variables soient tout de même accessibles dans la vue, on les place dans locals au niveau de la réponse (puisqu'elles ne sont relatives qu'à cette requête en particulier)
    response.locals.message = message;
    response.locals.buttons = buttons;

    // et on passe cet objet jeu à la vue (comme pour les autres jeux en fait)
    // ce render, on le fait déjà dans le mw du dessous
    //response.render('ettehcruof', theGame);

    // et puisque le mw générique se charge déjà du rendu, on va lui laisser ce taf
    next();
});

// une unique route paramétrée pour servir tous les jeux disponibles #lePrecieux
router.get('/game/:nomDuJeu', (request, response, next) => {
    console.log('url interceptée par le mw game');
    let nomDuJeu = request.params.nomDuJeu;

    // déjà fait lundi, c'est glamour, c'est concis, je prends <3
    // le tableau games est filtré : il est parcouru et chacun de ses éléments est passé en argument du callback
    // le callback se charge de vérifier que la propriété name de cet élément est égale à nomDuJeu (le paramètre de route)
    // si c'est le cas, l'élément est gardé, placé au chaud dans un nouveau tableau "filtre" créé pour l'occasion
    // si ce n'est pas le cas, l'élément n'est pas placé dans le tableau "filtre"
    let jeu = games.filter((game) => game.name === nomDuJeu).pop();

    // mais si le jeu demandé n'existe pas ? ex: /game/warcraft3
    // que va contenir jeu ? apparemment undefined
    if (!jeu) {
        // maintenant qu'on a un middleware 404, on lui passe la main si aucun jeu portant le nom souhaité n'a été trouvé
        next();
        // on laisse le return pour bien interrompre ce middleware, car on ne doit pas tenter de render le jeu... vu qu'il n'y a pas de jeu :-)
        return;
    }

    // la partie ardue (mais trop cool)
    // note 1 : pour que tout soit automatisé, il faudra qu'il existe une view portant le name du jeu
    // note 2 : il faudra également prévoir le js et le css nécessaire et noter le nom des deux fichiers dans games.json
    response.render(jeu.name, jeu);
});

// un dernier middleware, qui récupère tout ce qui n'a pas été intercepté par les précédents (ou intercepté mais relaché sans répondre)
router.use((request, response) => {
    response.status(404).render('404');
});

// pour exporter un objet (=l'intérêt d'un module), on utilise module.exports
module.exports = router;