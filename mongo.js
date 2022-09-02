const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@phonebookcluster.wqryteg.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

mongoose
    .connect(url)
    .then((result) => {

        if (process.argv.length === 5) {
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            });

            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
            return person.save();
        }
        else {
            Person.find({}).then((result) => {
                console.log("phonebook:");
                result.forEach(person => {
                    console.log(`${person.name} ${person.number}`);
                })
                return mongoose.connection.close();
            })
        }
    })
    .then((result) => {
        return mongoose.connection.close();
    })
    .catch((error) => {
        console.log(error);
    })