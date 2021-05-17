const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deleteID;
suite('Functional Tests', function() {
  suite('Routing Tests', function() {
    suite('3 POST Request Tests', function() {
      test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .post("/api/issues/projects")
          .set("content-type", "application/json")
          .send({
            issue_title: "Test",
            issue_text: "Functional test",
            created_by: "fCC",
            assigned_to: "Alan",
            status_text: "Not Done"　    
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            deleteID = res.body._id;
            assert.equal(res.body.issue_title, "Test");
            assert.equal(res.body.issue_text, "Functional test");
            assert.equal(res.body.created_by, "fCC");
            assert.equal(res.body.assigned_to, "Alan");
            assert.equal(res.body.status_text, "Not Done");

            done();
          })
      });
      test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .post("/api/issues/projects")
          .set("content-type", "application/json")
          .send({
            issue_title: "Test",
            issue_text: "Functional test",
            created_by: "fCC",
            assigned_to: "",
            status_text: ""　    
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Test");
            assert.equal(res.body.issue_text, "Functional test");
            assert.equal(res.body.created_by, "fCC");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.status_text, "");
            
            done();
          })
      });
      test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .post("/api/issues/projects")
          .set("content-type", "application/json")
          .send({
            issue_title: "",
            issue_text: "Functional test",
            created_by: "fCC",
            assigned_to: "",
            status_text: ""　    
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "required field(s) missing");
            
            done();
          })
      });
    })

    suite('3 GET Request Tests', function() {
      test('View issues on a project: GET request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .get("/api/issues/test-data")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 3);

            done();
          })
      });
      test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .get("/api/issues/test-data")
          .query({
            _id: "60a264ac60a1a234803a08be",
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
              "_id":"60a264ac60a1a234803a08be",
              "issue_title":"t1",
              "issue_text":"text1",
              "created_by":"alan",
              "created_on":"2021-05-17T12:42:20.129Z",
              "updated_on":"2021-05-17T12:42:20.129Z",
              "assigned_to":"",
              "open":true,
              "status_text":""
            })
            done();
          })
      });
      test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .get("/api/issues/test-data")
          .query({
            _id: "60a264c960a1a234803a08c3",
            created_by: "spencer",
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
              "_id":"60a264c960a1a234803a08c3",
              "issue_title":"t3",
              "issue_text":"text 3",
              "created_by":"spencer",
              "created_on":"2021-05-17T12:42:49.380Z",
              "updated_on":"2021-05-17T12:42:49.380Z",
              "assigned_to":"",
              "open":true,
              "status_text":""
            })
            done();
          })
      });
    })

    suite('5 PUT Request Tests', function() {
      test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .put("/api/issues/test-data-put")
          .send({
              _id: "60a293dfcc824709006a4efb",
              issue_text: "updated"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "60a293dfcc824709006a4efb");

            done();
          })
      });
      test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .put("/api/issues/test-data-put")
          .send({
              _id: "60a293e9cc824709006a4efe",
              issue_text: "updated 2",
              created_by: "spencer"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "60a293e9cc824709006a4efe");

            done();
          })
      });
      test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .put("/api/issues/test-data-put")
          .send({
              issue_text: "updated 3",
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");

            done();
          })
      });
      test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .put("/api/issues/test-data-put")
          .send({
              _id: "60a293fecc824709006a4f00",
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent");

            done();
          })
      });
      test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .put("/api/issues/test-data-put")
          .send({
              _id: "60a293fecc824709006a4f009",
              issue_text: "updated 3"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not update");

            done();
          })
      });
    })

    suite('3 DELETE Request Tests', function() {
      test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({
            _id: deleteID
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");

            done();
          })
      });
      test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({
            _id: "xyz1"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not delete");

            done();
          })
      });
      test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
        chai
          .request(server)
          .delete("/api/issues/projects")
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");

            done();
          })
      });
    })
  })
});
