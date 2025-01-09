
import {ValidationRules, checkPasswordStrength} from "./validation.js";    // 파일 뒤에 꼭 .js 붙이는 거 잊지 말기!
import {debounce} from "../util/debounce.js";  // 이 debounce를 불러왔으면 아래 코드들 중 어디에 걸어야 하는지도 굉장히 중요!

// 회원 가입정보를 서버에 전송하기
async function fetchToSignUp(userData) {

    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    alert(data.message);
}


// 초기화 함수
function initSignUp() {

    // form submit이벤트
    const $form = document.querySelector('.auth-form');

    // 입력 태그들을 읽어서 객체로 관리
    const $inputs = {
        emailOrPhone: $form.querySelector('input[name="email"]'),
        name: $form.querySelector('input[name="name"]'),
        username: $form.querySelector('input[name="username"]'),
        password: $form.querySelector('input[name="password"]'),
    };


    // 디바운스가 걸린 validateField 함수
    const debouncedValiDate = debounce(validateField, 700);

    const handleInput = ($input) => {
        removeErrorMessage($input.closest('.form-field'));
        debouncedValiDate($input); // 입력값 검증 함수 호출
    };


    // 4개의 입력창에 입력 이벤트 바인딩
    Object.values($inputs).forEach($input => {  // 위에 객체들의 value값만 출력!
        $input.addEventListener('input', e => {handleInput($input)});
        // 위에서부터 적다가 갑자기 다음칸으로 넘어가는 순간 기존 입력하던 칸이 비어있다고 알림창이 뜨게
        $input.addEventListener('blur', e => {handleInput($input);   // 입력값 검증 함수 호출
        });
    })


    // 폼 이벤트 핸들러 바인딩
    $form.addEventListener('submit', e => {
        e.preventDefault(); // 폼 전송시 발생하는 새로고침 방지

        // // 사용자가 입력한 모든 입력값 읽어오기
        // const emailOrPhone = document.querySelector('input[name="email"]').value;
        // const name = document.querySelector('input[name="name"]').value;
        // const username = document.querySelector('input[name="username"]').value;
        // const password = document.querySelector('input[name="password"]').value;
        //
        // const payload = {
        //     emailOrPhone: emailOrPhone,
        //     name: name,
        //     username: username,
        //     password: password,
        // };
        //
        // // 서버로 데이터 전송
        // fetchToSignUp(payload);

    });

}


//==== 함수 정의 ====//
// 입력값을 검증하고 에러메시지를 렌더링하는 함수
function validateField($input) {
    
    // 이게 어떤 태그인지 알아오기
    const fieldName = $input.name;
    // 빈 값 체크를 하기 위해서는 입력값을 읽어와야 한다.
    const inputValue = $input.value.trim();    // trim() : 입력값의 공백 제거! -> 사용자가 스페이스바를 눌렀을 때 생기는 공백을 제거한다.
    // input의 부모 가져오기
    const $formField = $input.closest('.form-field');

    // 1. 빈 값 체크
    if (!inputValue) {
        // console.log(fieldName, ' is empty!');
        showError($formField, ValidationRules[fieldName]?.requiredMessage);  // 에러메시지 렌더링
                                                        // null이 아닐 때!
    } else {
        // 2. 상세 체크 ( 패턴검증, 중복검증 )
        // 2-1. 이메일, 전화번호 검증
        if (fieldName === 'email') {
            validateEmailOrPhone($formField, inputValue);  // 에러를 띄워야 하니 $formField, 입력값을 받아와야 하니 inputValue
        } else if (fieldName === 'password') {
            ValidatedPassword($formField, inputValue);
        } else if (fieldName === 'username') {
            validateUsername($formField, inputValue);
        }
    }

}

/**
 * 에러 메시지를 표시하고, 필드에 error 클래스를 부여
 */
function showError($formField, message) {
    $formField.classList.add('error');  // 테두리에 빨갛게!
    const $errorSpan = document.createElement('span');
    $errorSpan.classList.add('error-message');
    $errorSpan.textContent = message;
    $formField.append($errorSpan);
}


/**
 * 에러 및 비밀번호 피드백을 제거한다.
 */
function removeErrorMessage($formField) {
    $formField.classList.remove('error');
    const error = $formField.querySelector('.error-message');
    const feedback = $formField.querySelector('.password-feedback');
    if (error) error.remove();
    if (feedback) feedback.remove();
}



// 이메일 또는 전화번호를 상세 검증
function validateEmailOrPhone($formField, inputValue) {

    // 이메일 패턴 체크
    if (inputValue.includes('@')) {
        if (!ValidationRules.email.pattern.test(inputValue)) { // 패턴 체크
            showError($formField, ValidationRules.email.message);
        } else {  // 서버에 통신해서 중복체크

        }
    } else {
        // 전화번호  체크
        // 전화번호 처리(숫자만 추출)
        const numbers = inputValue.replace(/[^0-9]/g, '');
        if (!ValidationRules.phone.pattern.test(numbers)) {
            // 패턴 체크
            showError($formField, ValidationRules.phone.message);
        } else {
            // 서버에 통신해서 중복체크
        }
    }

}

// 비밀번호 검증 (길이, 강도 체크)
function ValidatedPassword($formField, inputValue) {

    // 길이 확인
    if (!ValidationRules.password.patterns.length.test(inputValue)) {
        showError($formField, ValidationRules.password.messages.length);
    }

    // 강도 체크
    const strength = checkPasswordStrength(inputValue);
    switch (strength) {
        case 'weak': // 에러로 볼것임
            showError($formField, ValidationRules.password.messages.weak);
            break;
        case 'medium': // 에러는 아님
            showPasswordFeedback(
                $formField,
                ValidationRules.password.messages.medium,
                'warning'
            );
            break;
        case 'strong': // 에러는 아님
            showPasswordFeedback(
                $formField,
                ValidationRules.password.messages.strong,
                'success'
            );
            break;
    }

}


/**
 * 비밀번호 강도 피드백 표시
 */
function showPasswordFeedback($formField, message, type) {
    const $feedback = document.createElement('span');
    $feedback.className = `password-feedback ${type}`;   // 강도 클래스에 따라서 에러 테두리 색깔이 바뀜!
    $feedback.textContent = message;
    $formField.append($feedback);
}


/**
 * 사용자 이름(username) 필드 검증
 */
function validateUsername($formField, inputValue) {

    if (!ValidationRules.username.pattern.test(inputValue)) {
        showError($formField, ValidationRules.username.message);
    }

    // 중복검사

}




//====== 메인 실행 코드 ======//
document.addEventListener('DOMContentLoaded', initSignUp);
