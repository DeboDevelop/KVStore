const fs = require("fs");
const path = require("path");
const lockfile = require("proper-lockfile");
const { checkingDir, creatingDir, createFiles } = require("./bootstrap");

let size: number = 0;

class KVStore {
    name: string;
    file_path: string;
    constructor(name: string, file_path: string = __dirname) {
        this.name = name;
        this.file_path = checkingDir(file_path);
        creatingDir(this);
        for (let i: number = 0; i < 10; i++) {
            size += createFiles(this, i);
        }
        console.log(this);
    }
}

let kv = new KVStore("name");
