const Datastore = require('nedb')

/// tworzenie nosql-owej bazy danych (kolekcji)
const co1 = new Datastore({
    filename: __dirname+'/db/kolekcja01.db',
    autoload: true
});

// /// stworzenie wpisu do bazy danych
// const doc = {
//     a: "a",
//     b: "b"
// };

// /// dodanie wpisu doc do bazy danych i wywołanie consol.logów po jego dodaniu
// co1.insert(doc, function (err, newDoc) {
//     console.log("dodano dokument (obiekt):")
//     console.log(newDoc)
//     console.log("losowe id dokumentu: " + newDoc._id)
// });

console.log("PRZED FOR: " + new Date().getMilliseconds())
for (var i = 0; i < 3; i++) {
    let doc = {
        a: "a" + i,
        b: "b" + i
    };
    co1.insert(doc, function (err, newDoc) {
        console.log("id dokumentu: " + newDoc._id, "DODANO: " + new Date().getMilliseconds())
    });
}
/// js jest asynchroniczny, więc poniższy log wywoła się przed tymi w pętli
console.log("PO FOR: " + new Date().getMilliseconds())

/// znaleznie jednego wpisu o danej wartości pola
co1.findOne({ _id: 'JAkJYUrFDLK1K7P9' }, function (err, doc) {
    console.log("----- obiekt pobrany z bazy: ", doc)
    console.log("----- formatowanie obiektu js na format JSON: ")
    console.log(JSON.stringify(doc, null, 5))
});

/// pobranie wszystkich elementów z kolekcji
co1.find({}, function (err, docs) {
    console.log("----- tablica obiektów pobrana z bazy: \n")
    console.log(docs)
    console.log("----- sformatowany z wcięciami obiekt JSON: \n")
    console.log(JSON.stringify({ "docsy": docs }, null, 5))
});

/// znalezienie wszystkich wpisów o danych wartościach
co1.find({ a: "a1" }, function (err, docs) {
    console.log(JSON.stringify({ "docsy": docs }, null, 5))
});

/// zliczenie wszystkich dokumentów
co1.count({}, function (err, count) {
    console.log("dokumentów jest: ", count)
});
/// i to samo tylko z warunkiem
co1.count({ a: "a1" }, function (err, count) {
    console.log("dokumentów jest: ", count)
});

/// usunięcie pierwszego dokumentu spełniającego warunek
co1.remove({ a: "a2" }, {}, function (err, numRemoved) {
    console.log("usunięto dokumentów: ", numRemoved)
});
/// usunięcie wszystkich dokumentów spełniających warunek
co1.remove({ a: "a2" }, {multi: true}, function (err, numRemoved) {
    console.log("usunięto dokumentów: ", numRemoved)
});
/// usunięcie wszystkich dokumentów z kolekcji
co1.remove({}, { multi: true }, function (err, numRemoved) {
    console.log("usunięto wszystkie dokumenty: ", numRemoved)
});
