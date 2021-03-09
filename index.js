require('dotenv').config()
require('./mongo.js')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErros = require('./middleware/handleErrors')



// const http = require('http')

app.use(cors())
app.use(express.json()) 


// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
//   })


app.get('/', (request, response) => {
  response.send('<h1>Hola Mundo</h2>')
})
app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})
app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  
  Note.findById(id).then(note => {
    if(note){
      response.json(note)
    }else{
      response.status(404).end()
    }
  }).catch(err => {
    next(err)
  })

})

app.delete('/api/notes/:id', async (request, response, next) => {
  const id = request.params.id
  try{
    await Note.findByIdAndDelete(id)
    response.status(204).end()
  }catch(err){
    next(err)
  }
  
  
})

app.post('/api/notes', async(request, response, next) => {
  const note = request.body

  if(!note || !note.content){
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    important: note.important || false,
    date: new Date().toISOString()
  })


  // newNote.save().then(savedNote => {
  //   response.status(201).json(savedNote)
  // })
  try {
    const savedNote = await newNote.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }

})

app.put('/api/notes/:id', (request, response) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }
  
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
})

app.use(notFound)

app.use(handleErros)

const PORT = process.env.PORT 

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


module.exports = {app, server}