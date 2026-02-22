const themeBtn = document.getElementById('theme-btn');
const totalNumber = document.getElementById('total-number');
const completedNumber = document.getElementById('completed-number');
const pendingNumber = document.getElementById('pending-number');
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-Btn');
const tasksList = document.getElementById('tasks-list');
const emptyState = document.getElementById('empty-state');
const clearCompleted = document.getElementById('clear-completed');

let tasks = [];
let currentFilter = 'all'







// Activating dark mode
themeBtn.addEventListener('click', () => {
    if (document.documentElement.getAttribute('theme-view') !== 'dark'){
        document.documentElement.setAttribute('theme-view', 'dark');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('theme-view');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark') {
        document.documentElement.setAttribute('theme-view', 'dark');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.removeAttribute('theme-view');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

loadTheme();

// Add a new task
addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
});

//Also add task by just pressing Enter
taskInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

// Save a task
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

//load saved Tasks
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
        updateStats();
    }
    localStorage.getItems('tasks', JSON.parse(tasks));
}

loadTasks();

// Render tasks to any of the filter-btn
function renderTasks() {
    tasksList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        emptyState.classList.add('visible');
    } else {
        emptyState.classLIst.remove('visible');
        filteredTasks.forEach((task) => {
            const taskItem = createTask(task);
            tasksList.appendChild(taskItem);
        })
    }
    }