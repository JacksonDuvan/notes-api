const express = require('express')
const app = express()
const cors = require('cors')
// const http = require('http')

app.use(cors())
app.use(express.json()) 

let notes = [
  {
    id: 1,
    content: 'HTML is easy and CSS',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
//   })


app.get('/', (request, response) => {
  response.send('<h1>Hola Mundo</h2>')
})
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === parseInt(id))

  if(note){
    response.json(note)
  }else{
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== parseInt(id))
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if(!note || !note.content){
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  response.status(201).json(newNote)
})

app.put('/api/notes/:id', (request, response) => {
  const { id } = request.params
  const note = request.body

  if(!note || !note.content){
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const searchNote = notes.filter(note => note.id === parseInt(id))
  searchNote[0].content = note.content
    
  response.json(searchNote)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
