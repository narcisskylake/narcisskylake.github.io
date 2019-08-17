angular.module('rApp', []);

(function () {
    'use strict';
    angular
        .module('rApp')
        .controller('ReviewerController', ReviewerController);

    function ReviewerController($scope, $sce) {

        let rc = this;

        rc.userInfo = {
            name: ''
        };

        rc.questions = {
            items: [
                {
                    question: 'People generally invest their money to provide:',
                    extraDetails: [
                        'I. An improvement in their financial position',
                        'II. A less comfortable standard of living',
                        'III. Retirement income',
                        'IV. Funds for paying necessary expenses and taxes when the person dies'
                    ],
                    options: [
                        {
                            'key' : 'a',
                            'value' : 'I, II and III'
                        },{
                            'key' : 'b',
                            'value' : 'I, III and IV'
                        },{
                            'key' : 'c',
                            'value' : 'I, II and IV'
                        },{
                            'key' : 'd',
                            'value' : 'II, III and IV'
                        }
                    ],
                    answer: 'b'
                },
                {
                    question: 'Which of the following funds is comprised of a higher proportion of equity and a lower proportion of fixed-income',
                    extraDetails: [],
                    options: [
                        {
                            'key' : 'a',
                            'value' : 'Bond Funds'
                        },{
                            'key' : 'b',
                            'value' : 'Cash Funds'
                        },{
                            'key' : 'c',
                            'value' : 'Managed Funds'
                        },{
                            'key' : 'd',
                            'value' : 'Mixed Funds'
                        }
                    ],
                    answer: 'c'
                },
                {
                    question: 'Which of the following are the main characteristics of Variable Life insurance policies?',
                    extraDetails: [
                        'I. The policies can be used for investments, as a source of regular savings and protection.',
                        'II. The withdrawal and protection benefit are determined by the investment performance of the underlying',
                        'III. The net withdrawal values of the policies are the gross withdrawal values shown in the policy which'
                    ],
                    options: [
                        {
                            'key' : 'a',
                            'value' : 'I only'
                        },{
                            'key' : 'b',
                            'value' : 'II only'
                        },{
                            'key' : 'c',
                            'value' : 'I and II only'
                        },{
                            'key' : 'd',
                            'value' : 'I, II and III'
                        }
                    ],
                    answer: 'c'
                },
                {
                    question: 'Which of the following statements are FALSE?',
                    extraDetails: [
                        'I. The policyowners may request a partial withdrawal of the policy and the amount will be met by cashing the units at the offer price.',
                        'II. The structure of charges and the investment content of a Variable Life policy are specified in the policy document and the policy statement.',
                        'III. Some Variable Life policies grant loans to policyowners which is limited to a percentage of the cash value.',
                        'IV. Commissions and office expenses are met by a variety of implicit charges, some of which are variable.'
                    ],
                    options: [
                        {
                            'key' : 'a',
                            'value' : 'I and II only'
                        },{
                            'key' : 'b',
                            'value' : 'I and III only'
                        },{
                            'key' : 'c',
                            'value' : 'II and III only'
                        },{
                            'key' : 'd',
                            'value' : 'All of the above'
                        }
                    ],
                    answer: 'b'
                },
                {
                    question: 'Which of the following statements about the feature of Regular Premium Variable Life Policy are TRUE?',
                    extraDetails: [
                        'I. Top-ups are usually allowed.',
                        'II. The level of coverage can be varied.',
                        'III. Premium holidays are usually allowed.'
                    ],
                    options: [
                        {
                            'key' : 'a',
                            'value' : 'I and II only'
                        },{
                            'key' : 'b',
                            'value' : 'I and III only'
                        },{
                            'key' : 'c',
                            'value' : 'II and III only'
                        },{
                            'key' : 'd',
                            'value' : 'I, II and III'
                        }
                    ],
                    answer: 'd'
                }
            ]
        };


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




        rc.shuffleQuestionsAnswers();

        rc.initCurrentQuestionItem();
        rc.initTotalQuestionItems();

    }
})();