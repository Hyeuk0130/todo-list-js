// HTML에서 필요한 요소들 가져오기
const todoInput = document.querySelector('#todo-input');
const addBtn = document.querySelector('#add-btn');
const todoList = document.querySelector('#todo-list');

// 할 일들을 모아둘 빈 리스트
let todos = [];

// 추가 버튼 누르면 실행되는 기능
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return; // 아무것도 안 쓰고 버튼 누르면 무시

    // 할 일 한 개당 번호(id), 글자(text), 완료여부(completed) 세트로 묶기
    const newTodo = {
        id: Date.now(), 
        text: text,
        completed: false // 처음엔 안 끝마친 상태니까 false
    };

    todos.push(newTodo); // 목록 리스트에 방금 만든 할 일 집어넣기

    saveToLocalStorage(); // 브라우저에 저장하기
    renderTodos();        // 화면에 그려주기

    todoInput.value = ''; // 입력창 다시 깨끗하게 비우기
}

// 브라우저 저장소에 데이터 보관하는 기능
function saveToLocalStorage() {
    // 저장소는 글자만 알아들어서, 배열을 글자 형태로 변환해서 저장함
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 목록 상자에 있는 내용들 화면에 진짜로 그려주는 기능
function renderTodos() {
    todoList.innerHTML = ''; 

    todos.forEach(todo => {
        // 완료 상태(todo.completed가 true)면 li 태그에 completed 라는 클래스 이름을 붙여줌
        todoList.innerHTML += `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <span>${todo.text}</span>
                <div class="btn-group">
                    <button class="complete-btn">${todo.completed ? '취소' : '완료'}</button>
                    <button class="delete-btn">삭제</button>
                </div>
            </li>
        `;
    });
}

// 페이지가 새로 켜졌을 때(새로고침 포함) 실행되는 기능
window.addEventListener('DOMContentLoaded', () => {
    const savedTodos = localStorage.getItem('todos'); // 저장소에서 꺼내오기
    
    // 만약 예전에 저장해둔 할 일이 있다면
    if (savedTodos) {
        // 글자 형태로 굳어있던 데이터를 다시 자바스크립트 배열로 조립함
        todos = JSON.parse(savedTodos);
        renderTodos(); // 화면에 다시 그려주기
    }
});

// 추가 버튼에 클릭 기능 연결하기
addBtn.addEventListener('click', addTodo);

// 리스트 내부 버튼 클릭 기능 (이벤트 위임)
todoList.addEventListener('click', (e) => {
    const target = e.target;
    const li = target.closest('.todo-item');
    if (!li) return;
    
    const todoId = parseInt(li.dataset.id);
    // 배열에서 지금 클릭한 녀석이 몇 번째 칸에 들어있는지 인덱스(방 번호) 찾기
    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    // [삭제] 버튼 클릭 시
    if (target.classList.contains('delete-btn')) {
        todos = todos.filter(todo => todo.id !== todoId);
        saveToLocalStorage();
        renderTodos();
    }

    // [완료] 버튼 클릭 시
    if (target.classList.contains('complete-btn')) {
        // true면 false로, false면 true로 상태를 반대로 뒤집음 (토글)
        todos[todoIndex].completed = !todos[todoIndex].completed;
        
        saveToLocalStorage(); // 변경된 완료 상태 저장소에 업데이트
        renderTodos();        // 화면 다시 그려주기 (classList가 알아서 적용됨)
    }
});