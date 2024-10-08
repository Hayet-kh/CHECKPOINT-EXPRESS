const express = require("express");
const path = require("path");

const app = express();
const port = 8000;

// Function to get the day of the week from a date string
function getDayOfWeek(dateString) {
	const date = new Date(dateString); // Convert the parameter datestring to a Date object
	const daysOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	// date.getDay() Returns an integer from 0 to 6
	return daysOfWeek[date.getDay()];
}

// Serve static files from the public directory
app.use(express.static(__dirname + "/public"));

// Set the template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware to check the time for the log - availibility of the app
const availibility = (req, res, next) => {
	let timestamp = Date.now(); // Get the current timestamp
	let availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
	let availableHours = [9, 10, 11, 12, 13, 14, 15, 16];
	let day = getDayOfWeek(timestamp);
	let hour = new Date(timestamp).getHours();

	if (availableDays.includes(day) && availableHours.includes(hour)) {
		console.log("The service is available"); // Continue to the next middleware or route handler
		next();
	} else {
		next("The service is not available"); // Pass error to the error-handling middleware
	}
};

app.use(availibility);

// Define the route for the home page
app.get("/", (req, res) => {
	res.render("index");
});

// Define the route for the Our Services page
app.get("/services", (req, res) => {
	res.render("services", { title: "OUR SERVICES" });
});

// Define the route for the Our Services page
app.get("/contact", (req, res) => {
	res.render("contact", { title: "CONTACT US" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
	console.error(err); // Log the error for debugging
	res.status(500).send("The service is not available, please try again later"); // Send a response to the client
});

// Start the server on port 8000
app.listen(port, () => {
	console.log(`Server is running on port ${port}`); // localhost:8000
});
