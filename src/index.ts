const fs = require("fs");
const path = require("path");
const { checkingDir, creatingDir, createFiles } = require("./bootstrap");
const { keyHash, check } = require("./util");
const { createNewData } = require("./file");

class KVStore {
    name: string;
    file_path: string;
    size: number;
    constructor(name: string, file_path: string = __dirname) {
        this.size = 0;
        this.name = name;
        this.file_path = checkingDir(file_path);
        creatingDir(this);
        for (let i: number = 0; i < 10; i++) {
            createFiles(this, i);
        }
        console.log(this);
    }
    createData(key: string, value: object, seconds: number | undefined = undefined) {
        let return_value: any = check(this.size, key, value);
        if (return_value.status === "Error") {
            return new Promise(function (resolve, reject) {
                reject(return_value);
            });
        } else {
            let key_hash = keyHash(key);
            let curr_obj = this;
            return new Promise(function (resolve, reject) {
                createNewData(key, key_hash, value, seconds, curr_obj)
                    .then((res: any) => resolve(res))
                    .catch((err: any) => reject(err));
            });
        }
    }
}

module.exports = KVStore;
