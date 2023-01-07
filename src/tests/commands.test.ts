import { CommandList } from "../commands/_CommandList"

CommandList.forEach(command => {
    test(`${command.name} name should be lowercase`, () => {
        expect(command.name == command.name.toLowerCase()).toBe(true);
    })
    test(`${command.name} aliases should all be lowercase`, () => {
        expect(command.aliases.every(alias => alias == alias.toLocaleLowerCase())).toBe(true);
    })
})


test("All names hould be distinct", () => {
    const names = new Array<string>();
    CommandList.forEach(command => names.push(command.name));
    const setOfNames = new Set(names);
    expect(names).toStrictEqual(Array.from(setOfNames))
});

test("All aliases hould be distinct", () => {
    const aliases = new Array<string>();
    CommandList.forEach(command => command.aliases.forEach(alias => aliases.push(alias)));
    const setOfAliases = new Set(aliases);
    expect(aliases).toStrictEqual(Array.from(setOfAliases))
});
