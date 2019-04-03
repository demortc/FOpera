# Running Locally

Make sure you have Node.js and Python3.6 installed.

## Installation

```
git clone git@github.com:demortc/FOpera.git
cd FOpera
npm install
```

## Launch Server
```
cd FOpera/ia_fopera
python fantome_opera_serveur.py
```

## Launch IA
```
cd FOpera
npm start
```

## Complementary informations
Ce projet utilise la version socket du serveur.

Le serveur du projet à été partiellement mis à jours de façon à ce qu'il puissent être éxécuté sous Windows.

Nous utilisons notre propre parser et non celui qui nous à été fournis. On s'est rendu compte que beaucoup d'erreurs subsistaient entre les informations renvoyées par le serveur et le traitement dans le parser.

Il ce peux que lors de l'éxécution de l'ia, une erreur fasse échoué l'éxécution. (Dans ce cas ne pas hésité à relancer le serveur puis l'ia)

Après de multiple phases de test et au bout de 999 parties, nous obtenons généralement un WinRate d'une moyenne de 40 % 