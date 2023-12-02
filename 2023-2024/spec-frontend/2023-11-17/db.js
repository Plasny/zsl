import * as SQLite from 'expo-sqlite';

const DB_NAME = "alarms.db"
const DB = SQLite.openDatabase(DB_NAME);

export default class Database {
    static Init() {
        console.log("Database INIT")

        DB.transaction(tx => {
            // tx.executeSql(`DROP TABLE alarms`)
            tx.executeSql(`
                CREATE TABLE IF NOT EXISTS alarms (
                    id INTEGER PRIMARY KEY NOT NULL,
                    hour INTEGER NOT NULL,
                    minute INTEGER NOT NULL,
                    active_sound BOOLEAN DEFAULT FALSE,
                    active_vibration BOOLEAN DEFAULT FALSE,
                    weekdays TEXT DEFAULT "[0, 0, 0, 0, 0, 0, 0]"
                );
            `)
        }, err => {
            console.error(err)
        }, () => {
            console.log("Database exists")
        })
    }

    static async get(id) {
        let sql, args;
        if (id == undefined) {
            sql = "SELECT * FROM alarms"
            args = []
        } else {
            sql = "SELECT * FROM alarms WHERE id = ?"
            args = [id]
        }

        return new Promise((resolve, reject) => {
            DB.transaction(tx => {
                tx.executeSql(sql, args, (_, res) => {
                    resolve(res.rows._array);
                })
            }, err => {
                console.error(err)
                reject(err)
            })
        })
    }

    // alarm, vibration, sound
    static async getNow() {
        const d = new Date()
        const sql = `
            SELECT weekdays, active_sound, active_vibration 
            FROM alarms 
            WHERE hour = ? AND minute = ?
        `
        const args = [d.getHours(), d.getMinutes()]

        let r = [false, false, false];
        return new Promise((resolve, reject) => {
            DB.transaction(tx => {
                tx.executeSql(sql, args, (_, res) => {
                    if (res.rows.length == 0) {
                        resolve(r)
                        return
                    }

                    for (const row of res.rows._array) {
                        let idx = d.getDay() - 1
                        if (idx == -1) idx = 6

                        if (row["weekdays"][idx]) {
                            r[0] = true

                            if (row["active_vibration"] == 1) {
                                r[1] = true
                            }
                            if (row["active_sound"] == 1) {
                                r[2] = true
                            }
                            if (res[1] && res[2]) {
                                resolve(r)
                                return
                            }
                        }
                    }

                    resolve(r)
                })
            }, err => {
                console.error(err)
                reject(err)
            })
        })
    }

    static async update_vibration(id, vibration) {
        return new Promise((resolve, reject) => {
            DB.transaction(tx => {
                tx.executeSql(`
                    UPDATE alarms SET active_vibration = ? WHERE id = ?
                `, [vibration, id], () => {
                    resolve();
                })
            }, err => {
                console.error(err)
                reject(err)
            }, () => {
                console.log("alarm updated")
            })
        })
    }


    static async update_sound(id, sound) {
        return new Promise((resolve, reject) => {
            DB.transaction(tx => {
                tx.executeSql(`
                UPDATE alarms SET active_sound = ? WHERE id = ?
            `, [sound, id], () => {
                    resolve();
                })
            }, err => {
                console.error(err)
                reject(err)
            }, () => {
                console.log("alarm updated")
            })
        })
    }

    static async update_weekdays(id, weekdays) {
        return new Promise((resolve, reject) => {
            DB.transaction(tx => {
                tx.executeSql(`
                UPDATE alarms SET weekdays = ? WHERE id = ?
            `, [JSON.stringify(weekdays), id], () => {
                    resolve()
                })
            }, err => {
                console.error(err)
                reject(err)
            }, () => {
                console.log("alarm updated")
            })
        })
    }

    static async update(id, hour, minute, weekdays) {
        return new Promise((resolve, reject) => {
            DB.transaction(tx => {
                tx.executeSql(`
                UPDATE alarms 
                SET hour = ?, minute = ?, weekdays = ? 
                WHERE id = ?
            `, [hour, minute, JSON.stringify(weekdays), id], () => {
                    resolve()
                })
            }, err => {
                console.error(err)
                reject(err)
            }, () => {
                console.log("alarm updated")
            })
        })
    }

    static async add(hour, minute, weekdays) {
        return new Promise(async (resolve, reject) => {
            DB.transaction(tx => {
                tx.executeSql(`
                INSERT INTO alarms (hour, minute, weekdays) VALUES (
                    ?, ?, ?
                );
            `, [hour, minute, JSON.stringify(weekdays)], (_, res) => {
                    // console.log("id in: ", res.insertId)
                    resolve(res.insertId);
                })
            }, err => {
                console.error(err)
                reject(err)
            }, () => {
                console.log("alarm added to database")
            })
        })
    }

    static remove(id) {
        return new Promise((resolve, reject) => {
            DB.transaction(tx => {
                tx.executeSql(`
                DELETE FROM alarms WHERE id = ?
            `, [id], () => {
                    resolve()
                })
            }, err => {
                console.error(err)
                reject(err)
            }, () => {
                console.log("alarm deleted")
            })
        })
    }
}
