let fs = require("fs");
let sqlite = require("sqlite3").verbose();

let dbFile = __dirname + "/database.db";
let fileExists = fs.existsSync(dbFile);

if(!fileExists) {
    fs.openSync(dbFile, "w");
}

let db = new sqlite.Database(dbFile);

db.serialize(function() {
    if(!fileExists) {
        db.run("CREATE TABLE Stuff (thing TEXT)");

        var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");
        var rnd;
        for (var i = 0; i < 10; i++) {
            rnd = Math.floor(Math.random() * 10000000);
            stmt.run("Thing #" + rnd);
        }
        stmt.finalize();
    }

    db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
        console.log(row.id + ": " + row.thing);
    });
})

db.close();