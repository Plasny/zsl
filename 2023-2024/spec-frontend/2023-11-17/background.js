/* import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import Alarm from './alarm';

const TASK_NAME = "background-alarm-task"

TaskManager.defineTask(TASK_NAME, async () => {
    const d = new Date()
    console.log("ok at", d.toString())

    await Alarm.checkForAlarm()

    return BackgroundFetch.BackgroundFetchResult.NoData
});

export async function registerBackgroundTask() {
    return BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 60, // 1 minute
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
} */
