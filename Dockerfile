FROM node:14.15.0

WORKDIR /usr/src/nodeApp

RUN apt update
RUN apt -y install nano htop

CMD bash -c 'while true; do sleep 60; done'