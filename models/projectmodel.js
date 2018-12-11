var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ProjectSchema = new Schema({

	html: {
		type: String,
	},
	css: {
		type: String,
	},
	javascript: {
		type: String,
	},
	name: {
		type: String,
	}
	
});
var Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;


