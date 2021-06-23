const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let sampleId;
const fakeId = '3213fdsfsdf31fd3sf';

suite('Functional Tests', function () {
  test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .post('/api/issues/test_project')
      .set("content-type", "application/json")
      .send({
        issue_title: 'teste1',
        issue_text: 'teste1',
        created_by: 'teste1',
        assigned_to: 'teste1',
        status_text: 'teste1',
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      })
      .end(function (err, res) {
        sampleId = res.body._id
        assert.equal(res.body.issue_title, 'teste1')
        assert.equal(res.body.issue_text, 'teste1')
        assert.equal(res.body.created_by, 'teste1')
        assert.equal(res.body.assigned_to, 'teste1')
        assert.equal(res.body.status_text, 'teste1')
        assert.equal(res.body.open, true)
        done();
      })
  })

  test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .post('/api/issues/test_project')
      .set("content-type", "application/json")
      .send({
        issue_title: 'teste1',
        issue_text: 'teste1',
        created_by: 'teste1',
      })
      .end(function (err, res) {

        assert.equal(res.body.issue_title, 'teste1')
        assert.equal(res.body.issue_text, 'teste1')
        assert.equal(res.body.created_by, 'teste1')
        assert.equal(res.body.open, true)

        done();
      })
  })

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .post('/api/issues/test_project')
      .set("content-type", "application/json")
      .send({
        issue_title: 'teste1',
      })
      .end(function (err, res) {

        assert.equal(Object.keys(res.body).length, 1)
        assert.equal(res.body.error, 'required field(s) missing')

        done();
      })
  })

  test('View issues on a project: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get('/api/issues/test_project')
      .set("content-type", "application/json")
      .end(function (err, res) {

        assert.isArray(res.body, 'is array not OK')
        res.body.forEach(function (issue) {
          assert.isObject(issue, 'is object not OK')
          assert.isTrue(issue.hasOwnProperty('issue_title'), 'does not has issue_title property')
          assert.isTrue(issue.hasOwnProperty('issue_text'), 'does not has issue_text property')
          assert.isTrue(issue.hasOwnProperty('created_by'), 'does not has created_by property')
          assert.isTrue(issue.hasOwnProperty('assigned_to'), 'does not has assigned_to property')
          assert.isTrue(issue.hasOwnProperty('status_text'), 'does not has status_text property')
          assert.isTrue(issue.hasOwnProperty('created_on'), 'does not has created_on property')
          assert.isTrue(issue.hasOwnProperty('updated_on'), 'does not has updated_on property')
          assert.isTrue(issue.hasOwnProperty('open'), 'does not has open property')

        })

        done();
      })
  })

  test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get('/api/issues/test_project')
      .query({ issue_title: 'teste1' })
      .set("content-type", "application/json")
      .end(function (err, res) {

        assert.isArray(res.body, 'is array not OK')
        res.body.forEach(function (issue) {
          assert.isObject(issue, 'is object not OK')
          assert.equal(issue.issue_title, 'teste1')
        })

        done();
      })
  })

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get('/api/issues/test_project')
      .query({ issue_title: 'teste1', issue_text: 'teste1' })
      .set("content-type", "application/json")
      .end(function (err, res) {

        assert.isArray(res.body, 'is array not OK')
        res.body.forEach(function (issue) {
          assert.isObject(issue, 'is object not OK')
          assert.equal(issue.issue_title, 'teste1')
          assert.equal(issue.issue_text, 'teste1')
        })

        done();
      })
  })

  test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/test_project')
      .send({ _id: sampleId, issue_title: 'teste2' })
      .set("content-type", "application/json")
      .end(function (err, res) {

        assert.equal(Object.keys(res.body).length, 2)
        assert.equal(res.body.result, 'successfully updated')
        assert.equal(res.body._id, sampleId)

        done();
      })
  })

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/test_project')
      .send({ _id: sampleId, issue_title: 'teste2', issue_text: 'teste2' })
      .set("content-type", "application/json")
      .end(function (err, res) {

        assert.equal(Object.keys(res.body).length, 2)
        assert.equal(res.body.result, 'successfully updated')
        assert.equal(res.body._id, sampleId)

        done();
      })
  })

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/test_project')
      .send({ _id: sampleId, issue_title: 'teste2', issue_text: 'teste2' })
      .set("content-type", "application/json")
      .end(function (err, res) {

        assert.equal(Object.keys(res.body).length, 2)
        assert.equal(res.body.result, 'successfully updated')
        assert.equal(res.body._id, sampleId)

        done();
      })
  })

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/test_project')
      .send({ issue_title: 'teste2', issue_text: 'teste2' })
      .set("content-type", "application/json")
      .end(function (err, res) {

        assert.equal(Object.keys(res.body).length, 1)
        assert.equal(res.body.error, 'missing _id')

        done();
      })
  })

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/test_project')
      .send({ _id: sampleId })
      .set("content-type", "application/json")
      .end(function (err, res) {

        assert.equal(Object.keys(res.body).length, 2)
        assert.equal(res.body.error, 'no update field(s) sent')
        assert.equal(res.body._id, sampleId)

        done();
      })
  })

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/test_project')
      .send({ _id: sampleId })
      .set("content-type", "application/json")
      .end(function (err, res) {

        assert.equal(Object.keys(res.body).length, 2)
        assert.equal(res.body.error, 'no update field(s) sent')
        assert.equal(res.body._id, sampleId)

        done();
      })
  })

  test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .delete('/api/issues/test_project')
      .send({ _id: sampleId })
      .set("content-type", "application/json")
      .end(function (err, res) {

        assert.equal(Object.keys(res.body).length, 2)
        assert.equal(res.body.result, 'successfully deleted')
        assert.equal(res.body._id, sampleId)

        done();
      })
  })

  test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .delete('/api/issues/test_project')
      .send({ _id: '' })
      .set("content-type", "application/json")
      .end(function (err, res) {

        console.log(res.body)

        assert.equal(Object.keys(res.body).length, 1)
        assert.equal(res.body.error, 'missing _id')

        done();
      })
  })

});
