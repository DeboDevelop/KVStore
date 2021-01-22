function key_hash(key) {
    var hash = 0;
    for (var i = 1; i < key.length; i *= 2) {
        hash += key.charCodeAt(i);
    }
    return hash % 10;
}
