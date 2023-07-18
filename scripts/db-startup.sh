#!/usr/bin/env bash

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
docker-compose -f $DIR/../docker-compose.e2e.yaml -p student-life-tests up -d
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${DB_CONNECTION_STRING}" -- echo '🟢 - Database is ready!'
npm run migrate:tests
