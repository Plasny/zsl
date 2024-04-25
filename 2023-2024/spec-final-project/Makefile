.PHONY: help run-db run-srv build-srv build-app

PHONE_IP := 192.168.1.23
PHONE_PORT := 5555

help:
	@echo "usage: config connect disconnect run-db run-srv build-srv build-app"

config:
	adb tcpip ${PHONE_PORT} 

connect:
	adb connect ${PHONE_IP}:${PHONE_PORT}

disconnect:
	adb disconnect ${PHONE_IP}:${PHONE_PORT}

run-db:
	docker compose --project-directory server --env-file ./.env up

run-srv:
	source ./.env && mvn -f server spring-boot:run

build-srv:
	mvn -f server package

build-app:
	cd ./android-app && ./gradlew assemble && cd -

