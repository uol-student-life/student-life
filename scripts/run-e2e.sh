# scripts/run-e2e.sh
#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")" && pwd)"
$DIR/db-startup.sh

if [ "$#" -eq  "0" ]
  then
    npx playwright test
else
    npx playwright test --ui
fi

docker-compose -f $DIR/../docker-compose.e2e.yaml -p student-life-tests down -v
