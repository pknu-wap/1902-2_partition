const toDoForm = document.querySelector(".js-toDoForm");
const toDoInput = toDoForm.querySelector("input");
const toDoList = document.querySelector(".js-toDoList");

// LS == local storage
// ���� ���丮������ ������ string�� ���� ����
const TODOS_LS = "toDos";

function deleteToDo(event) {
    const btn = event.target;
    const li = btn.parentNode;
    toDoList.removeChild(li);

    // li ���� ��¥ toDos���� ���� �ؾ���.
    // �̰��ϸ� id === 1�� �� ��Ƴ���.
    // �̶� li�� ���°� �����ϸ� �װ� id === 1�� ����.
    const cleanToDos = toDos.filter(function (toDo) {
        // ��� toDos�� li�� id�� ���� �������� ������
        // li.id�� string�̹Ƿ� ����ȯ
        return toDo.id !== parseInt(li.id);
    });
    // ��ü����
    //console.log(cleanToDos);
    toDos = cleanToDos;
    saveToDos();
}

// �ؾ� �� ���� �����Ҷ����� toDos arr���ٰ� ����ִ´�.
let toDos = [];

// JSON.stringfy�� object�� string���� �ٲ���
function saveToDos() {
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

function paintToDo(text) {
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const span = document.createElement("span");
    const newId = toDos.length + 1;
    delBtn.innerText = "Delete"; // delbtn�� �����.
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