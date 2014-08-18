
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
//Parse.Cloud.define("hello", function(request, response) {
//  response.success("Hello world!");
//});

//Parse.Cloud.beforeSave("Question", function(request, response) {
//	console.log("inside question b4save,"+request.object.id);
//	response.success();
//});

Parse.Cloud.afterSave("Question", function(request) {
	//console.log("inside question aftersave,"+request.object.id);
	Parse.Cloud.useMasterKey();
	if (!request.object.existed())
	{
		//console.log("Object didn't exist");
		var Ques = Parse.Object.extend("Question");
		var Usr = Parse.Object.extend("User");
		var ans1Obj = request.object.get("answer1");
		var ans2Obj = request.object.get("answer2");
		var ans3Obj = request.object.get("answer3");
		var ans4Obj = request.object.get("answer4");
		var ans5Obj = request.object.get("answer5");
		var qs = new Ques();
		//var updusr = new Usr();
		qs.id = request.object.id;
		var user = Parse.User.current();

		//console.log("user,"+user);
		//console.log("user,"+user.id);
		
		//Update user's question count (for notification)
		if (typeof(user) != "undefined" && user != null)
		{
				
						//console.log("Trying user fetch,"+Parse.User.current().get("notifPtr"));
						var notifObj = Parse.User.current().get('notifPtr');
						if (typeof(notifObj) != "undefined"){
								notifObj.increment('qstnCnt');
								notifObj.save();
						}
				
		}

		if (typeof(ans1Obj) != "undefined"){
			ans1Obj.fetch().then(function(ans) {
				ans.set('ptrQuestion',  qs);
				ans.save();
			});
		}
		if (typeof(ans2Obj) != "undefined"){
			ans2Obj.fetch().then(function(ans) {
				ans.set('ptrQuestion',  qs);
				ans.save();
			});
		}
		if (typeof(ans3Obj) != "undefined"){
			ans3Obj.fetch().then(function(ans) {
				ans.set('ptrQuestion',  qs);
				ans.save();
			});
		}
		if (typeof(ans4Obj) != "undefined"){
			ans4Obj.fetch().then(function(ans) {
				ans.set('ptrQuestion',  qs);
				ans.save();
			});
		}
		if (typeof(ans5Obj) != "undefined"){
			ans5Obj.fetch().then(function(ans) {
				ans.set('ptrQuestion',  qs);
				ans.save();
			});
		}
	}

});

//Parse all hashtags and store
var _ = require("underscore");
Parse.Cloud.beforeSave("Question", function(request, response) {
	var post = request.object;

	Parse.Cloud.useMasterKey();
	//Only do this in first save
	if (request.object.isNew())
	{
		//console.log("IsNew check passed");
	
	var toLowerCase = function(w) { return w.toLowerCase(); };

	var words = post.get("data").split(/\b/);
	words = _.map(words, toLowerCase);
	var stopWords = ["the", "in", "and", "why", "how", "what", "when", "or", "where", "is", "was", "were", "are"]
	words = _.filter(words, function(w) { return w.match(/^\w+$/) && ! _.contains(stopWords, w); });

	var hashtags = post.get("data").match(/#.+?\b/g);
	hashtags = _.map(hashtags, toLowerCase);

	post.set("words", words);
	post.set("tags", hashtags);
	}


	response.success();
});

Parse.Cloud.beforeSave("Answer", function(request, response) {
	Parse.Cloud.useMasterKey();
	var qsObj = request.object.get("ptrQuestion");

	var Ques = Parse.Object.extend("Question");
	var qs = new Ques();

	var user = Parse.User.current();
	var Usr = Parse.Object.extend("User");
	//var updusr = new Usr();

	//console.log("Dirty count,"+request.object.dirty("count"));
	//console.log("Current count,"+request.object.get("count"));
	//console.log("isNew,"+request.object.isNew());

	//This query not functional yet. Requried for checking previous count
	//So that increment will not be greater than 1
	/*
	if (!request.object.isNew()) {
		//var query = new Parse.Query("Answer");
		var query = new Parse.Query(Parse.User);
		query.get(request.object.id, { // Gets row you're trying to update
			success: function(row) {
				console.log("Inside success");
				if (row.get('count') !== null)
					alert("Query count,"+row.get("count"));

					//response.error('Not allowed to change your choice once submitted');
				//response.success(); // Only after we check for error do we call success
			},
			error: function(row, error) {
				alert("Query count not found");
				//response.error(error.message);
			}
		});
	}*/

	//This check makes sure that some change has happened to count
	if (!request.object.isNew() && request.object.dirty("count")) 
	{
		if (typeof(qsObj) != "undefined")
		{
			qs.id = request.object.get("ptrQuestion").id;
			qs.increment('trendscore');
			if (typeof(user) != "undefined" && user != null)
			{
				//Update user's answer count (for notification)
				{
					/*
					   updusr.id = user.id;
					   updusr.increment('ansCnt');
					   updusr.save();
					   */
						//console.log("Trying user fetch,"+Parse.User.current().get("notifPtr"));
						var notifObj = Parse.User.current().get('notifPtr');
						if (typeof(notifObj) != "undefined"){
								notifObj.increment('ansCnt');
								notifObj.save();
						}
				}
				if(user.get("sex") == "male")
				{
					qs.increment('mcount');
				}
				if(user.get("age") < 20 )
				{
					qs.increment('countteen');
				}
				if(user.get("age") >= 20  && user.get("age") < 30)
				{
					qs.increment('count20plus');
				}
				if(user.get("age") >= 30  && user.get("age") < 40)
				{
					qs.increment('count30plus');
				}
				if(user.get("age") >= 40 )
				{
					qs.increment('count40plus');
				}
				qs.save();
			}

			//new vote is casted, update vote table
			var Vote = Parse.Object.extend("Vote");
			var voteObj = new Vote();

			var Ans = Parse.Object.extend("Answer");
			var ans = new Ans();
			ans.id = request.object.id;

			voteObj.set("user", user);
			voteObj.set("ans", ans);

			voteObj.save(null, {
				success: function(voteObj) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + voteObj.id);
					//var voteRelation = request.object.relation("votes");
					//voteRelation.add(voteObj);
					//console.log('Added vote relation');
				},
				error: function(voteObj, error) {
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and description.
					console.log('Failed to create new object, with error code: ' + error.message);
				}
			});
		}
	}

	response.success();
});

