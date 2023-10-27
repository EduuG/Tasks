class Tasks {
  constructor() {
    this.task = '';
    this.id = 0;
    this.color = '';
    this.finished = false;
  };
};

const buttonAddTask = document.getElementById("add");
const taskToAdd = document.getElementById("textField");
const taskList = document.getElementById("tasks");
const placeholderText = document.getElementById("placeholder");

const tasks = document.querySelectorAll(".task");
let arrayTasks;
let finishedTasks = [];
const data = localStorage.getItem('tasks');

if (data) {
  arrayTasks = JSON.parse(data);
  pullList();

} else {
  arrayTasks = [];
};

buttonAddTask.addEventListener("click", () => addToList());
taskToAdd.addEventListener("keypress", (event) => {
  if (event.key === "Enter") addToList();  
});

function recheck() {
  if (arrayTasks.length > 0) {
    placeholderText.style.display = 'none';
  } else {
    placeholderText.style.display = 'flex';
  };
};



function pullList() {
  arrayTasks.forEach(item => {
    const div = document.createElement('div');
    const task = document.createElement('li');
    const text = document.createElement('p');
    const checkbox = document.createElement('div');
    const glyphCheck = document.createElement('i');
    const options = document.createElement('div');

    taskStyle(div, task, text, checkbox, glyphCheck, options);

    text.innerText = item.task;
    task.setAttribute("id", item.id);

    if (item.finished) {
      finishedTasks.push(item);
      styleFinished(task, checkbox);
    };
    task.appendChild(options);

    mouseOverTask(div, task, checkbox, options);
    clickTask(task, checkbox, glyphCheck);
    optionTask(div, task, text, options);
    updateConclusionPerc();
    recheck();
  });
};


function addToList() {
  if (taskToAdd.value) {
    arrayTasks.push(new Tasks());
    const currentTask = arrayTasks[arrayTasks.length - 1];

    currentTask.task = taskToAdd.value;
    currentTask.id = arrayTasks.length - 1;

    const div = document.createElement('div');
    const task = document.createElement('li');
    const text = document.createElement('p');
    const checkbox = document.createElement('div');
    const glyphCheck = document.createElement('i');
    const options = document.createElement('div');

    taskStyle(div, task, text, checkbox, glyphCheck, options);

    text.innerHTML = currentTask.task;
    task.setAttribute("id", arrayTasks.length - 1);

    task.appendChild(options);

    mouseOverTask(div, task, checkbox, options);
    clickTask(task, checkbox, glyphCheck);
    optionTask(div, task, text, options);
    updateConclusionPerc();
    recheck();
    saveData();
  };
};

function mouseOverTask(div, task, checkbox, options) {
  div.addEventListener('mouseenter', () => {
    div.style.backgroundColor = "#a8a8a8";
    options.style.display = 'flex';
  });

  div.addEventListener('mouseleave', () => {
    div.style.backgroundColor = "";
    options.style.display = 'none';
  });

  checkbox.addEventListener('mouseenter', () => {
    checkbox.style.backgroundColor = "#dedede";
  });

  checkbox.addEventListener('mouseleave', () => {
    checkbox.style.backgroundColor = "";
  });
};


function clickTask(task, checkbox) {
  checkbox.addEventListener('click', () => {
    if (!arrayTasks[task.id].finished) {
      styleFinished(task, checkbox)
      checkTask(task.id);
    } else {
      styleUnfinished(task, checkbox)
      uncheckTask(task.id);
    };
  });
};


function checkTask(task) {
  let currentTask = arrayTasks[task];

  finishedTasks.push(currentTask);
  currentTask.finished = true;
  updateConclusionPerc();
  saveData();
};


function uncheckTask(task) {
  let currentTask = arrayTasks[task];

  finishedTasks.splice(arrayTasks[task], 1)
  currentTask.finished = false;
  updateConclusionPerc();
  saveData();
};


function optionTask(div, task, text, options) {
  // let currentTask = arrayTasks[task];
  
  options.addEventListener('click', () => {
    if (document.querySelector('.taskOption') !== null) {
      document.querySelector('.taskOption').remove();
    }
    optionTaskMenu(div, task, text, options);
  });
};


