angular.module('tApp', []);

(function () {
    'use strict';
    angular
        .module('tApp')
        .controller('TrainingController', TrainingController);

    function TrainingController($scope, $sce) {

        let tc = this;

        tc.userInfo = {
            name: ''
        };

        tc.questions = {
            items: [
                {
                    question: '1st Question',
                    extraDetails: [
                        'i',
                        'ii',
                        'iii',
                        'iv',
                        'v',
                    ],
                    options: [
                        {
                            'key' : 'a',
                            'value' : '1st choice'
                        },{
                            'key' : 'b',
                            'value' : '2nd choice'
                        },{
                            'key' : 'c',
                            'value' : '3rd choice'
                        },{
                            'key' : 'd',
                            'value' : '4th choice'
                        }
                    ],
                    answer: 3
                },
                {
                    question: '2nd Question',
                    extraDetails: [
                        'i',
                        'ii',
                        'iii',
                        'iv',
                        'v',
                    ],
                    options: [
                        {
                            'key' : 'a',
                            'value' : '1st choice'
                        },{
                            'key' : 'b',
                            'value' : '2nd choice'
                        },{
                            'key' : 'c',
                            'value' : '3rd choice'
                        },{
                            'key' : 'd',
                            'value' : '4th choice'
                        }
                    ],
                    answer: 1
                },
                {
                    question: '3rd Question',
                    extraDetails: [
                        'i',
                        'ii',
                        'iii',
                        'iv',
                        'v',
                    ],
                    options: [
                        {
                            'key' : 'a',
                            'value' : '1st choice'
                        },{
                            'key' : 'b',
                            'value' : '2nd choice'
                        },{
                            'key' : 'c',
                            'value' : '3rd choice'
                        },{
                            'key' : 'd',
                            'value' : '4th choice'
                        }
                    ],
                    answer: 2
                }
            ]
        };
        
        
        tc.userAnswers = [];

        
        
        tc.currentQuestionCount = 0;
        tc.currentQuestionItem = {
            question: '',
            extraDetails: [],
            options: {},
            answer: ''
        };
        
        tc.currentAnswer = {
            questionOrder: -1,
            answerOrder: -1
        };

        tc.totalScore = 0;

        tc.totalQuestionItems = 0;

        tc.isQuizStarted = false;
        tc.startQuiz = startQuiz;
        
        tc.nextQuestion = nextQuestion;
        tc.initCurrentQuestionItem = initCurrentQuestionItem;
        tc.saveCurrentAnswer = saveCurrentAnswer;
        tc.clearCurrentAnswer = clearCurrentAnswer;

        tc.initTotalQuestionItems = initTotalQuestionItems;
        tc.isLastQuestion = isLastQuestion;
        tc.isComplete = isComplete;
        
        tc.checkUserAnswers = checkUserAnswers;
        tc.getQuestion = getQuestion;
        tc.getUserAnswer = getUserAnswer;
        tc.getCorrectAnswer = getCorrectAnswer;

        tc.shuffleQuestionsAnswers = shuffleQuestionsAnswers;


        function startQuiz() {
            tc.isQuizStarted = true;
        }

        function nextQuestion() {
            tc.saveCurrentAnswer();
            tc.currentQuestionCount++;
            tc.initCurrentQuestionItem();

            if(tc.isComplete()) {
                tc.checkUserAnswers();
            }
        }

        function initCurrentQuestionItem() {
            tc.currentQuestionItem = tc.questions.items[tc.currentQuestionCount];
            tc.clearCurrentAnswer();
        }
        
        function saveCurrentAnswer() {
            tc.currentAnswer.questionOrder = tc.currentQuestionCount;
            tc.userAnswers.push(tc.currentAnswer);
        }
        
        function clearCurrentAnswer() {
            tc.currentAnswer = {
                questionOrder: -1,
                answerOrder: -1
            };
        }

        function initTotalQuestionItems() {
            tc.totalQuestionItems = tc.questions.items.length;
        }

        function isLastQuestion() {
            return (tc.currentQuestionCount + 1) === tc.totalQuestionItems;
        }

        function isComplete() {
            return tc.currentQuestionCount === tc.totalQuestionItems;
        }
        
        
        function checkUserAnswers() {

            tc.userAnswers.forEach(function (item, index) {
                if(item.answerOrder == (tc.questions.items[item.questionOrder].answer - 1)) {
                    tc.totalScore++;
                }
            });
        }

        function getQuestion(item) {
            return tc.questions.items[item.questionOrder].question;
        }

        function getUserAnswer(item) {
            return tc.questions.items[item.questionOrder].options[item.answerOrder].value;
        }
        
        function getCorrectAnswer(item) {
            let userAnswer = item.answerOrder;
            let correctAnswer = tc.questions.items[item.questionOrder].answer - 1;
            let correctAnswerText = tc.questions.items[item.questionOrder].options[tc.questions.items[item.questionOrder].answer - 1].value;

            return $sce.trustAsHtml(userAnswer == correctAnswer ?
                '<span class="text-success">Your answer is correct!</span>'
                : '<span class="text-success">Correct answer: </span>' + correctAnswerText);
        }
        

        function shuffleQuestionsAnswers() {
            let questionItemsCopy = tc.questions.items;

            questionItemsCopy.forEach(function (item, index) {
                let tempOptions = item.options;
                questionItemsCopy[index].options = shuffle(tempOptions);
            });

            tc.questions.items = shuffle(questionItemsCopy);
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




        tc.shuffleQuestionsAnswers();

        tc.initCurrentQuestionItem();
        tc.initTotalQuestionItems();

    }
})();