const toDoForm = document.querySelector(".js-toDoForm");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.querySelector(".js-toDoList");

// LS == local storage
// 로컬 스토리지에는 오로지 string만 저장 가능
const TODOS_LS = "toDos";

function deleteToDo(event) {
    const btn = event.target;
    const li = btn.parentNode;
    toDoList.removeChild(li);

    // li 말고도 진짜 toDos에서 삭제 해야함.
    // 이거하면 id === 1인 값 잡아낸다.
    // 이때 li에 없는값 삭제하면 그게 id === 1인 값임.
    const cleanToDos = toDos.filter(function (toDo) {
        // 모든 toDos가 li의 id와 같지 않을때만 추출함
        // li.id가 string이므로 형변환
        return toDo.id !== parseInt(li.id);
    });
    // 교체해줌
    //console.log(cleanToDos);
    toDos = cleanToDos;
    saveToDos();
}

// 해야 할 일을 생성할때마다 toDos arr에다가 집어넣는다.
let toDos = [];

// JSON.stringfy는 object를 string으로 바꿔줌
function saveToDos() {
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

function paintToDo(text) {
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const span = document.createElement("span");
    const newId = toDos.length + 1;
    delBtn.innerText = "⛌ "; // delbtn을 만든다.
    delBtn.addEventListener("click", deleteToDo);
    span.innerText = text;
    li.appendChild(delBtn);
    li.appendChild(span);
    li.id = newId;
    toDoList.appendChild(li);
    const toDoObj = {
        text: text,
        id: newId
    };
    toDos.push(toDoObj);
    saveToDos();
}

function handleSumbmit(event) {
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintToDo(currentValue);
    toDoInput.value = "";
}

function loadToDos() {
    const loadedToDos = localStorage.getItem(TODOS_LS);
    if (loadedToDos !== null) {
        const parseToDos = JSON.parse(loadedToDos);
        parseToDos.forEach(function (toDo) {
            paintToDo(toDo.text);
        });
    }
}

function init() {
    loadToDos();
    toDoForm.addEventListener("submit", handleSumbmit);
}

init();