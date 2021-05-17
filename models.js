const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new Schema({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    created_on: {type: Date, required: true},
    updated_on: Date,
    assigned_to: String,
    open: Boolean,
    status_text: String,
});
const Issue = mongoose.model('Issue', IssueSchema); // Issue model

const ProjectSchema = new Schema({
    name: {type: String, required: true},
    schemas: [IssueSchema]
})
const Project = mongoose.model('Project', ProjectSchema); // Project model

exports.Issue = Issue;
exports.Project = Project;