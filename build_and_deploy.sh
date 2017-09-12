#!/bin/sh

cd /data/share/phet/meteor-deploy
rm -rf *
cd /data/share/phet/website-meteor
git pull
meteor build --server-only ../meteor-deploy
cd /data/share/phet/meteor-deploy
tar xvf website-meteor.tar.gz
cd /data/share/phet/meteor-deploy/bundle/programs/server
npm install
cd /data/share/phet/meteor-deploy/bundle
MONGO_URL=mongodb://localhost:27017/meteor ROOT_URL=http://localhost/meteor PORT=16374 node main.js
