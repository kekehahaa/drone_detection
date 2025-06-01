Y:
cd "Y:\Docker\CreatorOllama"
docker-compose down
cd .\creator

docker stop creator
docker remove creator
docker build -t creator .

cd ..
docker-compose up -d --remove-orphans
docker exec -it creator_postgres_1 bash /script/init.sh
docker exec -it creator-postgres-1 bash /script/init.sh

docker exec -it creatorollama_postgres_1 bash /script/init.sh
docker exec -it creatorollama-postgres-1 bash /script/init.sh