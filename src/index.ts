const fs = require("fs");
const path = require("path");
const { checkingDir, creatingDir, createFiles } = require("./bootstrap");
const { keyHash, check, checkKey } = require("./util");
const { createNewData, deleteOldData } = require("./file");

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
            return createNewData(key, key_hash, value, seconds, this);
        }
    }
    deleteData(key: string) {
        let return_value: any = checkKey(key);
        if (return_value.status === "Error") {
            return new Promise(function (resolve, reject) {
                reject(return_value);
            });
        } else {
            let key_hash = keyHash(key);
            return deleteOldData(key, key_hash, this);
        }
    }
}

module.exports = KVStore;
