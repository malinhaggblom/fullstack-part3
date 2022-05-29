const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack-part3:${password}@cluster0.oxodvzr.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Persons = mongoose.model('Persons', personSchema)

const person = new Persons({
  name: 'Malin',
  number: '123',
})

// if (process.argv.length == 5) {
//   const person = new Persons({
//     name: process.argv[3],
//     number: process.argv[4]

//   })

  person.save().then(result => {
    console.log(`Added: ${process.argv[3]} Number: ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
// }
// else {
//   Persons
//     .find({})
//     .then(result => {
//       result.forEach(note => {
//         console.log(note)
//     })
//       mongoose.connection.close()
//   })
// } 