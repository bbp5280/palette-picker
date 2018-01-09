const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');


const environment = 'test';
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {

  it('should return the homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.includes('Palette Picker');
      })
      .catch(error => {
        throw (error);
      });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw (error);
      });
  });
});

describe('API Routes', (done) => {
  before((done) => {
    knex.migrate.latest()
      .then(() => done())
      .catch(error => { throw error; });
  });

  beforeEach((done) => {
    knex.seed.run()
      .then(() => done())
      .catch(error => { throw error; });
  });

  describe('GET /api/v1/projects', () => {
    it('should return all projects', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('project_name');
          response.body[0].project_name.should.equal('Project 1');
        })
        .catch(error => { throw error; });
    });
  });

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return pallets from a project id', () => {
      return chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('The thing');
          response.body[0].should.have.property('color_1');
          response.body[0].color_1.should.equal('#9495ea');
          response.body[0].should.have.property('color_2');
          response.body[0].color_2.should.equal('#eb325d');
          response.body[0].should.have.property('color_3');
          response.body[0].color_3.should.equal('#262389');
          response.body[0].should.have.property('color_4');
          response.body[0].color_4.should.equal('#5e268d');
          response.body[0].should.have.property('color_5');
          response.body[0].color_5.should.equal('#3057c2');
          response.body[0].should.have.property('project_id');
          response.body[0].project_id.should.equal(1);
        })
        .catch(error => { throw error; });
    });
  });


  it('should return 404 if project does not exist', () => {
    return chai.request(server)
      .get('/api/v1/projects/200/palettes')
      .then(response => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
      })
      .catch(error => { throw error; });
  });

  describe('POST /api/v1/projects', () => {
    it("should add new project to project table", (done) => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 25,
          project_name: 'Project 25'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('project_name');
          response.body.project_name.should.equal('Project 25');
          response.body.should.have.property('id');
          response.body.id.should.equal(25);
          done();
        })
        .catch(error => { throw error; });
    });
    it("should display an error if request body is missing parameter", (done) => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 25
        })
        .then(response => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('This project is missing a name');
          done();
        })
        .catch(error => { throw error; });
    });
  });

  describe('POST /api/v1/projects/:id/palettes', () => {
    it("should add new project to project table", (done) => {
      chai.request(server)
        .post('/api/v1/projects/1/palettes')
        .send({
          id: 5,
          name: 'The thing',
          color_1: '#9495ea',
          color_2: '#eb325d',
          color_3: '#262389',
          color_4: '#5e268d',
          color_5: '#3057c2',
          project_id: 1
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.id.should.be.a('object');
          response.body.id.should.have.property('id');
          response.body.id.should.have.property('name');
          response.body.id.name.should.equal('The thing');
          response.body.id.should.have.property('color_1');
          response.body.id.color_1.should.equal('#9495ea');
          response.body.id.should.have.property('color_2');
          response.body.id.color_2.should.equal('#eb325d');
          response.body.id.should.have.property('color_3');
          response.body.id.color_3.should.equal('#262389');
          response.body.id.should.have.property('color_4');
          response.body.id.color_4.should.equal('#5e268d');
          response.body.id.should.have.property('color_5');
          response.body.id.color_5.should.equal('#3057c2');
          response.body.id.should.have.property('project_id');
          response.body.id.project_id.should.equal(1);
          done();
        })
        .catch(error => { throw error; });
    });
    it("should display an error if request body is missing parameter", (done) => {
      chai.request(server)
        .post('/api/v1/projects/1/palettes')
        .send({
          id: 5,
          color_1: '#9495ea',
          color_2: '#eb325d',
          color_3: '#262389',
          color_4: '#5e268d',
          color_5: '#3057c2',
          project_id: 1
        })
        .then(response => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.error.should.equal('You are missing the name property');
          done();
        })
        .catch(error => { throw error; });
    });
  });

  

});
