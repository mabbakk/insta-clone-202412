
import {ValidationRules} from "./validation.js";    // 파일 뒤에 꼭 .js 붙이는 거 잊지 말기!

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


    const handleInput = ($input) => {
        removeErrorMessage($input.closest('.form-field'));
        validateField($input); // 입력값 검증 함수 호출
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
    
    // 1. 빈 값 체크
    // 이게 어떤 태그인지 알아오기
    const fieldName = $input.name;
    // 빈 값 체크를 하기 위해서는 입력값을 읽어와야 한다.
    const inputValue = $input.value;
    // input의 부모 가져오기
    const $formField = $input.closest('.form-field');

    if (!inputValue) {
        // console.log(fieldName, ' is empty!');
        showError($formField, ValidationRules[fieldName]?.requiredMessage);  // 에러메시지 렌더링
                                                        // null이 아닐 때!
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
    if (error) error.remove();
}



//====== 메인 실행 코드 ======//
document.addEventListener('DOMContentLoaded', initSignUp);
