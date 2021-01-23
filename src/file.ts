const fs = require("fs");
const path = require("path");
const lockfile = require("proper-lockfile");

interface KVStore {
    name: string;
    file_path: string;
    size: number;
}

function sleepProcessCreate(
    key: string,
    key_hash: number,
    value: object,
    seconds: number | undefined = undefined,
    obj: KVStore
) {
    return new Promise<object>(function (resolve, reject) {
        setTimeout(() => {
            createNewData(key, key_hash, value, seconds, obj)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
        }, 5 * 1000);
    });
}

function sleepProcessDelete(key: string, key_hash: number, obj: KVStore) {
    return new Promise<object>(function (resolve, reject) {
        setTimeout(() => {
            deleteOldData(key, key_hash, obj)
                .then((res: any) => resolve(res))
                .catch((err: any) => reject(err));
        }, 5 * 1000);
    });
}

export function createNewData(key: string, key_hash: number, value: object, seconds: number | undefined, obj: KVStore) {
    let file_p = path.join(obj.file_path, obj.name, `${key_hash}.json`);
    return new Promise<object>(function (resolve, reject) {
        lockfile
            .lock(file_p)
            .then((release: any) => {
                let file_obj: any;
                try {
                    file_obj = JSON.parse(fs.readFileSync(file_p, "utf8"));
                } catch (err) {
                    reject(err);
                }
                if (file_obj.hasOwnProperty(key)) {
                    //returning appropriate promise
                    reject({ status: "Error", msg: "Key already exist." });
                } else {
                    //creating the new key value pair
                    file_obj[key] = value;
                    //updating the size variable
                    obj.size += Buffer.byteLength(JSON.stringify(value)) + Buffer.byteLength(key);
                    try {
                        fs.writeFileSync(file_p, JSON.stringify(file_obj), "utf8");
                        resolve({ status: "Sucess", msg: "Data is Created Successfully." });
                    } catch (err) {
                        reject(err);
                    }
                }
                return release();
            })
            .catch((e: any) => {
                if (e.code == "ELOCKED") {
                    //Putting the currect operation to sleep as another operation is working on the same file.
                    sleepProcessCreate(key, key_hash, value, seconds, obj)
                        .then(res => resolve(res))
                        .catch(err => reject(err));
                } else {
                    //rejecting the promise due to error
                    reject(e);
                }
            });
    });
}

export function deleteOldData(key: string, key_hash: number, obj: KVStore) {
    let file_p = path.join(obj.file_path, obj.name, `${key_hash}.json`);
    return new Promise<object>(function (resolve, reject) {
        lockfile
            .lock(file_p)
            .then((release: any) => {
                let file_obj: any;
                try {
                    file_obj = JSON.parse(fs.readFileSync(file_p, "utf8"));
                } catch (err) {
                    reject(err);
                }
                if (file_obj.hasOwnProperty(key)) {
                    //updating the size variable
                    obj.size -= Buffer.byteLength(JSON.stringify(file_obj[key])) + Buffer.byteLength(key);
                    //deleting the data of given key
                    delete file_obj[key];
                    try {
                        fs.writeFileSync(file_p, JSON.stringify(file_obj), "utf8");
                        resolve({ status: "Sucess", msg: "Data is deleted successfully." });
                    } catch (err) {
                        reject(err);
                    }
                } else {
                    //returning appropriate promise
                    reject({ status: "Error", msg: "Key Doesn't exist" });
                }
                return release();
            })
            .catch((e: any) => {
                if (e.code == "ELOCKED") {
                    //Putting the currect operation to sleep as another operation is working on the same file.
                    sleepProcessDelete(key, key_hash, obj)
                        .then(res => resolve(res))
                        .catch(err => reject(err));
                } else {
                    //rejecting the promise due to error
                    reject(e);
                }
            });
    });
}
