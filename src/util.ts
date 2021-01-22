function key_hash(key: string): number {
    let hash: number = 0;
    for (let i: number = 1; i < key.length; i *= 2) {
        hash += key.charCodeAt(i);
    }
    return hash % 10;
}
