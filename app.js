let todos = [];
let idToEdit;
let baseUrl = "http://localhost:8000";
let getTodosUrl = `${baseUrl}/apis/v1/todo/list`;
let createTodosUrl = `${baseUrl}/apis/v1/todo`;
window.addEventListener('load', () => {
    loadTodoList();
})

function errorHandler() {
    alert(`some error occured please reload the page`);
}

function populateTodoDetails(id) {
    let todo = todos.find((e) => e.id == id);
    idToEdit = id;
    document.getElementById('title-input-edit').value = todo.title;
    document.getElementById('description-input-edit').value = todo.description;
}

function create() {
    let title = document.getElementById('title-input').value;
    let desc = document.getElementById('description-input').value;
    let createPayload = {
        title: title,
        description: desc
    };
    if (!isValid(createPayload)) {
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", createTodosUrl);
    xhr.addEventListener("load", function () {
        alert(`Successfully created Todo!`);
        loadTodoList();
    });
    xhr.addEventListener("error", errorHandler);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(createPayload));
}

function isValid(todo) {
    if (!todo.title || !todo.description) {
        alert(`invalid values`);
        return false;
    }
    return true;
}

function edit() {
    let title = document.getElementById('title-input-edit').value;
    let desc = document.getElementById('description-input-edit').value;
    let editPayload = {
        title: title,
        description: desc
    };
    if (!isValid(editPayload)) {
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", createTodosUrl + `/${idToEdit}`);
    xhr.addEventListener("load", function () {
        alert(`Successfully updated Todo!`);
        loadTodoList();
    });
    xhr.addEventListener("error", errorHandler);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(editPayload));
}

function loadTodoList() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        let response = JSON.parse(this.responseText);
        todos = response;
        let list = document.getElementById('todos');
        list.innerHTML = '';
        for (item of response) {
            let listItem = document.createElement("LI");
            listItem.innerHTML = `
            <li id=todo${item.id}>
                <button
                        type="button"
                        class="btn btn-warning"
                        data-toggle="modal"
                        data-target="#edit-modal"
                        style="float:right"
                        onClick="populateTodoDetails(${item.id})"
                    >
                    + Edit
                </button>
                <h5>${item.title}</h5>
                <p>${item.description}</p>
            </li>`
            list.appendChild(listItem)
        }
    });
    xhr.addEventListener("error", errorHandler);
    xhr.open("GET", getTodosUrl);
    xhr.send();
}