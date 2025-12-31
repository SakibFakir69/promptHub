import request from 'supertest';
import { myApp } from '../app/src/index'; // make sure your app is exported without calling listen()

describe('POST /api/v1/user/create-user', () => {
  it('should return user created successfully', async () => {
    const res = await request(myApp)
      .post('/api/v1/user/create-user') // corrected endpoint
      .send({
        name: 'Sakib',
        email: 'sakib@example.com',
        password: '123456',
      })
      .set('Accept', 'application/json')

    // Assertions
    expect(res.statusCode).toBe(200);                 // HTTP 200 OK
    expect(res.body).toBeDefined();                  // Response body exists
    expect(Array.isArray(res.body)).toBe(true);      // Example: body is array
    expect(res.body[0]).toHaveProperty('name', 'Sakib'); // body has the expected name
    expect(res.body[0]).toHaveProperty('email', 'sakib@example.com'); // body has email
  },15000);

});
