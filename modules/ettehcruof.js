// module de la logique du jeu

const updateProposition = (min, max) => {
    // la formule pour trouver le bon nombre (celui qui est pile entre min et max)
    // on ajoute min à max puis on divise par 2
    return Math.floor((max + min) / 2);
};

let minBoundary, maxBoundary, proposition;

module.exports = {
    getProposition: () => proposition,
    more: () => {
        minBoundary = proposition;
        proposition = updateProposition(minBoundary, maxBoundary);
    },
    less: () => {
        maxBoundary = proposition;
        proposition = updateProposition(minBoundary, maxBoundary);
    },
    // le paramètre est optionnel, si on l'omet, les bornes par défaut seront utilisées
    // mais si on passe true en argument, on utilisera les bornes custom définies avec setMaximum et setMinimum
    newGame: (custom = false) => {
        // les bornes, fixées manuellement pour l'instant
        if (!custom) {
            minBoundary = 1;
            maxBoundary = 100;
        }
    
        // nécessité du jeu pour que tout se passe bien
        maxBoundary++;
    
        proposition = updateProposition(minBoundary, maxBoundary);
    },
    // ici, on n'utilise pas ces méthodes mais elles peuvent être pratiques dans un autre contexte (avec une interface readline, au hasard)
    setMinimum: (min) => {
        minBoundary = min;
    },
    setMaximum: (max) => {
        maxBoundary = max;
    }
};

