import { getDataFromApi, addTaskToApi, deleteTaskFromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector, addTaskBtn } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$addTaskBtn = document.querySelector(addTaskBtn);
    this.data = [];
  }

  //Built with Oguzhan Olgun

  addTask(task) {
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.data.push(newTask);
        this.fillTable();
        this.$addTaskBtn.removeAttribute('disabled');
        this.$addTaskBtn.innerHTML = 'Add Task';
      });
  }

  deleteTask(id) {
    deleteTaskFromApi(id)
      .then((data) => data.json())
      .then((deletedTask) => {
        this.data = this.data.filter((task) => task.id !== deletedTask.id);
        this.fillTable();
      });
  }

  addTaskToTable(task) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.setAttribute('id', task.id);
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title}</td><button id='${task.id}' type="button" class="close " aria-label="Close">
    <span class="close-span" aria-hidden="true">&times;</span></button>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.$addTaskBtn.setAttribute('disabled', 'disabled');
      this.$addTaskBtn.innerHTML = 'Loading...';
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  fillThisDataFromApi() {
    getDataFromApi().then((currentTasks) => {
      this.data = currentTasks;
      this.fillTable();
    });
  }

  fillTable() {
    this.$tableTbody.innerHTML = '';
    this.data.forEach((task) => {
      this.addTaskToTable(task);
    });
  }

  getDeleteTaskBtns() {
    this.$tableTbody.addEventListener('click', (e) => {
      const element = e.target;
      if (element.className === 'close-span') {
        const { id } = element.parentElement;
        this.deleteTask(id);
      }
    });
  }

  init() {
    this.fillThisDataFromApi();
    this.handleAddTask();
    this.getDeleteTaskBtns();
  }
}

export default PomodoroApp;
