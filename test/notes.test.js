const mongoose = require('mongoose')
const supertest = require('supertest')
const {app, server} = require('../index')

const Note = require('../models/Note')
const { initialNotes } = require('./helpers')

const api = supertest(app)


beforeEach(async () => {
  await Note.deleteMany({})
  console.log('beforeEach')
  // Paralelo
  // const noteObjects = initialNotes.map(note => new Note(note))
  // const promises = noteObjects.map(note => note.save())
  // await Promise.all(promises)

  // Sequencial
  for(const note of initialNotes){
    const noteObject = new Note(note)
    await noteObject.save()
  }


  // initialNotes.forEach(note => {
  //   const noteObject = new Note(note)
  //   noteObject.save()
  // })

  // const note1 = new Note(initialNotes[0])
  // await note1.save()

  // const note2 = new Note(initialNotes[1])
  // await note2.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)

})
test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
    
})

test('the first note is midudev', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)
  expect(contents).toContain('Aprendiendo FullStack JS con midudev')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'Proximamente async/await',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)
  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(newNote.content)
})
test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)
 
  // const response = await api.get('/api/notes')
  // expect(response.body).toHaveLength(initialNotes.length)
})

test('a note can be deleted', async () => {
  const response = await api.get('/api/notes/')
  const {body: [noteToDelete]} = response
  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)
  
  const secondResponse = await api.get('/api/notes/')
  const contents = secondResponse.body.map(note => note.content)
  expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
  expect(contents).not.toContain(noteToDelete.content)
})

test('a note that do not exist can not be deleted', async () => {
  await api
    .delete('/api/notes/1234')
    .expect(400)
  
  const response = await api.get('/api/notes/')
  
  expect(response.body).toHaveLength(initialNotes.length)
})


afterAll(() => {
  mongoose.connection.close()  
  server.close()
})