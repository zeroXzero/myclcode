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

    var ans1Text = qObj.get("ans1_text");
    var ans1Count = qObj.get("ans1_count");
    if (ans1Text != null){
        qJson.a1 = {
            't' : ans1Text
        };
        var count1 = 0;
        if(ans1Count != null){
            count1 = ans1Count;
        }
        qJson.a1.c = count1;
    }

    var ans2Text = qObj.get("ans2_text");
    var ans2Count = qObj.get("ans2_count");
    if (ans2Text != null){
        qJson.a2 = {
            't' : ans2Text
        };
        var count2 = 0;
        if(ans2Count != null){
            count2 = ans2Count;
        }
        qJson.a2.c = count2;
    }

    var ans3Text = qObj.get("ans3_text");
    var ans3Count = qObj.get("ans3_count");
    if (ans3Text != null){
        qJson.a3 = {
            't' : ans3Text
        };
        var count3 = 0;
        if(ans3Count != null){
            count3 = ans3Count;
        }
        qJson.a3.c = count3;
    }

    var ans4Text = qObj.get("ans4_text");
    var ans4Count = qObj.get("ans4_count");
    if (ans4Text != null){
        qJson.a4 = {
            't' : ans4Text
        };
        var count4 = 0;
        if(ans4Count != null){
            count4 = ans4Count;
        }
        qJson.a4.c = count4;
    }

    var ans5Text = qObj.get("ans5_text");
    var ans5Count = qObj.get("ans5_count");
    if (ans5Text != null){
        qJson.a5 = {
            't' : ans5Text
        };
        var count5 = 0;
        if(ans1Count != null){
            count5 = ans5Count;
        }
        qJson.a5.c = count5;
    }

    return qJson;
};