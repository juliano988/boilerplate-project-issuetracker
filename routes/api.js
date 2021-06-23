'use strict';

const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const issueSchema = new mongoose.Schema({
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean
});

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      const Issue = mongoose.model(project, issueSchema);
      console.log(req.query.open !== 'true' && req.query.open !== 'false' ? 'a' : req.query.open === 'true' ? 'b' : 'c')
      Issue.find(Object.assign({
        issue_title: new RegExp(req.query.issue_title, 'i'),
        issue_text: new RegExp(req.query.issue_text, 'i'),
        created_by: new RegExp(req.query.created_by, 'i'),
        assigned_to: new RegExp(req.query.assigned_to, 'i'),
        status_text: new RegExp(req.query.status_text, 'i'),
      }, req.query.open && { open: req.query.open })
        , function (err, docs) {
          if (err) res.status(500).json({ message: 'Internal server error' });
          res.json(docs)
        })
    })

    .post(async function (req, res) {
      if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
        let project = req.params.project;
        const Issue = mongoose.model(project, issueSchema);
        const newIssue = new Issue({
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || '',
          status_text: req.body.status_text || '',
          created_on: new Date(),
          updated_on: new Date(),
          open: true
        });
        await newIssue.save(function (err, doc) {
          if (err) res.status(500).json({ message: 'Internal server error' });
          res.status(200).json(doc)
        });
      } else {
        res.status(200).json({ error: 'required field(s) missing' });
      }
    })

    .put(function (req, res) {
      if (req.body._id) {
        if (Object.keys(req.body).length > 1) {
          let project = req.params.project;
          const Issue = mongoose.model(project, issueSchema);
          Issue.findByIdAndUpdate(req.body._id, {
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            assigned_to: req.body.assigned_to,
            status_text: req.body.status_text,
            updated_on: new Date(),
            open: req.body.open === 'false' ? false : true
          }, { new: true, omitUndefined: true }, function (err, doc) {
            if (err) res.status(500).json({ error: 'could not update', '_id': req.body._id });
            res.status(200).json({ result: 'successfully updated', '_id': req.body._id });
          })
        }else{
          res.status(200).json({ error: 'no update field(s) sent', '_id': req.body._id });
        }
      } else {
        res.status(200).json({ error: 'missing _id' });
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
