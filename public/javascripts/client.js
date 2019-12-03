// on은 수신 emit은 전송

var socket = io()

// 클라이언트는 connection이 아니고 connect임
/* 접속 되었을 때 실행 */
socket.on('connect', function () {
    /* 이름을 입력받고 */
    var name = prompt('반갑습니다!', '')

    /* 이름이 빈칸인 경우 */
    if (!name) {
        name = '익명'
    }

    /* 서버에 새로운 유저가 왔다고 알림 */
    socket.emit('newUser', name)
})

/* 서버로부터 데이터 받은 경우 */
socket.on('update', function (data) {
    // var chat = document.getElementById('chat')

    // data.name은 참여중인 인원

    var message = document.createElement('div')
    var node = document.createTextNode(`${data.name}: ${data.message}`)
    var className = ''
    var brdivtag = document.createElement('div')
    var brtag = document.createElement('br')

    var $chat = $('#chat')
    var $member = $('#member')
    

    // 타입에 따라 적용할 클래스를 다르게 지정
    switch (data.type) {
        case 'message':
            className = 'other'
            break

        case 'connect':
            className = 'connect'
            break

        case 'disconnect':
            className = 'disconnect'
            break

        case 'name':
            $member.append(`<div class="cur_mem">${className}</div>`)
            break
    }

    
    

    $chat.append(`<div class="anotherMsg"><span class="anotherName"><strong>${data.name}</strong></span><span class="${className}">${data.message}</span><br></div>`)

    $chat.scrollTop($chat[0].scrollHeight - $chat[0].clientHeight);
})

/* 메시지 전송 함수 */
function send() {
    // 입력되어있는 데이터 가져오기
    var message = document.getElementById('test').value

    // 가져왔으니 데이터 빈칸으로 변경
    document.getElementById('test').value = ''

    // 내가 전송할 메시지 클라이언트에게 표시
    var chat = document.getElementById('chat')
    var msg = document.createElement('div')
    var brdivtag = document.createElement('div')
    var brtag = document.createElement('br')
    var node = document.createTextNode(message)
    var $chat = $('#chat')

    $chat.append(`<div class="myMsg"><span class="msg">${message}</span><br><br></div>`)
    $chat.scrollTop($chat[0].scrollHeight - $chat[0].clientHeight);

    // 서버로 message 이벤트 전달 + 데이터와 함께
    socket.emit('message', {
        type: 'message',
        message: message
    })
}

function enterkey() {
    if (window.event.keyCode == 13) {

        // 엔터키가 눌렸을 때 실행할 내용
        send();
    }
}