function optionTaskMenu(div, task, text, options) {
  const menu = document.createElement('div');
  //const renameTask = createOption(menu, 'Rename', 'fa-pen');
  const deleteTask = createOption(menu, 'Delete', 'fa-trash');

  //renameTask.classList.add('rename');
  deleteTask.classList.add('delete');
  
  optionTaskStyle(task, menu, deleteTask);

  window.addEventListener('click', function(e){   
    if (div.contains(e.target)){
    } else{
      menu.style.display = 'none';
      text.style.width = '100%';
    }
  });

  text.style.width = '50%'


  deleteTask.addEventListener('click', () => {
    arrayTasks.splice(task.id, 1);
    div.remove();

    arrayTasks.forEach(item => {
      item.id = arrayTasks.indexOf(item);
      if (item.finished) {
        finishedTasks.splice(arrayTasks[task]);
      };
    });
    recheck();
    saveData();
    updateList();
  });

  if (menu.style.display !== 'flex') {
    menu.style.display = 'flex';
  } else {
    menu.style.display = 'none';
  };
};


function updateList() {
  const domTasks = document.querySelectorAll('.box');
  domTasks.forEach(item => {
    item.remove();
  })
  pullList();
};


function updateConclusionPerc() {
  let percentHtml = document.getElementById("conclusionPerc");
  let percent = Math.round((finishedTasks.length / arrayTasks.length) * 100)

  percentHtml.innerHTML = percent;
};


function saveData() {
  const data = JSON.stringify(arrayTasks);
  localStorage.setItem('tasks', data);
};


function styleFinished(task, glyphCheck) {
  task.style.backgroundColor = "#46C963";
  task.style.color = "white";
  glyphCheck.classList.add('fa-solid');
  glyphCheck.classList.add('fa-check');

};


function styleUnfinished(task, glyphCheck) {
  task.style.backgroundColor = "";
  task.style.color = "black";
  glyphCheck.classList.remove('fa-solid');
  glyphCheck.classList.remove('fa-check');
};


function taskStyle(div, task, text, checkbox, glyphCheck, options) {
    div.classList.add('box');
    div.style.display = 'flex';
    div.style.alignContent = 'center';
    div.style.gap = '14px';
    div.style.borderRadius = '35px';
    div.style.padding = '10px';
    div.draggable = 'true;'
    div.classList.add('draggable');

    options.classList.add('glyphOptions');
    options.classList.add('fa-solid');
    options.classList.add('fa-ellipsis-vertical');
    options.style.cursor = 'pointer';

    checkbox.setAttribute("id", "checkbox");
    checkbox.appendChild(glyphCheck);

    text.classList.add("text");

    task.classList.add("task");
    task.appendChild(options);
    task.appendChild(text);

    div.appendChild(checkbox);
    div.appendChild(task);
    taskList.appendChild(div);

    taskToAdd.value = '';
};


function createOption(menu, text, iconClass) {
  const option = document.createElement('div');
  option.style.display = 'flex';
  option.style.justifyContent = 'center';
  option.style.alignItems = 'center';
  option.style.cursor = 'pointer';
  option.style.borderRadius = '15px';
  option.style.height = '25px';
  option.style.flexGrow = '0';

  const iconBox = document.createElement('div');
  iconBox.style.display = 'flex';
  iconBox.style.marginRight = '10px';
  iconBox.style.justifyContent = 'center';
  iconBox.style.alignItems = 'center';

  const title = document.createElement('p');
  title.innerHTML = text;

  const icon = document.createElement('i');
  icon.classList.add('fa-solid', iconClass);

  iconBox.appendChild(icon);
  option.appendChild(iconBox);
  option.appendChild(title);
  menu.appendChild(option);

  return option
}


function optionTaskStyle(task, menu) {
  menu.classList.add('taskOption');
  menu.style.flexGrow = '0';
  menu.style.maxHeight = '30px';
  menu.style.fontSize = '14px';
  menu.style.boxShadow = '0px 8px 12px -6px rgba(0,0,0,0.4)';
  menu.style.flexDirection = 'column';

  task.appendChild(menu);
};
