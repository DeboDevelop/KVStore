const fs = require("fs");
const path = require("path");

interface KVStore {
    name: string;
    file_path: string;
    size: number;
}

export const creatingDir = function (obj: KVStore): void {
    try {
        //Creating the Data Directory where the data will be stored.
        fs.mkdirSync(path.join(obj.file_path, obj.name));
    } catch (e) {
        //If the data directory exist, then it will be used to store data.
        if (e.code == "EEXIST") console.log("Directory already exist! Data will be saved there.");
        else throw e;
    }
};

export const checkingDir = function (file_path: string): string {
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

export const createFiles = function (obj: KVStore, file_name: number): void {
    try {
        //Reading the file(Shard) if they exist
        let file_p = path.join(obj.file_path, obj.name, `${file_name}.json`);
        let value = fs.readFileSync(file_p, "utf8");
        obj.size += Buffer.byteLength(JSON.stringify(value)) + Buffer.byteLength(`${file_name}.json`);
    } catch (e) {
        if (e.code == "ENOENT") {
            //Creating the file(Shard) if they doesn't exist
            let file_p = path.join(obj.file_path, obj.name, `${file_name}.json`);
            fs.writeFileSync(file_p, "{}", "utf8");
            obj.size += Buffer.byteLength("{}") + Buffer.byteLength(`${file_name}.json`);
        } else throw e;
        //Throwing the error to stop the creation of Database
    }
};
