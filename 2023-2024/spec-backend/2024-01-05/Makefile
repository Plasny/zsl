all: build run

build:
	 mvn package

run:
	java -cp target/rest-example-1.0-SNAPSHOT.jar users.App


test:
	docker run --rm -i -t -v ./tests:/workdir jetbrains/intellij-http-client -D -L BASIC users.http
