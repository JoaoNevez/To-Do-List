const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filters button');
const prioritySelect = document.getElementById('prioritySelect');
const searchInput = document.getElementById('searchInput');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function sortTasks(array) {
    // Concluídas por último e por prioridade
    const priorityOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
    return array.sort((a, b) => {
        if(a.completed !== b.completed) return a.completed - b.completed;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

function renderTasks(filter = 'all', search = '') {
    taskList.innerHTML = '';

    let filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(search.toLowerCase())
    );

    if(filter === 'completed') filteredTasks = filteredTasks.filter(task => task.completed);
    if(filter === 'pending') filteredTasks = filteredTasks.filter(task => !task.completed);

    filteredTasks = sortTasks(filteredTasks);

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;

        if(task.completed) li.classList.add('completed');

        const prioritySpan = document.createElement('span');
        prioritySpan.className = `priority ${task.priority}`;
        prioritySpan.textContent = task.priority;
        li.appendChild(prioritySpan);

        li.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks(filter, searchInput.value);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.style.background = '#f44336';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            renderTasks(filter, searchInput.value);
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;
    if(text !== '') {
        tasks.push({ text, completed: false, priority });
        saveTasks();
        renderTasks('all', searchInput.value);
        taskInput.value = '';
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        renderTasks(btn.dataset.filter, searchInput.value);
    });
});

searchInput.addEventListener('input', () => {
    renderTasks('all', searchInput.value);
});

// Render inicial
renderTasks();
