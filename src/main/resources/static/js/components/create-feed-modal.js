
// 피드 생성 모달을 전역 관리
let $modal = null;





// 모달 관련 JS 함수 - 외부에 노출

function initCreateFeedModal() {
    $modal = document.getElementById('createPostModal');

    // 모달 열기 함수
    const openModal = e => {
        e.preventDefault();
        // 모달 열기
        $modal.style.display = 'flex';
    };

    // 피드 생성 모달 열기 이벤트
    document.querySelector('.fa-square-plus')
        .closest('.menu-item')
        .addEventListener('click', openModal) ;  // 모달 열기 함수를 바깥으로 뺀 후 openModal 함수를 여기에 바인딩!
}

export default initCreateFeedModal;