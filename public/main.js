const inputMain = document.querySelector('.mainInp');
const addBtn = document.querySelector('.addTask');
const body = document.querySelector('.main');
const workSpace = document.querySelector('.workSpace');
const delTasksBtn = document.querySelector('.delAll');

// let counter = 0;
// let arrTasks = [];
function getTaskList() {
    return fetch('http://localhost:3000/api/data')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // Предполагается, что сервер отправляет массив
            if (Array.isArray(data)) {
                return data;
            } else {
                console.error('Response is not an array.');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function updateAllTasks () {
    getTaskList().then(data => rerenderAllTasks(data));
}
function getRenderTask(obj) {
    let div = document.createElement('div');
    let span = document.createElement('span');
    let imgDone = document.createElement('img');
    let imgEdit = document.createElement('img');
    let imgRemove = document.createElement('img');
    let imgDiv = document.createElement('div');

    div.className = 'task';
    imgEdit.src = './images/icons8-редактировать-100.png';
    imgDone.src = './images/icons8-рабочее-состояние-100.png';
    imgRemove.src = './images/icons8-отменить-2-100.png';
    imgEdit.className = 'icons';
    imgDone.className = 'icons';
    imgRemove.className = 'icons';
    span.textContent = obj.text;
    if (obj.checked === true) {
        span.style.textDecoration = 'line-through';
        imgDone.src = './images/icons8-ок-100.png';
    }

    imgRemove.addEventListener('click', function () {
        /*getTaskList().then(data => {
            data = data.filter(element => element.id !== obj.id);
            rerenderAllTasks(data);
        });*/
        //arrTasks = arrTasks.filter(element => element.id !== obj.id);
        //rerenderAllTasks(arrTasks);
        fetch('http://localhost:3000/api/data/:userId', {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                } else {
                   updateAllTasks();
                }
                // Здесь можно обработать успешный ответ DELETE-запроса
            })
            .catch(error => {
                // Здесь можно обработать ошибку запроса
                console.error('There has been a problem with your fetch operation:', error);
            });
    });
    imgDone.addEventListener('click', function () {
        obj.checked = !obj.checked;
        rerenderAllTasks(arrTasks);
    });
    imgEdit.addEventListener('click', function () {
        let imgSave = document.createElement('img');
        let input = document.createElement('input');
        input.value = span.textContent;
        input.className = 'inp';
        imgSave.src = './images/icons8-сохранить-100.png';
        imgSave.className = 'icons';
        div.replaceChild(input, span);
        imgDiv.replaceChild(imgSave, imgEdit);

        imgSave.addEventListener('click', function () {
            obj.text = input.value;
            div.replaceChild(span, input);
            imgDiv.replaceChild(imgEdit, imgSave);
            rerenderAllTasks(arrTasks);
        });
    });

    imgDiv.appendChild(imgDone);
    imgDiv.appendChild(imgEdit);
    imgDiv.appendChild(imgRemove);
    div.appendChild(span);
    div.appendChild(imgDiv);
    return div;
}

addBtn.addEventListener('click', function () {
    let val = inputMain.value;
    let obj = {/*id: counter++,*/ text: val, checked: false};
    if (val !== '') {
        fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
            .then(response => response.json())
            .then(obj => {
                updateAllTasks();
                console.log('Success:', obj);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        // arrTasks.push(obj);
        inputMain.value = '';
    }
});

function rerenderAllTasks(arr) {
    workSpace.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        workSpace.appendChild(getRenderTask(arr[i]));
    }
}

delTasksBtn.addEventListener('click', function () {
    let tasks = workSpace.querySelectorAll('.task');
    for (let i = 0; i < tasks.length; i++) {
        workSpace.removeChild(tasks[i]);
    }
    arrTasks.splice(0, arrTasks.length);
});
// функция, принимающая параметром массив тасков и добавляющая эти таски в workspace
// также затирает предыдущие значения workspace
//
