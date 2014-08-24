exports.questionToJson = function(qObj){

    var qJson = {
      'i' : qObj.id,
      'c' : qObj.createdAt,
      'u' : qObj.updatedAt,
      'q' : qObj.get("data")
    };

    var user = qObj.get("user");
    qJson.ui = user.id;
    qJson.un = user.get("name");

    var ans1Obj = qObj.get("answer1");
    if (typeof(ans1Obj) != "undefined"){
        qJson.a1 = {
            'i' : ans1Obj.id,
            'c' : ans1Obj.get("text"),
            't' : ans1Obj.get("count")
        };
    }

    var ans2Obj = qObj.get("answer2");
    if (typeof(ans2Obj) != "undefined"){
        qJson.a2 = {
            'i' : ans2Obj.id,
            'c' : ans2Obj.get("text"),
            't' : ans2Obj.get("count")
        };
    }

    var ans3Obj = qObj.get("answer3");
    if (typeof(ans3Obj) != "undefined"){
        qJson.a3 = {
            'i' : ans3Obj.id,
            'c' : ans3Obj.get("text"),
            't' : ans3Obj.get("count")
        };
    }

    var ans4Obj = qObj.get("answer4");
    if (typeof(ans4Obj) != "undefined"){
        qJson.a4 = {
            'i' : ans4Obj.id,
            'c' : ans4Obj.get("text"),
            't' : ans4Obj.get("count")
        };
    }

    var ans5Obj = qObj.get("answer5");
    if (typeof(ans5Obj) != "undefined"){
        qJson.a5 = {
            'i' : ans5Obj.id,
            'c' : ans5Obj.get("text"),
            't' : ans5Obj.get("count")
        };
    }

    return qJson;
};