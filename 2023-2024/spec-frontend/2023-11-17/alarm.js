import { Audio } from 'expo-av';
import Database from './db';
import { Vibration } from 'react-native';

class Alarm {
    Init() {
        this.sound = new Audio.Sound()
        this.sound.loadAsync(require("./assets/YOUR_NEW_MORNING_ALARM.mp3"))
            .catch(err => {
                console.error(err)
            })
            .finally(() => console.log("Alarm INIT"))
    }

    async checkForAlarm() {
        const ring = await Database.getNow();
        const status = await this.sound.getStatusAsync()

        // console.log(status)

        if (ring[0]) {
            if (status.isPlaying == false) {
                console.log("Alarm started")
                await this.sound.playFromPositionAsync(0)
            }
        } else {
            await this.sound.pauseAsync()
        }

        if (ring[1]) {
            Vibration.vibrate(300, true)
        } else {
            Vibration.cancel()
        }

        if (ring[2]) {
            this.sound.setVolumeAsync(1)
        } else {
            this.sound.setVolumeAsync(0)
        }
    }
}

export default Alarm = new Alarm()
