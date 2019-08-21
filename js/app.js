angular.module('rApp', []);

(function () {
    'use strict';
    angular
        .module('rApp')
        .controller('ReviewerController', ReviewerController);

    function ReviewerController($http, $sce, $scope) {

        let rc = this;


        rc.steps = {
            "reviewWelcome": true,
            "review": false,
            "reviewSummary": false,
            "testWelcome": false,
            "test": false,
            "testReview": false,
            "endQuiz": false
        };

        rc.nextStep = nextStep;
        rc.tempNextStep = "reviewWelcome";

        function nextStep(step) {
            rc.steps[rc.tempNextStep] = false;

            rc.steps[step] = true;
            rc.tempNextStep = step;
        }


        rc.userInfo = {
            name: ''
        };

        rc.questions = {};
        rc.getQuestionsJSON = getQuestionsJSON;

        function getQuestionsJSON() {
            $http.get('js/questions.json')
                .then(function(data) {

                    rc.questions = data.data;

                    rc.init(true);
                });
        }

        rc.userAnswers = {
            "reviewAnswers": [],
            "reviewTotalScore": 0,
            "testAnswers":[],
            "testTotalScore": 0
        };



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

        // rc.totalScore = 0;

        rc.getCurrentTotalScore = getCurrentTotalScore;
        function getCurrentTotalScore() {
            if(rc.steps.review) {
                return rc.userAnswers.reviewTotalScore;
            } else {
                return  rc.userAnswers.testTotalScore;
            }
        }

        rc.totalQuestionItems = 0;



        rc.nextQuestion = nextQuestion;
        rc.initCurrentQuestionItem = initCurrentQuestionItem;
        rc.saveCurrentAnswer = saveCurrentAnswer;
        rc.clearCurrentAnswer = clearCurrentAnswer;

        rc.initTotalQuestionItems = initTotalQuestionItems;
        rc.isLastQuestion = isLastQuestion;
        rc.isComplete = isComplete;

        rc.countUserScore = countUserScore;
        rc.getQuestion = getQuestion;
        rc.getUserAnswerText = getUserAnswerText;
        rc.getCorrectAnswer = getCorrectAnswer;

        rc.shuffleQuestionsAnswers = shuffleQuestionsAnswers;


        rc.quickCheck = quickCheck;
        rc.highlightCorrectAnswer = highlightCorrectAnswer;
        rc.initQuickCheck = initQuickCheck;
        rc.enableOptions = enableOptions;

        rc.nextQuizType = nextQuizType;

        function nextQuizType() {
            if(rc.steps.review) {
                rc.nextStep('testWelcome');
            } else if(rc.steps.test) {
                rc.nextStep('endQuiz');
            }

        }


        rc.resetTest = resetTest;

        rc.init = init;



        function nextQuestion() {
            if(rc.steps.review) {
                rc.saveCurrentAnswer('review');
            } else if(rc.steps.test) {
                rc.saveCurrentAnswer('test');
            }

            rc.currentQuestionCount++;
            rc.initCurrentQuestionItem();

            if(rc.isComplete()) {
                rc.countUserScore();
            }

            enableOptions(true);
        }

        function initCurrentQuestionItem() {
            rc.currentQuestionItem = rc.questions.items[rc.currentQuestionCount];
            rc.clearCurrentAnswer();
        }

        function saveCurrentAnswer(quizType) {
            rc.currentAnswer.questionOrder = rc.currentQuestionCount;

            if(quizType === "review") {
                rc.userAnswers.reviewAnswers.push(rc.currentAnswer);
            } else {
                rc.userAnswers.testAnswers.push(rc.currentAnswer);
            }
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


        function countUserScore() {
            let currentQuizType, currentTotalScore;
            if(rc.steps.review) {
                currentQuizType = rc.userAnswers.reviewAnswers;
                currentTotalScore = "reviewTotalScore";
            } else {
                currentQuizType = rc.userAnswers.testAnswers;
                currentTotalScore = "testTotalScore";
            }

            currentQuizType.forEach(function (item, index) {
                if(item.answer === (rc.questions.items[item.questionOrder].answer)) {
                    rc.userAnswers[currentTotalScore]++;
                }
            });

        }

        function getQuestion(item) {
            return rc.questions.items[item.questionOrder].question;
        }

        function getUserAnswerText(item) {
            let userAnswerText = '';
            let thisQuestionOptions = rc.questions.items[item.questionOrder].options;

            thisQuestionOptions.forEach(function (options, index) {
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



        function enableOptions(state) {
            let optionsBtnGroup = document.querySelector('.options-group');

            if(state) {
                optionsBtnGroup.classList.remove("disable-options");
            } else {
                optionsBtnGroup.classList.add("disable-options");
            }
        }

        function initQuickCheck(isEnabled) {
            let el = document.querySelector('.options-group')

            if(isEnabled) {
                el.addEventListener('click', quickCheck);
            } else {
                el.removeEventListener('click', quickCheck);
            }
        }

        function quickCheck(evt) {

            if(evt.target.classList.contains('option-item')) {
                enableOptions(false);

                let optionItem = evt.target;
                let currentAnswer = optionItem.children[0].value;

                if(currentAnswer === rc.currentQuestionItem.answer) {
                    optionItem.classList.remove('btn-normal');
                    optionItem.classList.add('btn-success');
                } else {
                    optionItem.classList.remove('btn-normal');
                    optionItem.classList.add('btn-danger');

                    rc.highlightCorrectAnswer();
                }
            }
        }

        function highlightCorrectAnswer() {
            let optionValues = document.querySelectorAll(".option-value");

            let optionValuesLen = optionValues.length;
            for(let i = 0; i < optionValuesLen; i++) {
                let currentValue = optionValues[i];

                if(currentValue.value === rc.currentQuestionItem.answer) {

                    let parentNode = currentValue.parentNode;
                    parentNode.classList.remove('btn-normal');
                    parentNode.classList.add('btn-success');
                }
            }

        }



        function resetTest(setQuizTo) {


            switch (setQuizTo) {
                case 'test':
                    rc.currentQuestionCount = 0;
                    rc.totalScore = 0;
                    rc.init(false);
                    rc.nextStep('test');
                    break;
            }


        }


        function init(enableQuickCheck) {
            rc.shuffleQuestionsAnswers();

            rc.initCurrentQuestionItem();
            rc.initTotalQuestionItems();
            rc.initQuickCheck(enableQuickCheck);
        }


        rc.getQuestionsJSON();

    }
})();