Parse.Cloud.afterSave("Vote", function(request) {
	//console.log("inside question aftersave,"+request.object.id);
	Parse.Cloud.useMasterKey();
	//console.log("Object didn't exist");
	//var user = Parse.User.current();
	var ansObj = request.object.get("ans");

	//console.log("user,"+user);
	//console.log("user,"+user.id);

	//Update user's question count (for notification)
	if (typeof(ansObj)!="undefined" &&  ansObj != null)
	{
		var voteRelation = ansObj.relation("votes");
		voteRelation.add(request.object);
		ansObj.save();
		console.log('Added vote relation');
		
	}

});


Parse.Cloud.job("tscoreZeroing", function(request, status) {
	//Set up to modify user data
	//Parse.Cloud.useMasterKey();
	var Quest = Parse.Object.extend("Question");
	var query = new Parse.Query(Quest);
	query.each(function(qs) {
		// Update to plan value passed in
		qs.set("trendscore", 0);
		return qs.save();
	}).then(function() {
		status.success("Trend score zeroing done.");
	}, function(error) {
		status.error("Trend score zeroing, something went wrong.");
	});
});


//Create a notification object per user
Parse.Cloud.afterSave(Parse.User, function(request) {
	Parse.Cloud.useMasterKey();  
	//new vote is casted, update vote table
	if (!request.object.existed())
{
	var Notif = Parse.Object.extend("Notification");
	var Usr = Parse.Object.extend("User");
	var notifObj = new Notif();
	var updusr = new Usr();

	notifObj.set("userid", request.user.id);

	notifObj.save(null, {
		success: function(notifObj) {
			// Execute any logic that should take place after the object is saved.
			console.log('New object created with objectId: ' + notifObj.id);
			if (typeof(request.user) != "undefined" && request.user != null)
	{
		updusr.id = request.user.id;
		updusr.set('notifPtr', notifObj);
		updusr.save();
	}
		},
		error: function(notifObj, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and description.
			console.log('Failed to create new object, with error code: ' + error.message);
		}
	});
}

});

Parse.Cloud.define("votedAns", function(request, response) {
	var query = new Parse.Query("Question");
	query.include("answer1");
	query.include("answer2");
	query.include("answer3");
	query.include("answer4");
	query.include("answer5");
	query.get(request.params.question, {
		success: function(result) {
			console.log("Inside success");
			var ansno = null;
			var ans1Obj = result.get("answer1");
			var ans2Obj = result.get("answer2");
			var ans3Obj = result.get("answer3");
			var ans4Obj = result.get("answer4");
			var ans5Obj = result.get("answer5");
			
			if (typeof(ans1Obj) != "undefined"){
				console.log("Answer 1 defined,"+ans1Obj.getRelation('votes'));
			}
			/*
			if (typeof(ans1Obj) != "undefined"){
				//console.log("Answer 1 defined,");
				if(ans1Obj.get('voters'))
					if (ans1Obj.get('voters').indexOf(request.params.userid) != -1)
						ansno = 1;
			}
			if (typeof(ans2Obj) != "undefined"){
				//console.log("Answer 2 defined");
				if(ans2Obj.get('voters'))
					if (ans2Obj.get('voters').indexOf(request.params.userid) != -1)
						ansno = 2;
			}
			if (typeof(ans3Obj) != "undefined"){
				//console.log("Answer 3 defined");
				if(ans3Obj.get('voters'))
					if (ans3Obj.get('voters').indexOf(request.params.userid) != -1)
						ansno = 3;
			}
			if (typeof(ans4Obj) != "undefined"){
				//console.log("Answer 4 defined");
				if(ans4Obj.get('voters'))
					if (ans4Obj.get('voters').indexOf(request.params.userid) != -1)
						ansno = 4;
			}
			if (typeof(ans5Obj) != "undefined"){
				//console.log("Answer 4 defined");
				if(ans5Obj.get('voters'))
					if (ans5Obj.get('voters').indexOf(request.params.userid) != -1)
						ansno = 5;
			}*/
			response.success(ansno);
		},
		error: function() {
			response.error("Question lookup failed");
		}
	});
});

