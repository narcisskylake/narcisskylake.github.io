angular.module('rApp', []);

(function () {
    'use strict';
    angular
        .module('rApp')
        .controller('ReviewerController', ReviewerController);

    function ReviewerController($http, $sce) {

        let rc = this;

        rc.userInfo = {
            name: ''
        };

        rc.questions = {};
        rc.getQuestionsJSON = getQuestionsJSON;

        function getQuestionsJSON() {
            $http.get('js/questions.json')
                .then(function(data) {

                    rc.questions = data.data;

                    rc.init();
                });
        }

        rc.userAnswers = [];



        rc.currentQuestionCount = 0;
        rc.currentQuestionItem = {
            question: '',
            extraDetails: [],
            options: {},
            answer: ''
        };

        rc.currentAnswer = {
            questionOrder: -1,
            answer: ''
        };

        rc.totalScore = 0;

        rc.totalQuestionItems = 0;

        rc.isQuizStarted = false;
        rc.startQuiz = startQuiz;

        rc.nextQuestion = nextQuestion;
        rc.initCurrentQuestionItem = initCurrentQuestionItem;
        rc.saveCurrentAnswer = saveCurrentAnswer;
        rc.clearCurrentAnswer = clearCurrentAnswer;

        rc.initTotalQuestionItems = initTotalQuestionItems;
        rc.isLastQuestion = isLastQuestion;
        rc.isComplete = isComplete;

        rc.checkUserAnswers = checkUserAnswers;
        rc.getQuestion = getQuestion;
        rc.getUserAnswerText = getUserAnswerText;
        rc.getCorrectAnswer = getCorrectAnswer;

        rc.shuffleQuestionsAnswers = shuffleQuestionsAnswers;

        rc.init = init;


        function startQuiz() {
            rc.isQuizStarted = true;
        }

        function nextQuestion() {
            rc.saveCurrentAnswer();
            rc.currentQuestionCount++;
            rc.initCurrentQuestionItem();

            if(rc.isComplete()) {
                rc.checkUserAnswers();
            }
        }

        function initCurrentQuestionItem() {
            rc.currentQuestionItem = rc.questions.items[rc.currentQuestionCount];
            rc.clearCurrentAnswer();
        }

        function saveCurrentAnswer() {
            rc.currentAnswer.questionOrder = rc.currentQuestionCount;
            rc.userAnswers.push(rc.currentAnswer);
        }

        function clearCurrentAnswer() {
            rc.currentAnswer = {
                questionOrder: -1,
                answer: ''
            };
        }

        function initTotalQuestionItems() {
            rc.totalQuestionItems = rc.questions.items.length;
        }

        function isLastQuestion() {
            return (rc.currentQuestionCount + 1) === rc.totalQuestionItems;
        }

        function isComplete() {
            return rc.currentQuestionCount === rc.totalQuestionItems;
        }


        function checkUserAnswers() {
            console.log(rc.userAnswers);

            rc.userAnswers.forEach(function (item, index) {
                if(item.answer === (rc.questions.items[item.questionOrder].answer)) {
                    rc.totalScore++;
                }
            });

            console.log(rc.totalScore);

        }

        function getQuestion(item) {
            return rc.questions.items[item.questionOrder].question;
        }

        function getUserAnswerText(item) {
            let userAnswerText = '';
            let thisQUestionOptions = rc.questions.items[item.questionOrder].options;

            thisQUestionOptions.forEach(function (options, index) {
                if(options.key === item.answer) {
                    userAnswerText = options.value;
                }
            });

            return userAnswerText;
        }

        function getCorrectAnswer(item) {
            let userAnswer = item.answer;
            let correctAnswer = rc.questions.items[item.questionOrder].answer;

            let correctAnswerText = '';

            rc.questions.items[item.questionOrder].options.forEach(function (options, index) {
                if(options.key === correctAnswer) {
                    correctAnswerText = options.value;
                }
            });

            return $sce.trustAsHtml(userAnswer == correctAnswer ?
                '<span class="text-success">Your answer is correct!</span>'
                : '<span class="text-success">Correct answer: </span>' + correctAnswerText);
        }


        function shuffleQuestionsAnswers() {
            let questionItemsCopy = rc.questions.items;

            questionItemsCopy.forEach(function (item, index) {
                let tempOptions = item.options;
                questionItemsCopy[index].options = shuffle(tempOptions);
            });

            rc.questions.items = shuffle(questionItemsCopy);
        }



        // Author: https://github.com/Daplie/knuth-shuffle
        function shuffle(array) {
            let currentIndex = array.length
                , temporaryValue
                , randomIndex
            ;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }


        function init() {
            rc.shuffleQuestionsAnswers();

            rc.initCurrentQuestionItem();
            rc.initTotalQuestionItems();
        }


        rc.getQuestionsJSON();

    }
})();