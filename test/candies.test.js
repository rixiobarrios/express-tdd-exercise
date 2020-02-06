const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:3000');

describe('GET /candies', function() {
  //tests will be written inside this function
  it('should return a 200 response', done => {
    api
      .get('/candies')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should return an array', done => {
    api
      .get('/candies')
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.body).to.be.an('array');
        done();
      });
  });

  it("should return an array of objects that have a field called 'name' ", done => {
    api
      .get('/candies')
      .set('Accept', 'application/json')
      .end((error, response) => {
        response.body.forEach(candy => {
          expect(candy).to.have.property('name');
        });
        done();
      });
  });
});

describe('POST /candies', () => {
  const newCandy = {
    id: 5,
    name: 'Lollipop',
    color: 'Red'
  };
  before(done => {
    api
      .post('/candies')
      .set('Accept', 'application/json')
      .send(newCandy)
      .end(done);
  });

  it('should add a candy object to the collection candies and return it', done => {
    api
      .get('/candies')
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.body.find(candy => candy.id === newCandy.id)).to.be.an(
          'object'
        );
        done();
      });
  });
});

//1. Write a test that makes sure the object is returned with right fields (i.e., id, name, color) when you call GET /candies/:id.
describe('GET /candies/:id', () => {
  it('should return a candy with correct fields', done => {
    api
      .get('/candies/1')
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('color');
        done();
      });
  });
});

// 2. Write a test that ensures an object is deleted from the array candies when you call DELETE / candies /: id.
describe('DELETE /candies/:id', () => {
  let previousLength;
  let idToDelete;

  before(done => {
    // find the id of the last candy
    api
      .get('/candies')
      .set('Accept', 'application/json')
      .end((error, response) => {
        previousLength = response.body.length;
        idToDelete = response.body[response.body.length - 1].id;
        done();
      });
  });

  before(done => {
    // delete the last candy
    api
      .delete(`/candies/${idToDelete}`)
      .set('Accept', 'application/json')
      .end((error, response) => {
        done();
      });
  });

  it('should have 1 less candy than the original array', done => {
    api
      .get('/candies')
      .set('Accept', 'application/json')
      .end((error, response) => {
        // assert that the response.body has decreased by 1
        expect(response.body.length).to.equal(previousLength - 1);
        // assert that the deleted candy is not in response.body
        expect(response.body.find(candy => candy.id === idToDelete)).to.equal(
          undefined
        );
        done();
      });
  });
});

// // 3. Write a test that ensures a property is updated when you call PUT / candies /: id.
describe('PUT /candies/:id', () => {
  let candyToUpdate;

  before(done => {
    // find the first candy
    api
      .get('/candies')
      .set('Accept', 'application/json')
      .end((error, response) => {
        candyToUpdate = response.body[0];
        done();
      });
  });
  before(done => {
    //update the candy name
    api
      .put(`/candies/${candyToUpdate.id}/edit`)
      .set('Accept', 'application/json')
      .send({
        id: candyToUpdate.id,
        name: 'Candy Cane',
        color: candyToUpdate.color
      })
      .end((error, response) => {
        done();
      });
  });
  it('can update a candy by id', done => {
    // see if the candy name got updated
    api
      .get(`/candies/${candyToUpdate.id}`)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.body.name).to.equal('Candy Cane');
        done();
      });
  });
});
