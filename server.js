// CHEERIO AND AXIOS CALL

var cheerio = require("cheerio");
var axios = require("axios");

console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from Metal Injection blog articles:" +
            "\n***********************************\n");

axios.get("https://metalinjection.net/").then(function(response) {

  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  $("span.category").each(function(i, element) {
	var category = $(element).text();
	var link = $(element)
	.children()
	.attr("rel");

	results.push({
		category: category
	});
	});
	console.log(results);

  $("h2.title").each(function(i, element) {

	var title = $(element).text();
	
	var link = $(element).children().attr("href");

		results.push({
    	title: title,
		link: link
		});
	
	});
  console.log(results);
});

// connect mongo db to server
// app.listen(3000, function() {
// 	console.log("App running on port 3000!");
//   });
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI);