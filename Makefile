build:
	docker build -t node_database .
run:
	docker run -d --name Database_NodeJS -p 3000:3000 -v $(PWD)/code:/usr/src/nodeApp node_database

exec:
	docker exec -it -u 1000:1000 Database_NodeJS bash

stop:
	docker stop Database_NodeJS
remove:
	docker rm Database_NodeJS