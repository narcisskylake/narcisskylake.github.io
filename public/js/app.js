angular.module('rApp', ['passcodeService']);

(function () {
    'use strict';
    angular
        .module('rApp')
        .controller('ReviewerController', ReviewerController);

    function ReviewerController($http, $sce, $scope, $timeout, PasscodeService) {

        let rc = this;
        let VARIABLEQUESTIONSFILE = 'js/variable-life-test-d.json';
        let TRADITIONALQUESTIONSFILE = 'js/traditional-life-mock-exam-1.json';
        // let TRADITIONALQUESTIONSFILE = 'js/traditionalQuestions.json';

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

            rc.resetProgressBar();
            rc.initProgressBarCount();


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


        rc.progressBarCount = 0;
        rc.progressBarValue = 0;

        rc.updateProgressBarValue = updateProgressBarValue;
        function updateProgressBarValue() {
            return rc.progressBarValue += rc.progressBarCount;
        }
        rc.initProgressBarCount = initProgressBarCount;
        function initProgressBarCount() {
            rc.progressBarCount = 100 / rc.totalQuestionItems;
        }
        rc.resetProgressBar = resetProgressBar;
        function resetProgressBar() {
            rc.progressBarCount = 0;
            rc.progressBarValue = 0;
            rc.isProgressBarComplete(false);
        }

        rc.isProgressBarComplete = isProgressBarComplete;
        function isProgressBarComplete(state) {
            let progressBarElement = document.querySelector('.progress-bar');

            state ? progressBarElement.classList.add('complete') : progressBarElement.classList.remove('complete');
        }


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


        rc.scrollToTop = scrollToTop;
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



        function animateQuestionBlock() {
            let questionBlock = document.getElementsByClassName('question-block');
            questionBlock[0].classList.add('appear');

            setTimeout(function () {
                questionBlock[0].classList.remove('appear');
            }, 300);
        }

        function nextQuestion() {
            animateQuestionBlock();

            rc.scrollToTop('top');

            if(rc.steps.review) {
                rc.saveCurrentAnswer('review');
            } else if(rc.steps.exam) {
                rc.saveCurrentAnswer('exam');
            }

            rc.currentQuestionCount++;
            rc.initCurrentQuestionItem();

            if(rc.isComplete()) {
                rc.countUserScore();
                rc.isProgressBarComplete(true);
            }

            enableOptions(true);

            rc.updateProgressBarValue();
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



        function enableInputs(action, inputsClassName) {

            let inputs = document.getElementsByClassName(inputsClassName);
            let inputsLength = inputs.length;
            let status = !action;

            for(let i = 0; i < inputsLength; i++) {
                if(!inputs[i].classList.contains('user-answer')) {
                    inputs[i].disabled = status;
                }
            }


        }

        function initQuickCheck(isEnabled) {
            let el = document.querySelector('.options-group');

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

                // add class to user's chosen answer
                optionItem.children[0].classList.add('user-answer');

                let currentAnswer = optionItem.children[0].value;

                if(currentAnswer === rc.currentQuestionItem.answer) {
                    optionItem.classList.remove('btn-normal');
                    optionItem.classList.add('btn-success');
                } else {
                    optionItem.classList.remove('btn-normal');
                    optionItem.classList.add('btn-danger');

                    rc.highlightCorrectAnswer();
                }

                enableInputs(false, 'option-value');

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
                    rc.init(true);
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


        rc.initWatchExamType = initWatchExamType;
        function initWatchExamType() {
            $scope.$watch('rc.examType', function(newVal, oldVal) {
                rc.getQuestionsJSON();
            });
        }


        rc.passcodeInfo = {
            "userPass": '',
            "allowedHours": 0,
            "row": '',
            "success": false
        };

        rc.checkPasscode = checkPasscode;
        rc.isSendingPasscode = false;
        function checkPasscode() {
            rc.isSendingPasscode = true;
            let formError = document.querySelector('.form-error');
            formError.innerHTML = 'Checking...';
            formError.classList.remove('text-danger');

            let passcode = rc.passcodeInfo.userPass ? rc.passcodeInfo.userPass : ' ';

            PasscodeService.getPasscode(passcode).then(function (response) {
                let data = response.data;
                rc.isSendingPasscode = false;

                if(data.success) {
                    rc.passcodeInfo.allowedHours = data.allowedHours;
                    rc.passcodeInfo.row = data.row;
                    rc.passcodeInfo.success = true;


                    rc.initWatchExamType();
                } else {

                    formError.classList.add('text-danger');
                    formError.innerHTML = data.msg;
                }
            });
        }





    }
})();


// TODO
// 1. progress bar
// 2. password protection