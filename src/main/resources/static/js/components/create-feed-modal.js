
// 피드 생성 모달을 전역 관리
let $modal = document.getElementById('createPostModal');

// 모달 관련 DOM들을 저장할 객체
let elements = {
    $closeBtn: $modal.querySelector('.modal-close-button'),
    $backdrop: $modal.querySelector('.modal-backdrop'),
};


// 피드 생성 모달 관련 이벤트 함수
function setUpModalEvents() {

    const {$closeBtn, $backdrop} = elements;

    // 모달 열기 함수
    const openModal = e => {
        e.preventDefault();
        // 모달 열기
        $modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 배경 바디 스크롤 방지
    };


    // 모달 닫기
    const closeModal = e => {
        e.preventDefault();
        $modal.style.display = 'none';
        document.body.style.overflow = 'auto';  // 배경 바디 스크롤 방지 해제
    }

    // 피드 생성 모달 열기 이벤트
    document.querySelector('.fa-square-plus')
        .closest('.menu-item')
        .addEventListener('click', openModal) ;  // 모달 열기 함수를 바깥으로 뺀 후 openModal 함수를 여기에 바인딩!


    // X 버튼 눌렀을 때
    $closeBtn.addEventListener('click', closeModal);

    // 백드롭 눌렀을 때
    $backdrop.addEventListener('click', closeModal);



}

// 이벤트 바인딩 관련 함수
function bindEvents() {
    setUpModalEvents();
}

// 모달 관련 JS 함수 - 외부에 노출

function initCreateFeedModal() {
    bindEvents();  // 코드를 작게작게 분리!
}

export default initCreateFeedModal;