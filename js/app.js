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
            answer: ''
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
        tc.getUserAnswerText = getUserAnswerText;
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
                answer: ''
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
            console.log(tc.userAnswers);

            tc.userAnswers.forEach(function (item, index) {
                if(item.answer === (tc.questions.items[item.questionOrder].answer)) {
                    tc.totalScore++;
                }
            });

            console.log(tc.totalScore);

        }

        function getQuestion(item) {
            return tc.questions.items[item.questionOrder].question;
        }

        function getUserAnswerText(item) {
            let userAnswerText = '';
            let thisQUestionOptions = tc.questions.items[item.questionOrder].options;

            thisQUestionOptions.forEach(function (options, index) {
                if(options.key === item.answer) {
                    userAnswerText = options.value;
                }
            });

            return userAnswerText;
        }

        function getCorrectAnswer(item) {
            let userAnswer = item.answer;
            let correctAnswer = tc.questions.items[item.questionOrder].answer;

            let correctAnswerText = '';

            tc.questions.items[item.questionOrder].options.forEach(function (options, index) {
                if(options.key === correctAnswer) {
                    correctAnswerText = options.value;
                }
            });

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