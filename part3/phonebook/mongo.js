const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

const url = `mongodb+srv://root:${password}@myfirstcluster.l18erj3.mongodb.net/moocFullstack?retryWrites=true&w=majority&appName=myFirstCluster`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("person", personSchema);

const person = new Person({
  name: newName,
  number: newNumber,
});

if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name + " " + person.number);
    });
  });
} else if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log("person saved!");
  });
}
mongoose.connection.close();
