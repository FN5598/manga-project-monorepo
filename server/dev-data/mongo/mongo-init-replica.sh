#!/bin/sh
set -e

echo "Waiting for MongoDB..."

until mongosh --host mongodb:27017 --quiet --eval "db.adminCommand({ ping: 1 }).ok" >/dev/null 2>&1; do
  sleep 2
done

echo "MongoDB is up. Initializing replica set..."

mongosh --host mongodb:27017 --quiet --eval '
try {
  rs.status();
  print("Replica set already initialized");
} catch (e) {
  print("Initializing replica set...");
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "mongodb:27017" }]
  });
}
'

echo "Waiting for MongoDB primary..."

until [ "$(mongosh --host mongodb:27017 --quiet --eval 'db.hello().isWritablePrimary')" = "true" ]; do
  sleep 2
done

echo "MongoDB replica set is primary"