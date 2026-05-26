const express = require('express')
const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method ', request.method)
  console.log('Path ', request.path)
  console.log('Body ', request.body)
  console.log('---')
  next()
}

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const generateID = () => {
  return Math.floor(Math.random() * 1000000)
}

app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))

app.get('/api/persons', (req, res) => {
  res.status(200).json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()
  const html = `<p>Phonebook has info for ${persons.length} people</p>
        <p>${date.toString()}</p>
    `
  res.send(html)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const findPerson = persons.find((person) => person.id === id)
  if (findPerson) {
    return res.json(findPerson)
  } else {
    return res
      .status(400)
      .json({ error: 'Entry does not exist in the phonebook' })
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const findPerson = persons.find((person) => person.id === id)
  if (findPerson) {
    persons = persons.filter((person) => person.id !== id)
    return res.status(204).end()
  } else {
    return res
      .status(400)
      .json({ error: 'Entry does not exist in the phonebook' })
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Missing name or number' })
  }

  const validatePerson = persons.find((p) => p.name === body.name)
  if (validatePerson) {
    return res.status(400).json({ error: 'Name must be unique' })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateID(),
  }

  persons = persons.concat(newPerson)

  res.status(201).json(newPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'Unknown endpoint' })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
