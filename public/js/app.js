angular.module('rApp', []);

(function () {
    'use strict';
    angular
        .module('rApp')
        .controller('ReviewerController', ReviewerController);

    function ReviewerController($http, $sce, $scope) {

        let rc = this;
        let VARIABLEQUESTIONSFILE = 'js/variableQuestions.json';
        let TRADITIONALQUESTIONSFILE = 'js/traditionalQuestions.json';

        rc.examType = 'variable';

        rc.steps = {
            "reviewWelcome": true,
            "review": false,
            "reviewSummary": false,
            "examWelcome": false,
            "exam": false,
            "examReview": false,
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
            let questionsFile = '';

            switch (rc.examType) {
                case 'variable':
                    questionsFile = VARIABLEQUESTIONSFILE;
                    break;

                case 'traditional':
                    questionsFile = TRADITIONALQUESTIONSFILE;
                    break;
            }


            $http.get(questionsFile)
                .then(function(data) {

                    rc.questions = data.data;

                    rc.init(true);
                });
        }

        rc.userAnswers = {
            "reviewAnswers": [],
            "reviewTotalScore": 0,
            "examAnswers":[],
            "examTotalScore": 0
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
                return  rc.userAnswers.examTotalScore;
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

        rc.changeLabels = changeLabels;
        rc.screenLabel = 'Reviewer';
        rc.buttonLabel = 'Proceed to exam';


        function nextQuizType() {
            rc.changeLabels();

            if(rc.steps.review) {
                rc.nextStep('examWelcome');
            } else if(rc.steps.exam) {
                rc.nextStep('endQuiz');
            }
        }

        function changeLabels() {
            rc.screenLabel = 'Exam';
            rc.buttonLabel = 'See results';

            if(rc.steps.exam) {
                rc.screenLabel = 'End';
                rc.buttonLabel = 'Return to home';
            }
            else if(rc.steps.endQuiz) {
                rc.screenLabel = 'Reviewer';
                rc.buttonLabel = 'Proceed to exam';
            }
        }

        rc.resetExam = resetExam;

        rc.init = init;



        function nextQuestion() {
            scrollToTop('top');

            if(rc.steps.review) {
                rc.saveCurrentAnswer('review');
            } else if(rc.steps.exam) {
                rc.saveCurrentAnswer('exam');
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
                rc.userAnswers.examAnswers.push(rc.currentAnswer);
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
                currentQuizType = rc.userAnswers.examAnswers;
                currentTotalScore = "examTotalScore";
            }

            currentQuizType.forEach(function (item, index) {
                if(item.answer === (rc.questions.items[item.questionOrder].answer)) {
                    rc.userAnswers[currentTotalScore]++;
                }
            });

        }

        function getQuestion(item) {
            let question = '<p class="question-summary">' + rc.questions.items[item.questionOrder].question + '</p>';

            let extraDetails = rc.questions.items[item.questionOrder].extraDetails;
            let extraDetailsLength = rc.questions.items[item.questionOrder].extraDetails.length;
            let extraDetailsHTML = '';

            for(let x = 0; x < extraDetailsLength; x++) {
                extraDetailsHTML = extraDetailsHTML + '<p class="extra-detail">' + extraDetails[x] + '</p>';
            }


            return $sce.trustAsHtml(question + extraDetailsHTML);
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

                // check if options only have "true or false"
                if(tempOptions.length > 2) {
                    questionItemsCopy[index].options = shuffle(tempOptions);
                }
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



        function scrollToTop() {
            var c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, c - c / 8);
            }
        }



        function resetExam(setQuizTo) {


            switch (setQuizTo) {
                case 'toStartScreen':
                    rc.currentQuestionCount = 0;
                    rc.totalScore = 0;
                    rc.changeLabels();
                    rc.init(false);
                    rc.nextStep('reviewWelcome');
                    break;
                case 'exam':
                    rc.currentQuestionCount = 0;
                    rc.totalScore = 0;
                    rc.init(false);
                    rc.nextStep('exam');
                    break;
            }


        }



        function init(enableQuickCheck) {
            rc.shuffleQuestionsAnswers();

            rc.initCurrentQuestionItem();
            rc.initTotalQuestionItems();
            rc.initQuickCheck(enableQuickCheck);
        }


        $scope.$watch('rc.examType', function(newVal, oldVal) {
            rc.getQuestionsJSON();
        });


    }
})();


// TODO
// 1. progress bar
// 2. password protection