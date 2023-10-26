class Tasks {
  constructor() {
    this.task = '';
    this.id = 0;
    this.color = '';
    this.finished = false;
  }
  
  set setTask(newTask) {
    this.task = newTask;
  }

  get getTask() {
    return this.task
  }

  set setId(newId) {
    this.id = newId;
  }

  get getId() {
    return this.id
  }

  set setColor(newColor) {
    this.color = newColor;
  }

  get getColor() {
    return this.color
  }

  set setFinished(isfinished) {
    this.finished = isfinished;
  }

  get getFinished() {
    return this.finished
  }
}

const buttonAddTask = document.getElementById("add");
const taskToAdd = document.getElementById("textField");
const taskList = document.getElementById("tasks");

const tasks = document.querySelectorAll(".task");

let arrayTasks;
let finishedTasks = [];

const data = localStorage.getItem('tasks');

if (data) {
  arrayTasks = JSON.parse(data);
  pullList();

} else {
  arrayTasks = [];
}

buttonAddTask.addEventListener("click", () => addToList());
taskToAdd.addEventListener("keypress", (event) => {
  if (event.key === "Enter") addToList();  
});

function pullList() {
  arrayTasks.forEach(item => {
    const div = document.createElement('div');
    const task = document.createElement('li');
    const checkbox = document.createElement('div');
    const glyphCheck = document.createElement('i');

    div.classList.add('box');
    div.style.display = 'flex';
    div.style.alignContent = 'center';
    div.style.gap = '14px';
    div.style.borderRadius = '35px';
    div.style.padding = '10px';
    div.draggable = 'true;'
    div.classList.add('draggable');

    checkbox.setAttribute("id", "checkbox");

    checkbox.appendChild(glyphCheck);

    task.classList.add("task");
    task.setAttribute("id", item.id);
    task.innerHTML = item.task;

    div.appendChild(checkbox);
    div.appendChild(task);
    taskList.appendChild(div);
    
    taskToAdd.value = '';

    if (item.finished) {
      styleFinished(task, checkbox);
    }

    mouseOverTask(div, checkbox);
    clickTask(task, checkbox, glyphCheck);
    updateConclusionPerc();
    addEventListeners();
  })
}

function addToList() {
  if (taskToAdd.value) {
    arrayTasks.push(new Tasks());
    const currentTask = arrayTasks[arrayTasks.length - 1];

    currentTask.task = taskToAdd.value;
    currentTask.id = arrayTasks.length - 1;

    const div = document.createElement('div');
    const task = document.createElement('li');
    const checkbox = document.createElement('div');
    const glyphCheck = document.createElement('i');

    div.classList.add('box');
    div.style.display = 'flex';
    div.style.alignContent = 'center';
    div.style.gap = '14px';
    div.style.borderRadius = '35px';
    div.style.padding = '10px';
    div.draggable = 'true;'
    div.classList.add('draggable');

    checkbox.setAttribute("id", "checkbox");

    checkbox.appendChild(glyphCheck);

    task.classList.add("task");
    task.setAttribute("id", arrayTasks.length -1);
    task.innerHTML = currentTask.task;

    div.appendChild(checkbox);
    div.appendChild(task);
    taskList.appendChild(div);
    
    taskToAdd.value = '';

    mouseOverTask(div, checkbox);
    clickTask(task, checkbox, glyphCheck);
    updateConclusionPerc();
    addEventListeners();
    saveData();
  };
};


function mouseOverTask(div, checkbox) {
  div.addEventListener('mouseenter', () => {
    div.style.backgroundColor = "#a8a8a8";
  });

  div.addEventListener('mouseleave', () => {
    div.style.backgroundColor = "";
  });

  checkbox.addEventListener('mouseenter', () => {
    checkbox.style.backgroundColor = "#dedede";
  });

  checkbox.addEventListener('mouseleave', () => {
    checkbox.style.backgroundColor = "";
  });
};


function clickTask(task, checkbox, glyphCheck) {
  checkbox.addEventListener('click', () => {
    if (!arrayTasks[task.id].finished) {
      styleFinished(task, checkbox)
      checkTask(task.id);
    } else {
      styleUnfinished(task, checkbox)
      uncheckTask(task.id);
    }
  });
};


function checkTask(task) {
  let currentTask = arrayTasks[task];

  finishedTasks.push(currentTask);
  currentTask.finished = true;
  updateConclusionPerc()
  saveData()
}


function uncheckTask(task) {
  let currentTask = arrayTasks[task];

  finishedTasks.splice(arrayTasks[task], 1)
  currentTask.finished = false;
  updateConclusionPerc()
  saveData()
}


function updateConclusionPerc() {
  let percentHtml = document.getElementById("conclusionPerc");
  let percent = Math.round((finishedTasks.length / arrayTasks.length) * 100)

  percentHtml.innerHTML = percent;
}

function dragStart() {
  // console.log('Enter: ', 'dragstart')
  let dragStartIndex = +this.closest('li').getAttribute('id');
  console.log(dragStartIndex)
}

function dragEnter() {
  console.log('Enter: ', 'dragenter')
}

function dragLeave() {
  console.log('Enter: ', 'dragleave')
  this.style.backgroundColor = '';
}

function dragOver() {
  console.log('Enter: ', 'dragover')
  this.style.backgroundColor = '#dedede';
}

function dragDrop() {
  console.log('Enter: ', 'drop')
}

function addEventListeners() {
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.draggable');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
  });

  dragListItems.forEach(item => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });
};

function saveData() {
  const data = JSON.stringify(arrayTasks);
  localStorage.setItem('tasks', data);
}

function styleFinished(task, glyphCheck) {
  task.style.backgroundColor = "#46C963";
  task.style.color = "white";
  glyphCheck.classList.add('fa-solid');
  glyphCheck.classList.add('fa-check');
}

function styleUnfinished(task, glyphCheck) {
  task.style.backgroundColor = "";
  task.style.color = "black";
  glyphCheck.classList.remove('fa-solid');
  glyphCheck.classList.remove('fa-check');
}