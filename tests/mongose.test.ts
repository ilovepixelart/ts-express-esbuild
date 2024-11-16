import mongoose from 'mongoose'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'

import type { Connection } from 'mongoose'

describe('mongoose', () => {
  let connection: Connection

  beforeAll(async () => {
    const mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()

    connection = await mongoose.createConnection(uri).asPromise()
    await connection.collection('migrations').deleteMany({})
  })

  afterAll(async () => {
    await connection?.close()
  })

  it('should insert a doc into collection', async () => {
    const users = connection.db?.collection('users')

    const mockUser = { name: 'John' }
    const user = await users?.insertOne(mockUser)

    const insertedUser = await users?.findOne({ _id: user?.insertedId })
    expect(insertedUser).toEqual(mockUser)
  })
})
