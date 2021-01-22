const fs = require("fs");
const path = require("path");
const lockfile = require("proper-lockfile");

const creating_dir = function (obj: KVStore): void {
    try {
        //Creating the Data Directory where the data will be stored.
        fs.mkdirSync(path.join(obj.file_path, obj.name));
    } catch (e) {
        //If the data directory exist, then it will be used to store data.
        if (e.code == "EEXIST") console.log("Directory already exist! Data will be saved there.");
        else throw e;
    }
};

const checking_dir = function (file_path: string): string {
    try {
        //Checking whether the given path exist or not.
        if (fs.lstatSync(file_path).isDirectory() == true) return file_path;
        else {
            console.error("Path is not a Directory");
            console.error("Using Default path to save data");
            // Using currect directory if the user given path is not Directory.
            return __dirname;
        }
    } catch (e) {
        if (e.code == "ENOENT") {
            console.error("No file or Directory Exist: " + file_path);
            console.error("Using Default path to save data");
            // Using currect directory if the user given path doesn't exist.
            return __dirname;
        } else throw e;
    }
};

class KVStore {
    name: string;
    file_path: string;
    constructor(name: string, file_path: string = __dirname) {
        this.name = name;
        this.file_path = checking_dir(file_path);
        creating_dir(this);
        console.log(this);
    }
}

//let kv = new KVStore("name");
