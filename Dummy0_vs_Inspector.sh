#!/usr/bin/env bash

cd ./ia_fopera
python3.6 ./fantome_opera_serveur.py &
sleep 2
echo "Dummy0 connection"
python3.6 ./dummy0.py &> play1out.log &
cd ../
echo "Gost connection"
nodejs ./player/Inspector.js &> plsyer2out.log &

