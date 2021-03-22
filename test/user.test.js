const bcrypt = require('bcrypt')
const User = require('../models/User')
const supertest = require('supertest')
const {app, server} = require('../index')
const mongoose  = require('mongoose')

const api = supertest(app)

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const paswordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'miduroot', paswordHash })

    await user.save()
  })
  test('works as espected creating a fresh username', async () => {
    const userDB = await User.find({})
    const usersAtStart = userDB.map(user => user.toJSON())

    const newUser = {
      username: 'midudev',
      name: 'Miguel',
      password: 'twitch'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersDBAfter = await User.find({})
    const userAtEnd = usersDBAfter.map(user => user.toJSON())

    expect(userAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = userAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already not allowed', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'miduroot',
      name: 'Miguel',
      password: 'midutest'
    }

    const result = await api 
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.errors.username.message).toContain('`username` to be unique')



    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})