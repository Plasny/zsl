all: build run

build:
	 mvn package

run:
	java -cp target/cars-1.0-SNAPSHOT.jar cars.App

run2:
	java -cp target/cars-1.0-SNAPSHOT.jar rest.AppREST

test2:
	docker run --rm -i -t -v ./tests:/workdir jetbrains/intellij-http-client -D -L VERBOSE photos.http
