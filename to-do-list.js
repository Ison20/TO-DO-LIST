const themeBtn = document.getElementById('theme-btn');
const totalNumber = document.getElementById('total-number');
const completedNumber = document.getElementById('completed-number');
const pendingNumber = document.getElementById('pending-number');
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const tasksList = document.getElementById('tasks-list');
const emptyState = document.getElementById('empty-state');
const clearCompleted = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

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

// Activating add a new task function
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

//Add a new task function
function addTask() {
    if (taskInput.value) {
        const newTask = {
            id: Date.now(),
            text: taskInput.value.trim(),
            completed: false
        };
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        updateStats();
    }
};


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
    localStorage.getItem('tasks'.JSON.parse(tasks));
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
        emptyState.classList.remove('visible');
        filteredTasks.forEach((task) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML =
            `<span class="task-text ${task.completed ? 'completed' : ''}" data-id="${task.id}">${task.text}</span>
            <button class="delete-btn" data-id="${task.id}">
                <i class= "fas fa-trash"></i>
            </button> `;

            li.querySelector('.task-text').addEventListener('click', () => {
                taskCompletion(task.id)
            });

            li.querySelector('.delete-btn').addEventListener('click', () => {
                deleteTask(task.id);
            });
        filteredTasks.appendChild(li);
        });
    }
}

// Task completion function
function taskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
};

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// Update stats
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalNumber.textContent = total;
    completedNumber.textContent = completed;
    pendingNumber.textContent = pending;
}

//clear all completted tasks
clearCompleted.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateStats();
})

// filter tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(btn => btn.classList.remove('chaguo'));
        btn.classList.add('chaguo');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
})

document.querySelector('[data-filter="all"]').classList.add('chaguo');
