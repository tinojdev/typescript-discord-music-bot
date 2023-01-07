const songs2 = ["C++", "Jva", "Python", "JS"];

function remove(startPos: number, endPos?: number): [string | undefined, boolean] {
    const songs = songs2;
    if (startPos < 1) return ["Song number must be 1 or over", false];
    if (startPos > songs.length) return ["No such song!", false];
    if (endPos != undefined && endPos <= startPos) return ["Ending position must be bigger than starting position", false];
    if (endPos != undefined && endPos > songs.length) return [`Ending position must be less than the length of the queue (length: ${songs.length})!`, false];

    const sIndex = startPos - 1;
    
    if (endPos) {
        songs.splice(sIndex,  endPos - sIndex);
    } else {
        songs.splice(sIndex, 1);
    }
    return [undefined, true];

}

test("Remove command works correctly with illegal numbers", () => {
    const res = remove(5);
    expect(res[1]).toStrictEqual(false);
});

test("Remove command works correctly 1 ", () => {
    const res = remove(1,0);
    expect(res[1]).toStrictEqual(false);
})

test("Remove command works correctly 2", () => {
    const res = remove(1);
    expect(songs2).toStrictEqual(["Jva", "Python", "JS"]);
})

test("Remove command works correctly 3", () => {
    const res = remove(1, 3);
    expect(songs2).toStrictEqual([]);
})