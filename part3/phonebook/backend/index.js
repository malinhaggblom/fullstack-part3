const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Persons = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('post', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

let persons = [
    { 
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  Persons.find({}).then(persons => {
    response.json(persons)
  })
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  Persons.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number missing'
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Persons({
    name: body.name,
    number: body.number,
  })

  persons.save().then(savedPerson => {
    response.json(savedPerson)
  })

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/info', (request, response) => {
  const info  = `<div> <p>Phonebook has info for ${persons.length} people</p></div>
    <p>${new Date().toString()}</p>`
  response.send(info)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})