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
            'c' : ans1Obj.get("count"),
            't' : ans1Obj.get("text")
        };
    }

    var ans2Obj = qObj.get("answer2");
    if (typeof(ans2Obj) != "undefined"){
        qJson.a2 = {
            'i' : ans2Obj.id,
            'c' : ans2Obj.get("count"),
            't' : ans2Obj.get("text")
        };
    }

    var ans3Obj = qObj.get("answer3");
    if (typeof(ans3Obj) != "undefined"){
        qJson.a3 = {
            'i' : ans3Obj.id,
            'c' : ans3Obj.get("count"),
            't' : ans3Obj.get("text")
        };
    }

    var ans4Obj = qObj.get("answer4");
    if (typeof(ans4Obj) != "undefined"){
        qJson.a4 = {
            'i' : ans4Obj.id,
            'c' : ans4Obj.get("count"),
            't' : ans4Obj.get("text")
        };
    }

    var ans5Obj = qObj.get("answer5");
    if (typeof(ans5Obj) != "undefined"){
        qJson.a5 = {
            'i' : ans5Obj.id,
            'c' : ans5Obj.get("count"),
            't' : ans5Obj.get("text")
        };
    }

    return qJson;
};