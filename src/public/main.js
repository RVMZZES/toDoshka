const inputMain = document.querySelector('.mainInp');
const addBtn = document.querySelector('.addTask');
const workSpace = document.querySelector('.workSpace');
const delTasksBtn = document.querySelector('.delAll');
const main = document.querySelector('.main');
const dialog = document.querySelector('.dialog');

import './index.html';
import './style.scss';
import save from '../../images/save.png';
import del from '../../images/delete.png';
import redact from '../../images/redact.png';
import wait from '../../images/wait.png';
import done from '../../images/done.png';

function getTaskList() {
    return fetch('http://localhost:3000/api/data')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function updateAllTasks() {
    getTaskList().then(data => rerenderAllTasks(data));
}

function redactTask(taskId, obj) {
    fetchRequestAndUpdate(`http://localhost:3000/api/data/${taskId}`, {
        method: 'PUT', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(obj)
    })
}
function fetchRequestAndUpdate(patch, options) {
    fetch(patch, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                updateAllTasks();
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function deleteOneTask(taskId) {
    fetchRequestAndUpdate(`http://localhost:3000/api/data/${taskId}`, {method: 'DELETE'});
}

function getRenderTask(obj) {
    let div = document.createElement('div');
    let span = document.createElement('span');
    let imgDone = document.createElement('img');
    let imgEdit = document.createElement('img');
    let imgRemove = document.createElement('img');
    let imgDiv = document.createElement('div');
    let taskId = obj._id;
    div.className = 'task';
    imgEdit.src = redact;
    imgDone.src = wait;
    imgRemove.src = del;
    imgEdit.className = 'icons';
    imgDone.className = 'icons';
    imgRemove.className = 'icons';
    span.textContent = obj.text;
    if (obj.checked === true) {
        span.style.textDecoration = 'line-through';
        imgDone.src = done;
    }

    imgRemove.addEventListener('click', function () {
        createDialogWindow(obj.text, function ()
        {
            deleteOneTask(taskId)
        })
    });
    imgDone.addEventListener('click', function () {
        obj.checked = !obj.checked;
        redactTask(taskId, obj);
    });
    imgEdit.addEventListener('click', function () {
        let imgSave = document.createElement('img');
        let input = document.createElement('input');
        input.value = span.textContent;
        input.className = 'inp';
        imgSave.src = save;
        imgSave.className = 'icons';
        div.replaceChild(input, span);
        imgDiv.replaceChild(imgSave, imgEdit);

        imgSave.addEventListener('click', function () {
            obj.text = input.value;
            redactTask(taskId, obj);
        });
    });

    imgDiv.appendChild(imgDone);
    imgDiv.appendChild(imgEdit);
    imgDiv.appendChild(imgRemove);
    div.appendChild(span);
    div.appendChild(imgDiv);
    return div;
}

function addNewTask() {
    let val = inputMain.value;
    let obj = {text: val, checked: false};
    if (val !== '') {
        fetch('http://localhost:3000/api/user', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(obj)
        })
            .then(response => response.json())
            .then(() => {
                updateAllTasks();
                console.log('Success added');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        inputMain.value = '';
    }
}

addBtn.addEventListener('click', addNewTask);

inputMain.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addNewTask();
    }
});

function rerenderAllTasks(arr) {
    workSpace.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        workSpace.appendChild(getRenderTask(arr[i]));
    }
}

function deleteAllTasks() {
    fetchRequestAndUpdate(`http://localhost:3000/api/data`, {method: 'DELETE'})
}

delTasksBtn.addEventListener('click', function () {
    createDialogWindow('ALL TASKS', deleteAllTasks)
});

window.addEventListener('load', () => {
    updateAllTasks();
});

function hideDialogWindow(dialogWindowMain) {
    dialog.removeChild(dialogWindowMain);
    dialog.classList.remove('visible');
    main.classList.remove('show-blur');
}

function createDialogWindow(text, func) {
    let dialogWindowMain =document.createElement('div');
    dialogWindowMain.className = 'dialog-window'
    dialogWindowMain.innerHTML = `
                            <p>Are you sure that you want to delete task?<br> <br> "${text}"</p>
                             <div class="btns-container">
                                <button class="del-btn">Delete</button>
                                <button class="cancel-btn">Cancel</button>
                        `
    dialog.appendChild(dialogWindowMain);
    dialog.classList.add('visible');
    setTimeout( () => main.classList.add('show-blur'), 100)
    dialogWindowMain.querySelector('.cancel-btn').addEventListener('click', () => hideDialogWindow(dialogWindowMain));
    dialogWindowMain.querySelector('.del-btn').addEventListener('click', function () {
        func();
        hideDialogWindow(dialogWindowMain);
    });
}
