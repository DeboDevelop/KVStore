export function keyHash(key: string): number {
    let hash: number = 0;
    for (let i: number = 1; i < key.length; i *= 2) {
        hash += key.charCodeAt(i);
    }
    return hash % 10;
}

export function check(size: number, key: string, value: object) {
    let return_value: any = checkSize(size);
    if (return_value.status == "Error") {
        return return_value;
    }
    return_value = checkKey(key);
    if (return_value.status == "Error") {
        return return_value;
    }
    return_value = checkValue(value);
    return return_value;
}

function checkSize(size: number): object {
    if (size >= 1024 * 1024 * 1024) {
        return { status: "Error", msg: "Size of Database is more than 1 GB, please delete some files." };
    } else {
        return { status: "Success" };
    }
}

function checkKey(key: string): object {
    if (typeof key !== "string") {
        return { status: "Error", msg: "Key have to be String" };
    } else if (key.length > 32) {
        return { status: "Error", msg: "Key is more than 32 characters." };
    } else {
        return { status: "Success" };
    }
}

function checkValue(value: object): object {
    if (value === null) {
        return { status: "Error", msg: "Value is Null" };
    } else if (typeof value !== "object") {
        return { status: "Error", msg: "Value have to be JSON" };
    } else if (Buffer.byteLength(JSON.stringify(value)) > 16 * 1024) {
        return { status: "Error", msg: "Value is more than 16 KB." };
    } else {
        return { status: "Success" };
    }
}
