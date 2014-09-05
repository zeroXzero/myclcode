
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
//Parse.Cloud.define("hello", function(request, response) {
//  response.success("Hello world!");
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
		var stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
						 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
						 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
						 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
						 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
						 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
						 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
						 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
						 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
						 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
						 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
						 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']

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
			qs.increment('slotVal');
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
	var qObj = request.object.get("question");

	//console.log("user,"+user);
	//console.log("user,"+user.id);

	//Update user's question count (for notification)
	if (typeof(qObj)!="undefined" &&  qObj != null)
	{
		var voteRelation = qObj.relation("votes");
        var votePtr = new Parse.Object("Vote");
        votePtr.id = request.object.id;

		voteRelation.add(votePtr);
        qObj.save();
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
		qs.set("slotVal", 0);
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

//Returns voted answer number if questionid and userid is provided
//input params questionid, userid
Parse.Cloud.define("votedAns", function(request, response) {
	Parse.Cloud.useMasterKey();  
	var query = new Parse.Query("Question");
	query.include("answer1");
	query.include("answer2");
	query.include("answer3");
	query.include("answer4");
	query.include("answer5");
	query.get(request.params.questionid, {
		success: function(result) {
			console.log("Inside success");
			var ansno = null;
			var ans1Obj = result.get("answer1");
			var ans2Obj = result.get("answer2");
			var ans3Obj = result.get("answer3");
			var ans4Obj = result.get("answer4");
			var ans5Obj = result.get("answer5");

			if (typeof(ans1Obj) != "undefined"){
				//console.log("Answer 1 relation, "+ans1Obj.relation('votes'));
				var voteRelation = ans1Obj.relation('votes');
				var vquery = voteRelation.query();
				vquery.equalTo("user",{
					__type: "Pointer",
					className: "_User",
					objectId: request.params.userid 
				});
				//console.log("Answer 1 query,"+vquery);
				vquery.find({
					success: function(results) {
						//alert("Successfully retrieved " + results.length + " scores.");
						//console.log("User query1 success"+results);
						if (results.length >0)
						{		
							ansno=1;
							response.success(ansno);
						}
					},
					error: function(error) {
						alert("Error");
						console.log("User query1 error"+error);
					}
				});
			}

			if (typeof(ans2Obj) != "undefined"){
				//console.log("Answer 2 relation,"+ans2Obj.relation('votes'));
				var voteRelation = ans2Obj.relation('votes');
				var vquery = voteRelation.query();
				vquery.equalTo("user",{
					__type: "Pointer",
					className: "_User",
					objectId: request.params.userid 
				});
				//console.log("Answer 2 query,"+vquery);
				vquery.find({
					success: function(results) {
						//alert("Successfully retrieved " + results.length + " scores.");
						//console.log("User query2 success"+results);
						if (results.length >0)
						{		
							ansno=2;
							response.success(ansno);
						}

					},
					error: function(error) {
						alert("Error");
						console.log("User query2 error"+error);
					}
				});
			}

			if (typeof(ans3Obj) != "undefined"){
				var voteRelation = ans3Obj.relation('votes');
				var vquery = voteRelation.query();
				vquery.equalTo("user",{
					__type: "Pointer",
					className: "_User",
					objectId: request.params.userid 
				});
				vquery.find({
					success: function(results) {
						//alert("Successfully retrieved " + results.length + " scores.");
						if (results.length >0)
						{		
							ansno=3;
							response.success(ansno);
						}

					},
					error: function(error) {
						alert("Error");
						console.log("User query3 error"+error);
					}
				});
			}

			if (typeof(ans4Obj) != "undefined"){
				var voteRelation = ans4Obj.relation('votes');
				var vquery = voteRelation.query();
				vquery.equalTo("user",{
					__type: "Pointer",
					className: "_User",
					objectId: request.params.userid 
				});
				vquery.find({
					success: function(results) {
						//alert("Successfully retrieved " + results.length + " scores.");
						if (results.length >0)
						{		
							ansno=4;
							response.success(ansno);
						}

					},
					error: function(error) {
						alert("Error");
						console.log("User query4 error"+error);
					}
				});
			}

			if (typeof(ans5Obj) != "undefined"){
				var voteRelation = ans5Obj.relation('votes');
				var vquery = voteRelation.query();
				vquery.equalTo("user",{
					__type: "Pointer",
					className: "_User",
					objectId: request.params.userid 
				});
				vquery.find({
					success: function(results) {
						//alert("Successfully retrieved " + results.length + " scores.");
						if (results.length >0)
						{		
							ansno=5;
							response.success(ansno);
						}

					},
					error: function(error) {
						alert("Error");
						console.log("User query5 error"+error);
					}
				});
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
},
	error: function() {
		response.error("Question lookup failed");
	}
});
});

//Returns total question count
Parse.Cloud.define("countQstn", function(request, response) {
	var query = new Parse.Query("Question");
	query.count({
		success: function(count) {
			//alert("Total Question count" + count);
			response.success(count);
		},
		error: function(error) {
			alert("Error");
			response.error("Count lookup failed");
		}
	});
});

//Returns the latest question 
Parse.Cloud.define("latestFeed", function(request, response) {
	Parse.Cloud.useMasterKey();  
	var query = new Parse.Query("Question");
	query.include("answer1");
	query.include("answer2");
	query.include("answer3");
	query.include("answer4");
	query.include("answer5");
	query.descending("createdAt");
	query.limit(request.params.count);
	query.skip(request.params.skipcnt);

	query.find({
		success: function(result) {
			console.log("Inside success");
			//for (var i = 0; i < result.length; i++) {
			//	console.log("objid"+ i + result[i].id); 
			//}
			response.success(result);
		}
				 ,
				 error: function() {
					 response.error("Question lookup failed");
				 }
	});
});

//Returns the trending question 
Parse.Cloud.define("trendingFeed", function(request, response) {
	Parse.Cloud.useMasterKey();  
	var query = new Parse.Query("Question");
	query.include("answer1");
	query.include("answer2");
	query.include("answer3");
	query.include("answer4");
	query.include("answer5");
	query.descending("zscore");
	query.limit(request.params.count);
	query.skip(request.params.skipcnt);

	query.find({
		success: function(result) {
			console.log("Inside success");
			//for (var i = 0; i < result.length; i++) {
			//	console.log("objid"+ i + result[i].id); 
			//}
			response.success(result);
		}
				 ,
				 error: function() {
					 response.error("Question lookup failed");
				 }
	});
});

//Returns latest questions for an userid 
Parse.Cloud.define("userlatestFeed", function(request, response) {
	Parse.Cloud.useMasterKey();  
	var query = new Parse.Query("Question");
	query.include("answer1");
	query.include("answer2");
	query.include("answer3");
	query.include("answer4");
	query.include("answer5");
	query.include("user");
	//query.descending("createdAt");
	query.equalTo("user",{
		__type: "Pointer",
		className: "_User",
		objectId: request.params.userid 
	});
	query.limit(request.params.count);
	query.skip(request.params.skipcnt);

	query.find({
		success: function(result) {
			console.log("Inside success");
			//for (var i = 0; i < result.length; i++) {
			//	console.log("objid"+ i + result[i].id); 
			//}
			response.success(result);
		}
				 ,
				 error: function() {
					 response.error("Question lookup failed");
				 }
	});
});

//Returns latest answers for an userid 
Parse.Cloud.define("userAnswered", function(request, response) {
	Parse.Cloud.useMasterKey();  
	var query = new Parse.Query("Vote");
	query.include("ans");
	query.include("user");
	//query.descending("createdAt");
	query.equalTo("user",{
		__type: "Pointer",
		className: "_User",
		objectId: request.params.userid 
	});
	query.limit(request.params.count);
	query.skip(request.params.skipcnt);

	query.find({
		success: function(result) {
			console.log("Inside success");
			var retarr = new Array(result.length);
			for (var i = 0; i < result.length; i++) {
				//result[i].get('ans').get('ptrQuestion').fetch().then(function(qs) {
				//	retarr[i]=qs;
				//	if(i == result.length)
				//		response.success(retarr);
				//});
				retarr[i]=result[i].get('ans');
				if(i == (result.length-1))
					response.success(retarr);
			}
		}
				 ,
				 error: function() {
					 response.error("Question lookup failed");
				 }
	});
});

Parse.Cloud.define("queryFeedorg", function(request, response) {
    Parse.Cloud.useMasterKey();

    var conv = require('cloud/questionConverter.js');

    var query = new Parse.Query("Question");
    query.include("answer1");
    query.include("answer2");
    query.include("answer3");
    query.include("answer4");
    query.include("answer5");
    query.include("user");
    query.descending("createdAt");

    query.limit(request.params.limit);
    query.skip(request.params.skip);

    var resultJson = [];

    query.find().then(function(results){

        var promise = Parse.Promise.as();
        _.each(results, function(result) {
            var relation = result.relation("votes");
            var voteQuery = relation.query();
            voteQuery.include("user");
            voteQuery.limit(1);
            voteQuery.equalTo("user",{
                __type: "Pointer",
                className: "_User",
                objectId: request.params.userId
            });

            promise = promise.then(function() {
                return voteQuery.find();
            }).then(function(votes){
                var qJson = conv.questionToJson(result);
                if(votes.length > 0){
                    var userVote = votes[0];
                    qJson.v = true;
                    qJson.ma = userVote.get('ans');
                }else{
                    qJson.v = false;
                    qJson.ma = 0;
                }
                resultJson.push(qJson);
            });
        });

        return promise;
    }).then(function() {
        response.success(resultJson);
    }, function(error) {
        response.error(error);
    });
});

Parse.Cloud.define("queryFeed", function(request, response) {
	Parse.Cloud.useMasterKey();

	var conv = require('cloud/questionConverter.js');

	var query = new Parse.Query("Question");
	query.include("answer1");
	query.include("answer2");
	query.include("answer3");
	query.include("answer4");
	query.include("answer5");
	query.include("user");
	query.descending("createdAt");

	query.limit(request.params.limit);
	query.skip(request.params.skip);

	var resultJson = [];

	query.find({
		success: function(results) {
			var objidArr = new Array(results.length);
			for (var i = 0; i < results.length; i++) {
				objidArr[i]=results[i].id;
			}

			var pointers = _.map(objidArr, function(objid) {
				var pointer = new Parse.Object("Question");
				pointer.id = objid;
				return pointer;
			});

			var votequery = new Parse.Query("Vote");
			votequery.equalTo("user",{
				__type: "Pointer",
				className: "_User",
				objectId: request.params.userId 
			});
			votequery.containedIn("question", pointers);

			votequery.find({
				success:function(votes){
					for (var i = 0; i < results.length; i++) {
						var qJson = conv.questionToJson(results[i]);
						for (var j = 0; j < votes.length; j++) {
							if(votes[j].get("question").id == results[i].id){
								var userVote = votes[j];
								qJson.v = true;
								qJson.ma = userVote.get('ans');
								break;
							}else{
								qJson.v = false;
								qJson.ma = 0;
							}
						}
						resultJson.push(qJson);
					}
					response.success(resultJson);
				},
				error: function() {
					response.error("Vote lookup failed");
				}
			});
		}
				 ,
				 error: function() {
					 response.error("Question lookup failed");
				 }
	});
});

Parse.Cloud.job("resetVoteCount", function(request, status) {
    //Set up to modify user data
    //Parse.Cloud.useMasterKey();
    var Ans = Parse.Object.extend("Answer");
    var query = new Parse.Query(Ans);
    query.each(function(ansObj) {
        // Update to plan value passed in
        ansObj.set("count", 0);
        return ansObj.save();
    }).then(function() {
        status.success("Trend score zeroing done.");
    }, function(error) {
        status.error("Trend score zeroing, something went wrong.");
    });
});

Parse.Cloud.job("resetQuestionCount", function(request, status) {
    //Set up to modify user data
    //Parse.Cloud.useMasterKey();
    var Ques = Parse.Object.extend("Question");
    var query = new Parse.Query(Ques);
    query.each(function(qObj) {
        // Update to plan value passed in
        qObj.set("mcount", 0);
        qObj.set("slotVal", 0);
		qObj.set("slotVal", 0);
		qObj.set("zscore", 0);
		qObj.set("avg", 0);
		qObj.set("sqrAvg", 0);
        qObj.set("countteen", 0);
        qObj.set("count20plus", 0);
        qObj.set("count30plus", 0);
        qObj.set("count40plus", 0);
        return qObj.save();
    }).then(function() {
        status.success("Trend score zeroing done.");
    }, function(error) {
        status.error("Trend score zeroing, something went wrong.");
    });
});


Parse.Cloud.job("updateZscore", function(request, status) {
	//Set up to modify user data
	//Parse.Cloud.useMasterKey();
	var Quest = Parse.Object.extend("Question");
	var query = new Parse.Query(Quest);
	//query.include("zscore");
	//query.include("avg");
	//query.include("sqrAvg");
	//query.include("slotVal");

	var decay = 0.8;

	query.each(function(qs) {
	
	console.log("Inside updatezscore___,");
	var avg = qs.get("avg");
	var sqrAvg = qs.get("sqrAvg");
	var slotVal = qs.get("slotVal");
	var zscore = -Number.MAX_VALUE;
	

	if(avg == 0 && sqrAvg == 0)
	{
		avg = slotVal; 
		sqrAvg = Math.pow(slotVal,2); 
	}
		else
	{
		avg = avg * decay + slotVal * (1 - decay);
		sqrAvg = sqrAvg * decay + Math.pow(slotVal,2) * (1 - decay);
	}

	var stdDev = Math.sqrt(sqrAvg - Math.pow(slotVal,2));
	if(stdDev)
	{
		zscore = (slotVal-avg)/stdDev; 
	}
	else
	{
		zscore = (slotVal-avg)*-Number.MAX_VALUE; 
	}
	

	// Update to plan value passed in
	qs.set("slotVal", 0);
	qs.set("zscore", zscore);
	qs.set("avg", avg);
	qs.set("sqrAvg", sqrAvg);
	return qs.save();
	}).then(function() {
		status.success("Updated scoring data");
	}, function(error) {
		status.error("Something went wrong with scoredata updation,"+error.message);
	});
});

Parse.Cloud.job("transformAnsTable", function(request, status) {
    //Set up to modify user data
    Parse.Cloud.useMasterKey();
    var Ques = Parse.Object.extend("Question");
    var query = new Parse.Query(Ques);
    query.include("answer1");
    query.include("answer2");
    query.include("answer3");
    query.include("answer4");
    query.include("answer5");
    query.each(function(qObj) {
        var ans1Obj = qObj.get("answer1");
        var ans2Obj = qObj.get("answer2");
        var ans3Obj = qObj.get("answer3");
        var ans4Obj = qObj.get("answer4");
        var ans5Obj = qObj.get("answer5");

        if (typeof(ans1Obj) != "undefined")
        {
            qObj.set("ans1_text", ans1Obj.get("text"));
            qObj.set("ans1_count", 0);
        }
        if (typeof(ans2Obj) != "undefined")
        {
            qObj.set("ans2_text", ans2Obj.get("text"));
            qObj.set("ans2_count", 0);
        }
        if (typeof(ans3Obj) != "undefined")
        {
            qObj.set("ans3_text", ans3Obj.get("text"));
            qObj.set("ans3_count", 0);
        }
        if (typeof(ans4Obj) != "undefined")
        {
            qObj.set("ans4_text", ans4Obj.get("text"));
            qObj.set("ans4_count", 0);
        }
        if (typeof(ans5Obj) != "undefined")
        {
            qObj.set("ans5_text", ans5Obj.get("text"));
            qObj.set("ans5_count", 0);
        }
        return qObj.save();
    }).then(function() {
        status.success("Answer table transformed.");
    }, function(error) {
        status.error("Answer export failed.");
    });
});
