import request from 'supertest';
import { createApp } from '../src/index'; // Adjust this import based on your structure
import { MikroORM } from '@mikro-orm/core';
import config from '../src/mikro-orm.config'; // Import the test config
import { faker } from '@faker-js/faker';

describe('User Routes', () => {
  // let app: any;
  // let userData: {
  //   firstname: string,
  //   lastname: string,
  //   username: string,
  //   email: string,
  //   password: string,
  //   id: Number
  // };
  let app;
  let userData; 

  beforeAll(async () => {

    userData = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: 'password123',
      id: 0 //to be changed
    };


    app = await createApp();
  });


  it('should register a new user', async () => {


    const res = await request(app)
      .post('/api/auth/users/signup')
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBe(userData.username);

    userData.id = res.body.user.id;
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/users/login')
      .send({
        usernameOrEmail: userData.email,
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBeDefined();
  });

  it('should fail to login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/users/login')
      .send({
        usernameOrEmail: userData.email,
        password: 'wrongpassword',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('password');
  });

  it('should get user by ID and not return passwordHash', async () => {
    const res = await request(app)
      .get(`/api/auth/users/${userData.id}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('should return 404 for non-existent user', async () => {
    const res = await request(app)
      .get('/api/auth/users/9999')
      .send();

    expect(res.status).toBe(404);
    expect(res.body.errors[0].message).toBe('User not found');
  });
});