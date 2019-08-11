var config = { 
	apiKey: "AIzaSyDbvgjm5pSRtIblnauK35Ma_6U9cxmF7KU",
    authDomain: "train-scheduler-ab527.firebaseapp.com",
    databaseURL: "https://train-scheduler-ab527.firebaseio.com",
    projectId: "train-scheduler-ab527",
    storageBucket: "",
    messagingSenderId: "796386843822",
    appId: "1:796386843822:web:6468b42c33283561"
	  };
	  //sets up the firebase js object with our credentials
	  firebase.initializeApp(config);
	  
	  // Assign the reference to the database to a variable named 'database'
	  // var database = ...
	  var database = firebase.database();
	  
		// 2. Button for adding Trains
	setInterval(function(startTime) {
		$("#timer").html(moment().format('hh:mm a'))
	  }, 1000);
	  
	  // Capture Button Click
	  $("#addTrainBtn").on("click", function() {
		// Don't refresh the page!
		event.preventDefault();
	  
		// Code in the logic for storing and retrieving the most recent train information
		var name = $("#trainNameInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var firstTime = $("#trainTimeInput").val().trim();
		var frequency = $("#frequencyInput").val().trim();
		
		// Don't forget to provide initial data to your Firebase database. - set replaces old data
		//if you want to add more users than just the latest one, then use push
		//database.ref().set({
		var trainInfo = { 
		  formtrain: name,
		  formdestination: destination,
		  formfirsttime: firstTime,
		  formfrequency: frequency,
		  dateAdded: firebase.database.ServerValue.TIMESTAMP
		};
		  //this is added so we can get most resent user so we can get most recent user to brower and to do this we need to change the listener  
		database.ref().push({
			formtrain: name,
			formdestination: destination,
			formfirsttime: firstTime,
			formfrequency: frequency,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	  
		// Alert
		// alert("Train was successfully added");
	  
		// Clears all of the text-boxes
		$("#trainNameInput").val("");
		$("#destinationInput").val("");
		$("#trainTimeInput").val("");
		$("#frequencyInput").val("");
	  
	  });
	  
	  
	  // Firebase watcher + initial loader 
	  database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
		var train = childSnapshot.val().formtrain;
		var destination = childSnapshot.val().formdestination;
		var firstTime = childSnapshot.val().formfirsttime;
		var frequency = childSnapshot.val().formfrequency;
	  
		// First Time (pushed back 1 year to make sure it comes before current time)
		var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
		console.log(firstTimeConverted);
	  
		//determine Current Time
		var currentTime = moment();
		console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));
	  
		//get timer functioning
		$("#timer").text(currentTime.format("hh:mm a"));
	  
		// Difference between the times
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		console.log("DIFFERENCE IN TIME: " + diffTime);
	  
		// Time apart (remainder)
		var tRemainder = diffTime % frequency;
		console.log("Remainder: " + tRemainder);
	  
		//determine Minutes Away
		var minutesAway = frequency - tRemainder;
		console.log("MINUTES TILL TRAIN: " + minutesAway);
	  
		//determine Next Train Arrival
		var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
		console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));
	  
		
		//want to push to table to add new train 
		//add new table row
		//add new train information into row
		// Add each train's data into the table row
	  
		//adds back updated information
		$("#trainTable > tbody").append("<tr><td>" + train + "</td><td>" + destination + "</td><td>" +
		nextArrival + "</td><td>" + frequency + "</td><td>" + minutesAway + "</td></tr>");
	  
		
	  
	  // If any errors are experienced, log them to console.
	  }, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
	  });
	  
	  
	  //on click for deleting row if trash can is clicked
	  //this on click did not work, did some research and found another option
	  // $(".fa-trash").on("click", function() {
	  $("body").on("click", ".fa-trash", function() {
		$(this).closest("tr").remove(); 
		alert("delete button clicked");
	  });
	  
	  //I want to update time of minutesAway and nextArrival 
	  //I am not sure how to call the previous function and use the setInterval or setTimeout to update the time in that function, so once each train is called and time passes then this function empties the table body and pulls each train and redoes the math
	  // Update minutes away by triggering change in firebase children
	  function timeUpdater() {
		//empty tbody before appending new information
		$("#train-table > tbody").empty();
		
		database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
		var train = childSnapshot.val().formtrain;
		var destination = childSnapshot.val().formdestination;
		var frequency = childSnapshot.val().formfrequency;
		var firstTime = childSnapshot.val().formfirsttime;
	  
		// First Time (pushed back 1 year to make sure it comes before current time)
		var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
		console.log(firstTimeConverted);
	  
		// Current Time
		var currentTime = moment();
		console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));
		// $("#timer").html(h + ":" + m);
		$("#timer").text(currentTime.format("hh:mm a"));
		// Difference between the times
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		console.log("DIFFERENCE IN TIME: " + diffTime);
	  
		// Time apart (remainder)
		var tRemainder = diffTime % frequency;
		console.log("Remainder: " + tRemainder);
	  
		//determine Minutes Away
		var minutesAway = frequency - tRemainder;
		console.log("MINUTES TILL TRAIN: " + minutesAway);
	  
		//determine Next Train Arrival
		var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
		console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));
	  
	   //want to push to table to add new train 
		//add new table row
		//add new train information into row
		// Add each train's data into the table row
		$("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" aria-hidden="true"></i>' + "</td><td>" + name + "</td><td>" + destination + "</td><td>" +
		frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
	  
		})
	  };
	  
	  setInterval(timeUpdater, 6000);
	  