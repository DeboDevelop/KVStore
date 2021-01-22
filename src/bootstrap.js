"use strict";
exports.__esModule = true;
exports.createFiles = exports.checkingDir = exports.creatingDir = void 0;
var fs = require("fs");
var path = require("path");
var creatingDir = function (obj) {
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
exports.creatingDir = creatingDir;
var checkingDir = function (file_path) {
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
exports.checkingDir = checkingDir;
var createFiles = function (obj, file_name) {
    try {
        //Reading the file(Shard) if they exist
        var file_p = path.join(obj.file_path, obj.name, file_name + ".json");
        var value = fs.readFileSync(file_p, "utf8");
        obj.size += Buffer.byteLength(JSON.stringify(value)) + Buffer.byteLength(file_name + ".json");
    }
    catch (e) {
        if (e.code == "ENOENT") {
            //Creating the file(Shard) if they doesn't exist
            var file_p = path.join(obj.file_path, obj.name, file_name + ".json");
            fs.writeFileSync(file_p, "{}", "utf8");
            obj.size += Buffer.byteLength("{}") + Buffer.byteLength(file_name + ".json");
        }
        else
            throw e;
        //Throwing the error to stop the creation of Database
    }
};
exports.createFiles = createFiles;
