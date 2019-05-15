# ecal-webproject-infomesh
30 years of the web website during Summer University at swissnex SF

### Deployment to `infomesh.org`
```
yarn deploy
```

or

```
npm run deploy
```

### General
- ✅ Check SSL certificate (google block access from ipad chrome)
- ✅ Move to the new url (infomaniak !)

### Interface/css
- (si on a le temps) Amélioration du jump d'event en event. Clic sur l'événements et mouvement dynamique. Fin ne retourne pas au début
- ✅ ~~(important) Regex pour url readmore~~
- ✅ ~~(important, tibor heeeelp) popup reduce doesn't work on iphone/ipad~~
- ✅ ~~changement de la couleur des titres buggée~~
    -~~❗️ok sur mobile je pense, mais je suis pas à 100% sûr que j'ai bien compris / Tib~~ Normalement, ca devrais être tout bon, j'ai fait ce fix dans l'avion. Il y a juste le cas où si on passe de mobile à pas mobile dans le même browser ca risque de faire n'mporte quoi mais je m'en occupe. 
- doit pas recharger l'iframe si c'est le premier
- timeline déja la quand on ouvre le projet mais elle devrait slider avec
- slider reload pas au bon endroit timelime
- ~~clic partout pour fermer popup~~
- ✅ ~~(Pietro) Iframe link pour expo ne marche pas pour les link des descriptions des projets des étudiants (hors de l'iframe project).~~
- state : texte description redisparait pas, checker les states de Pietro

### Splashscreen 
- Mots trop long sur mobile

### Mobile
- Menu navigation.
- Boutons navigations pas actifs
- (important, pietro) Intro splash screen, longueur de texte sur mobile. Mettre des césures sur certains mots trop longs, genre URL sans en mettre partout ! ✅ Fin de phrase qui freeze
- Splashscreen. Point ou pas point dans les phrases.
- Splashscreen. Source des phrases ?  
- Transitions (supprimer sur mobile)
- ~~Vérifier couleurs quand fond noir/fond blanc (normalement ok déja fait)~~
- (éventuellement) Message pour annoncer que la version mobile est réduite ?

### Popup sur mobile
- ✅ ~~Recréer la div (supprimer et recréer) ou la remettre à zéro, quand on a scrollé et qu'on reouvre un popup, le scroll est déja en bas~~

### Timeline
- Evenement début de l'année envoie l'année d'avant !
- Hightlight pas en bleu pour les événements au début
- Enlever drag drop sur mobile
- Ajouter dynamiquement une variable début fin pour la durée de la timeline.
- Gérer les événements qui sont hors du temps. 
- Checker deux fois le reflow
- evenement se highlight pas

### Contenue texte / Page-about / information / evenement timeline
- Récrire le texte de la page about avec Eryk.
- Remplacer les logos sur la page about par les vectoriel final. 
- ~~Checker toutes les descriptions des projets d'étudiants~~
- Checker toutes les informations dans les timeline. (en cours avec Eryk)
- Checker la liste des facts.
- Case null if no text is in content, to deal with

### Adapt student project
#### worldwidemap
- OK

#### web landscape
- OK

#### web influencer identity
- (Tibor) Loading des images ? Image qui saute avant de s'afficher sur mobile. Est-ce que sur mobile on garde que la basse def ? Une idée serait d'avoir des images basse def encore plus light sur mobile. 

#### web dictionnary
- OK

#### 30y_of_hacks.exe
- OK

#### web phenomena 
- OK

### HTACCESS
- (Tibor, pietro vous savez comment faire ça ?) Autoriser la page /proxy.php dans le .htaccess









