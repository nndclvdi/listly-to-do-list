let tasks = [];
let taskId = 1;

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    updateStats();
    updateEmptyState();
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        // Add a subtle shake animation to the input
        taskInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            taskInput.style.animation = '';
        }, 500);
        return;
    }
    
    const task = {
        id: taskId++,
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    updateEmptyState();
    
    taskInput.value = '';
    taskInput.style.background = 'rgba(76, 175, 80, 0.1)';
    setTimeout(() => {
        taskInput.style.background = 'rgba(255, 255, 255, 0.9)';
    }, 300);
}

function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.innerHTML = `
        <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})">
            ${task.completed ? '✓' : ''}
        </div>
        <span class="task-text ${task.completed ? 'completed' : ''}" ondblclick="editTask(${task.id})">${task.text}</span>
        <input type="text" class="task-edit-input hidden" onblur="saveEdit(${task.id})" onkeypress="handleEditKeypress(event, ${task.id})" maxlength="100">
        <div class="task-buttons">
            <button class="edit-btn" onclick="editTask(${task.id})" title="Edit tugas">✎</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})" title="Hapus tugas">×</button>
        </div>
    `;
    
    return taskItem;
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
        
        if (task.completed) {
            showCompletionEffect();
        }
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const taskElement = document.querySelector(`[ondblclick="editTask(${id})"]`).parentElement;
    const taskText = taskElement.querySelector('.task-text');
    const editInput = taskElement.querySelector('.task-edit-input');
    const editBtn = taskElement.querySelector('.edit-btn');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    
    taskText.classList.add('hidden');
    editInput.classList.remove('hidden');
    editBtn.classList.add('hidden');
    deleteBtn.classList.add('hidden');
    
    editInput.value = task.text;
    editInput.focus();
    editInput.select();
    
    taskElement.classList.add('editing');
}

function saveEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const taskElement = document.querySelector(`[onblur="saveEdit(${id})"]`).parentElement;
    const taskText = taskElement.querySelector('.task-text');
    const editInput = taskElement.querySelector('.task-edit-input');
    const editBtn = taskElement.querySelector('.edit-btn');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    
    const newText = editInput.value.trim();
    
    if (newText !== '' && newText !== task.text) {
        task.text = newText;
        taskText.textContent = newText;
        saveTasks();
        
        taskElement.style.background = 'rgba(76, 175, 80, 0.1)';
        setTimeout(() => {
            taskElement.style.background = '';
        }, 500);
    }
    
    taskText.classList.remove('hidden');
    editInput.classList.add('hidden');
    editBtn.classList.remove('hidden');
    deleteBtn.classList.remove('hidden');
    
    taskElement.classList.remove('editing');
}

function handleEditKeypress(event, id) {
    if (event.key === 'Enter') {
        event.target.blur(); 
    } else if (event.key === 'Escape') {
        cancelEdit(id);
    }
}

function cancelEdit(id) {
    const taskElement = document.querySelector(`[onblur="saveEdit(${id})"]`).parentElement;
    const taskText = taskElement.querySelector('.task-text');
    const editInput = taskElement.querySelector('.task-edit-input');
    const editBtn = taskElement.querySelector('.edit-btn');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    
    taskText.classList.remove('hidden');
    editInput.classList.add('hidden');
    editBtn.classList.remove('hidden');
    deleteBtn.classList.remove('hidden');
    
    taskElement.classList.remove('editing');
}
function deleteTask(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        const taskElement = document.querySelector(`[onclick="deleteTask(${id})"]`).parentElement;
        taskElement.style.animation = 'slideOutRight 0.3s ease-out';
        
        setTimeout(() => {
            tasks.splice(taskIndex, 1);
            saveTasks();
            renderTasks();
            updateStats();
            updateEmptyState();
        }, 300);
    }
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    animateNumber(totalTasks, total);
    animateNumber(completedTasks, completed);
    animateNumber(pendingTasks, pending);
}

function animateNumber(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue !== newValue) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#667eea';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 150);
    }
}

function updateEmptyState() {
    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        taskList.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        taskList.classList.remove('hidden');
    }
}

function showCompletionEffect() {
    const effect = document.createElement('div');
    effect.innerHTML = '🎉';
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        z-index: 1000;
        animation: celebrationPop 1s ease-out forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        document.body.removeChild(effect);
    }, 1000);
}

function saveTasks() {
    try {
        // In artifact environment, we'll use a simple variable instead
        // localStorage.setItem('listly-tasks', JSON.stringify(tasks));
    } catch (error) {
        console.log('Storage not available in this environment');
    }
}

function loadTasks() {
    try {
        renderTasks();
    } catch (error) {
        console.log('Storage not available in this environment');
    }
}
