//Selectors
const addForm = document.querySelector(".add");
const addBtn = document.querySelector(".btn");
const list = document.querySelector(".todos");
const search = document.querySelector(".search");

//Event Listeners
addBtn.addEventListener("click", addTodo);
list.addEventListener("click", removeCheckTodo);
search.addEventListener("keyup", filterTodos);

//Functions
function addTodo(e) {
    e.preventDefault();
    var description = addForm.description.value.trim();
    var deadline = addForm.deadline.value;

    if(description.length){

        var todo = {description: description, deadline: deadline};
        saveSessionTodos(todo);

        generateTodoTemplate(description, deadline);
        addForm.reset();
    }
}

function generateTodoTemplate(todo, deadline) {
    if (deadline){
        var timeLeft = convertDate(deadline);
    }
    else{
        timeLeft = "";
    }

    const html = `
    <li>
            <p>${todo}</p>
            <p id="date">${timeLeft}</p>
            <img src="delete.svg" alt="delete" class="delete">
            <input type="checkbox" class="complete-btn">
        </li>
    `;
    list.innerHTML += html;
}

function saveSessionTodos(todo) {
    var todos;
    if(sessionStorage.getItem("todos") === null){
        todos = [];
    }
    else {
        todos = JSON.parse(sessionStorage.getItem("todos"));
    }
    todos.push(todo);
    sessionStorage.setItem("todos", JSON.stringify(todos));
};

function getTodos () {
    var todos;
    if(sessionStorage.getItem("todos") === null){
        todos = [];
    }
    else {
        todos = JSON.parse(sessionStorage.getItem("todos"));
    }

    for(var i = 0; i < todos.length; i++){
        var description = todos[i].description;
        var deadline = todos[i].deadline;

        if(deadline){
            var timeLeft = convertDate(deadline);
        }
        else{
            timeLeft = "";
        }

        const html = `
        <li>
                <p>${description}</p>
                <p id="date">${timeLeft}</p>
                <img src="delete.svg" alt="delete" class="delete">
                <input type="checkbox" class="complete-btn">
            </li>
        `;
        list.innerHTML += html;
    }
};

function removeSessionTodos (todo) {
    var todos;
    if(sessionStorage.getItem("todos") === null){
        todos = [];
    }
    else {
        todos = JSON.parse(sessionStorage.getItem("todos"));
    }
    var todoIndex = todo.children[0].innerHTML;

    var pos = todos.map(function (e){
        return e.description
    }).indexOf(todoIndex);
    
    todos.splice(pos, 1);

    sessionStorage.setItem("todos", JSON.stringify(todos));
}

function removeCheckTodo(e) {
    var item = e.target;
    if(item.classList.contains('delete')){
        var todo = item.parentElement;
        removeSessionTodos(todo);
        todo.remove();
    }
    if(item.classList.contains('complete-btn')){
        var todo = item.parentElement;
        todo.classList.toggle('completed');
    }
}

function filterTodos() {
    var term = search.value.trim().toLowerCase();
    filter(term);
}

function filter(term) {
    Array.from(list.children)
    .filter((todo) => !todo.firstElementChild.textContent.toLowerCase().includes(term))
    .forEach((todo) => todo.classList.add('hide'));

    Array.from(list.children)
    .filter((todo) => todo.firstElementChild.textContent.toLowerCase().includes(term))
    .forEach((todo) => todo.classList.remove('hide'));
};

function convertDate(deadline) {
    var now =  new Date();
    var to = new Date(deadline);

    var diffInMilliSeconds = Math.abs(to - now) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    
    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    
    var timeLeft = days + "d" + " " + hours + "h" + " " + minutes + "m";
    console.log("time left: " + timeLeft);
    return timeLeft;
};

getTodos();
