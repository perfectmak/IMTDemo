var IMTDemo = angular.module("IMTDemo", ["ngRoute"]);

//configure routes for all views
IMTDemo.config(["$routeProvider", function ($routeProvider){
	$routeProvider.when("/", {
		controller: "WelcomeController",
		templateUrl: "partials/welcome.html"
	})
	.when("/start", {
		controller: "QuestionController",
		templateUrl: "partials/question.html"
	})
	.otherwise({redirectTo: "/"})
}]);

//load all controllers
IMTDemo.controller("WelcomeController", WelcomeController);
IMTDemo.controller("QuestionController", QuestionController);

//define factory for Questions
IMTDemo.factory("QuestionFactory", function(){
	var QuestionFactory = {};

	QuestionFactory.getQuestions = function()
	{
		var questions = [
			{
				question: "How cool is angularJS?",
				optionA: "Really Cool",
				optionB: "Cool",
				optionC: "Meh!!",
				answer: "A"
			},
			{
				question: "What is the full meaning of SPA?",
				optionA: "Serious Programming in Angular",
				optionB: "So Pure Angular",
				optionC: "Single Page Application",
				answer: "C"
			},
			{
				question: "Which of this is a feature of angularJS ?",
				optionA: "Remote",
				optionB: "Controller",
				optionC: "Wireless",
				answer: "B"
			},
			{
				question: "What is angularJS?",
				optionA: "A tool to accurately measure angles",
				optionB: "A web application development framework",
				optionC: "A car racing game",
				answer: "B"
			},
			{
				question: "AngularJS was developed by ?",
				optionA: "Google",
				optionB: "Yahoo",
				optionC: "Microsoft",
				answer: "A"
			}

		];
		return questions;
	}
		return QuestionFactory;
});

//define service for sharing of result between controllers

//definition of all controllers;

//Controller for welcome page
function WelcomeController($scope)
{
	//doesn't do anything much here	
}

//Controller of Question Page
function QuestionController($scope, QuestionFactory)
{
	var questions = []; //for holding the list of current questions
	var answers = []; //for keeping track of all user selected answers
	var currentQuestionIndex = 0; //to keep track of the current question in view

	//load all questions from factory and intialize first question
	var init = function ()
	{
		$scope.currentQuestion = {};
		$scope.prevVisible = false; //make previous button invisible for first question
		$scope.submitVisible = false; //make submit button invisible

		//load question from factory
		questions = QuestionFactory.getQuestions();

		//initialize currentQuestion with the first Question
		$scope.currentQuestion = questions[currentQuestionIndex];	
	}

	init();


	//all method definitions here

	//called when the Next Button is clicked
	$scope.nextQuestion = function()
	{	
		//save the option of the current visible question
		saveCurrentQuestionOption();

		//toggle the Prev Button to be visible
		$scope.prevVisible = true;

		//load the next question into  currentQuestion
		$scope.currentQuestion = questions[++currentQuestionIndex];
		//restore User selected Options for the current question
		loadCurrentQuestionOption();
		
		//if on the last question
		if(currentQuestionIndex == questions.length - 1)
		{			
			//toggle submit button to be visible
			$scope.submitVisible = true;
		}
		
	}

	//called when the Prev Button is clicked
	$scope.prevQuestion = function()
	{
		//save the option of the current visible question
		saveCurrentQuestionOption();

		//load the prev question into currentQuestion
		$scope.currentQuestion = questions[--currentQuestionIndex];	

		//restore User selected options for the current question
		loadCurrentQuestionOption();

		//toggle submit button to be invisible thereby making next button visible
		$scope.submitVisible = false;

		if(currentQuestionIndex == 0)
		{
			$scope.prevVisible = false;
		}
		
	}

	//called when Submit Button is Clicked
	$scope.submitAnswer = function()
	{
		//save last answer
		saveCurrentQuestionOption();

		var scoreCount = 0;

		//calculate answers
		for (var i = 0; i < answers.length; i++) {
			if(answers[i] !== undefined)
			{
				if(answers[i] === questions[i].answer)
					scoreCount ++;
			}
		};

		var resultString = "";
		if(scoreCount == 0)
		{
			resultString = "Too bad, you got no answer correct";
		}
		else if(scoreCount == 5)
		{
			resultString = "You got all five answers correct";
		}
		else
		{
			resultString = "You got "+scoreCount+" answer(s) correctly";
		}

		$scope.resultString = resultString;

		//show modal to display result
		$("#resultModal").modal({
			backdrop: 'static', //to prevent closing of the popup modal
  			keyboard: false //also to prevent keyboard from escaping the modal
		});
	}

	//called when the Finish Button on the resultModal is clicked
	$scope.finish = function()
	{
		//close modal
		$("#resultModal").modal("hide");

		// redirect back to welcome.html
		location.href= "#/";
	}

	//to save users answer for the current question
	var saveCurrentQuestionOption = function()
	{
		answers[currentQuestionIndex] = $scope.option;
	}

	//to load users answer for the current question
	var loadCurrentQuestionOption = function()
	{
		$scope.option = answers[currentQuestionIndex];
	}
}