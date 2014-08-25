angular.module('project41', ['ionic'])

	.run(function($rootScope, $state, $ionicPlatform, $ionicLoading, $location, $ionicViewService, DBService) {

        $rootScope.isLoggedIn = false;

		$ionicPlatform.ready(function() {
			Parse.initialize("KtEEaus447TpIR7NTGJVQs3Oj982qM2Ccz8oEhke",
                   "JXkCo1P64s4qSKC89hOOm3ygTsl6WN7OsKngrWL5");

            var currentUser = Parse.User.current();
            if (currentUser) {
                DBService.user.id = currentUser.id;
                DBService.user.name = currentUser.attributes.name;
                $rootScope.isLoggedIn = true;
                $location.replace();
                $state.go('home');
                $location.replace();
            } else {
                $rootScope.isLoggedIn = false;
                $location.replace();
                $state.go('login');
                $location.replace();
            }
		});

        $rootScope.$on('$stateChangeStart', function(event, toState) {

            if (toState.name !== "login" && toState.name !== "logout" && $rootScope.isLoggedIn == false) {
                console.log("redirect to login");
                $location.replace();
                $state.go('login');
                $location.replace();
                event.preventDefault();
            }
        });
	})
	
	.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'

            })
            .state('home', {
                url: "/home",
                templateUrl: "templates/home.html",
                controller: 'HomeCtrl'

            })
            .state('category', {
                url: "/category",
                templateUrl: "templates/category.html",
                controller: 'CategoryCtrl'

            })
            .state('question', {
                url: "/question",
                templateUrl: "templates/question.html",
                controller: 'QuestionCtrl'

            });;
        $urlRouterProvider.otherwise('/login');
	})

    .factory('DBService', function(){
        return {
            results: [],
            queryCategory: function(successCallback){
                var cat = Parse.Object.extend("Category");
                var query = new Parse.Query(cat);
                query.find({
                    success: function(results) {
                        var cats = [];
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            cats.push({
                                id : object.id,
                                name : object.get('name')
                            });
                        }

                        successCallback(cats);
                    },
                    error: function(error) {

                    }
                });
            },
            checkCategory: function(name, successCallback){
                var cat = Parse.Object.extend("Category");
                var query = new Parse.Query(cat);
                query.equalTo("name", name);
                query.find({
                    success: function(results) {
                        if(results.length > 0) {
                            successCallback(true);
                        }else{
                            successCallback(false);
                        }
                    },
                    error: function(error) {

                    }
                });
            },
            saveCategory: function(name, successCallback){
                var category = Parse.Object.extend("Category");
                var cat = new category();

                cat.set("name", name);

                cat.save(null, {
                    success: function(gameScore) {
                        successCallback(true);
                    },
                    error: function(gameScore, error) {
                        successCallback(false);
                    }
                });
            },
            user:{

            }
        };
    })
    .controller('LoginCtrl', function ($rootScope, $scope, $state, $location, $ionicLoading, DBService) {

        $scope.showLoading = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };

        $scope.hideLoading = function(){
            $ionicLoading.hide();
        };


        $scope.facebookLogin = function () {

            Parse.FacebookUtils.logIn(null, {
                success: function(user) {
                    if (!user.existed()) {
                        DBService.user.id = user.id;
                        DBService.user.name = user.attributes.name;
                        $rootScope.isLoggedIn = true;
                        $location.replace();
                        $state.go('home');
                        $location.replace();
                    } else {
                        DBService.user.id = user.id;
                        DBService.user.name = user.attributes.name;
                        $rootScope.isLoggedIn = true;
                        $location.replace();
                        $state.go('home');
                        $location.replace();
                    }
                },
                error: function(user, error) {
                    alert("User cancelled the Facebook login or did not fully authorize.");
                }
            });
        };


        $scope.login = function(user)  {
            Parse.User.logIn(user.email, user.password, {
                success: function(user) {
                    DBService.user.id = user.id;
                    DBService.user.name = user.attributes.name;
                    $rootScope.isLoggedIn = true;
                    $location.replace();
                    $state.go('home');
                    $location.replace();
                },
                error: function(user, error) {
                    // The login failed. Check error to see why.
                }
            });

        };
    })
    .controller('HomeCtrl', function ($rootScope, $scope, $state, $location, $ionicLoading, DBService) {

        $scope.showLoading = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };

        $scope.hideLoading = function(){
            $ionicLoading.hide();
        };

        $scope.logout = function()  {
            Parse.User.logOut();
            DBService.user.id = null;
            DBService.user.name = null;
            $rootScope.isLoggedIn = false;
            $location.replace();
            $location.path('/login');
            $location.replace();
        };

        $scope.category = function()  {

            $location.path('/category');
        };

        $scope.ask = function()  {
            $location.path('/question');
        };
    })
    .controller('CategoryCtrl', function ($rootScope, $scope, $state, $location, $ionicLoading, DBService) {

        $scope.newCat = {
            name: ""
        };
        $scope.cats = [];
        $scope.showLoading = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };

        $scope.hideLoading = function(){
            $ionicLoading.hide();
        };

        $scope.query = function()  {
            $scope.showLoading();
            DBService.queryCategory(function(catList){
                if(catList){
                    for(var i=0;i<catList.length;i++){
                        $scope.cats.push(catList[i].name);
                    }
                }
                $scope.hideLoading();
            });
        };

        $scope.create = function(obj1)  {

            var data = obj1;
            if(!data || data.trim().length == 0)
            {
                return;
            }
            data = data.trim();

            $scope.showLoading();
            DBService.checkCategory(data, function(exists){
                if(exists){
                    $scope.hideLoading();
                }
                else{
                    DBService.saveCategory(data, function(obj){
                        if(obj){
                            $scope.cats.push(data);
                            $scope.newCat.name = "";
                        }
                        $scope.hideLoading();
                    });
                }
            });
        };

        $scope.query();
    })
    .controller('QuestionCtrl', function ($rootScope, $scope, $state, $location, $ionicLoading, DBService) {

        $scope.question = {
            data : "",
            cat: "",
            answer1 : "",
            answer2 : "",
            answer3 : "",
            answer4 : "",
            answer5 : ""
        };

        $scope.cats = [];

        $scope.showLoading = function(txt) {
            $ionicLoading.show({
                template: txt
            });
        };

        $scope.hideLoading = function(){
            $ionicLoading.hide();
        };

        $scope.askQuestion = function(){
			console.log("Inside Ask question");

            var answers = [];
            if(!$scope.question.cat || $scope.question.cat.length == 0){
                return;
            }
            if($scope.question.answer1 && $scope.question.answer1.trim().length >0){
                answers.push($scope.question.answer1.trim());
            }
            if($scope.question.answer2 && $scope.question.answer2.trim().length >0){
                answers.push($scope.question.answer2.trim());
            }
            if($scope.question.answer3 && $scope.question.answer3.trim().length >0){
                answers.push($scope.question.answer3.trim());
            }
            if($scope.question.answer4 && $scope.question.answer4.trim().length >0){
                answers.push($scope.question.answer4.trim());
            }
            if($scope.question.answer5 && $scope.question.answer5.trim().length >0){
                answers.push($scope.question.answer5.trim());
            }

            if(!$scope.question.data || $scope.question.data.trim().length < 10 || answers.length < 2){
                return;
            }

            var qObject = $scope.prepareQuestion(answers);

            $scope.showLoading('Saving...');
            var qClass = Parse.Object.extend("Question");
            var ansClass = Parse.Object.extend("Answer");
            var catClass = Parse.Object.extend("Category");
            var user = Parse.User.current();

            var q = new qClass();
            q.set("data", qObject.data);

            var cat = new catClass();
            cat.id = $scope.question.cat;
            q.set("category", cat);

            q.set("count", 0);
            q.set("user", user);
            q.set("tags", []);
            q.set("words", []);

            q.set("ans1_text", qObject.answer1);
            q.set("ans1_count", 0);

            q.set("ans2_text", qObject.answer2);
            q.set("ans2_count", 0);

            if(qObject.answer3 != null){
                q.set("ans3_text", qObject.answer3);
                q.set("ans3_count", 0);
            }
            if(qObject.answer4 != null){
                q.set("ans4_text", qObject.answer4);
                q.set("ans4_count", 0);
            }
            if(qObject.answer5 != null){
                q.set("ans5_text", qObject.answer5);
                q.set("ans5_count", 0);
            }

            q.save(null, {
                success: function(gameScore) {
                    $scope.question = {
                        data : "",
                        cat: "",
                        answer1 : "",
                        answer2 : "",
                        answer3 : "",
                        answer4 : "",
                        answer5 : ""
                    };
                    $scope.hideLoading();
                },
                error: function(gameScore, error) {
                    $scope.hideLoading();
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });
        };

        $scope.prepareQuestion = function(answers){
            var q = {
                data : $scope.question.data.trim(),
                answers : answers
            };

            q.answer1 = answers[0];
            q.answer2 = answers[1];
            if(answers.length > 2){
                q.answer3 = answers[2];
            }else{
                q.answer3 = null;
            }
            if(answers.length > 3){
                q.answer4 = answers[3];
            }else{
                q.answer4 = null;
            }
            if(answers.length > 4){
                q.answer5 = answers[4];
            }else{
                q.answer5 = null;
            }

            return q;
        };

        $scope.query = function()  {
            $scope.showLoading();
            DBService.queryCategory(function(catList){
                if(catList){
                    for(var i=0;i<catList.length;i++){
                        $scope.cats.push(catList[i]);
                    }
                }
                $scope.hideLoading();
            });
        };

        $scope.home = function(){
            $location.path("/home");
        };

        $scope.query();
    });
