import {dbPath, dbPrefixPath, Database} from "../utils/database"


test("Database path is correct", () => {
    expect(dbPath).toBe("C:\\Users\\Tinoj\\Own Projects\\CyberMonkey2.2\\database");
})

test("Prefix path is correct", () => {
    expect(dbPrefixPath).toBe("C:\\Users\\Tinoj\\Own Projects\\CyberMonkey2.2\\database\\prefixes.json");
})

test("Correct prefixes are retrieved 1", async () => {
    const prefix = await Database.getPrefixForUser("237627547758624769");
    expect(prefix).toBe("¤");
})

test("Correct prefixes are retrieved 2", async () => {
    const prefix = await Database.getPrefixForUser("237627543758624769");
    expect(prefix).toBe("!");
})


test("Prefixes are correctly set", async () => {
    await Database.setPrefixForUser("Jefff", "!!");
    const prefix = await Database.getPrefixForUser("Jefff");
    expect(prefix).toBe("!!");
})