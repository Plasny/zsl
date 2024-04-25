# VoiceMemos

The purpose of this app is to enable user to record voice notes using Skagen's
or Fossil's hybrid watch with built in microphone. The android app can
transcribe them when provided with OpenAI api key and show them on the map
if the location permission is given and Mapbox api key is entered.

## Demo

Android app demo:

<video src="https://github.com/Plasny/zsl/assets/37457159/fd22fcf2-59c6-47e7-af9c-53a1dea53439"></video>

Backup server demo:

<video src="https://github.com/Plasny/zsl/assets/37457159/2dc10c2d-ff0a-4aa8-9d72-17d081583732"></video>

## Backstory

In the second semester we continued writing backend in Java, but this time using
Spring Boot framework. We also started writing native mobile apps for Android.
I chose to use Kotlin and Android Compose instead of proposed Java and XML. It
was great expirience learning these technologies I must say. We were alowed to
choose the topic of our final project in this course and as I was trying to
write an app for my watch (Skagen Jorn Gen 6 Hybrid) in some strange JS like
language (Jerryscrypt) the idea of *VoiceMemo* app came to me.

## Requirements

Java, Maven (for server) and Gradle (for mobile) are a must for compiling
and running the code. Android Studio is actually a great editor as well.

You also need to have a Postgresql instance running if you want to use the
server. There is a `docker-compose.yaml` file for setting such database up
with docker in the `server` directory.

To use the android app you also must have a
[Gadgetbridge](https://gadgetbridge.org/) installed on your Android phone
and of course a Skagen or Fossil Gen 6 Hybrid watch. For connecting watch to
Gadgetbridge use
[this guide](https://gadgetbridge.org/gadgets/wearables/fossil/).

## Building / Running

To build or run this project use the following make commands.

```sh
# For building native android app use:
make build-app
# The ready to install apk file can be found in the following directory 
# ./android-app/app/build/outputs/apk/debug/

# For running server use the following:
make run-srv
# To run database use:
make run-db

# If you want to build server run:
make build-db

# To display available options run
make help
```

