var fs = require("fs");
var path = require("path");
var lockfile = require("proper-lockfile");
var creating_dir = function (obj) {
    try {
        //Creating the Data Directory where the data will be stored.
        fs.mkdirSync(path.join(obj.file_path, obj.name));
    }
    catch (e) {
        //If the data directory exist, then it will be used to store data.
        if (e.code == "EEXIST")
            console.log("Directory already exist! Data will be saved there.");
        else
            throw e;
    }
};
var checking_dir = function (file_path) {
    try {
        //Checking whether the given path exist or not.
        if (fs.lstatSync(file_path).isDirectory() == true)
            return file_path;
        else {
            console.error("Path is not a Directory");
            console.error("Using Default path to save data");
            // Using currect directory if the user given path is not Directory.
            return __dirname;
        }
    }
    catch (e) {
        if (e.code == "ENOENT") {
            console.error("No file or Directory Exist: " + file_path);
            console.error("Using Default path to save data");
            // Using currect directory if the user given path doesn't exist.
            return __dirname;
        }
        else
            throw e;
    }
};
var KVStore = /** @class */ (function () {
    function KVStore(name, file_path) {
        if (file_path === void 0) { file_path = __dirname; }
        this.name = name;
        this.file_path = checking_dir(file_path);
        creating_dir(this);
        console.log(this);
    }
    return KVStore;
}());
var kv = new KVStore("name");
