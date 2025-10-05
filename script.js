// Persisted To-Do List with Local Storage
document.addEventListener('DOMContentLoaded', function() {
    // Select elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Load tasks from localStorage (normalize to objects {id, text})
    const raw = JSON.parse(localStorage.getItem('tasks') || '[]');
    const now = Date.now();
    let tasks = raw.map((t, i) => {
        if (typeof t === 'string') {
            // older format — convert to object
            return { id: `${now}-${i}`, text: t };
        }
        // assume it's already an object {id, text}
        return t;
    });

    // Save the tasks array to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create and append a task <li> to the DOM for a given task object
    function renderTask(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;

        // text wrapper (so CSS or children won't mix)
        const span = document.createElement('span');
        span.textContent = task.text;
        li.appendChild(span);

        // remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');

        // remove handler
        removeBtn.addEventListener('click', function() {
            removeTask(task.id);
        });

        li.appendChild(removeBtn);
        taskList.appendChild(li);
    }

    // Render all tasks currently in memory
    function loadTasks() {
        taskList.innerHTML = '';
        tasks.forEach(renderTask);
    }

    // Add a new task (text). If called from load, pass save=false to avoid double-saving.
    function addTask(taskText, save = true) {
        const text = (taskText || '').trim();
        if (!text) {
            alert('Please enter a task!');
            return;
        }

        const task = { id: `${Date.now()}-${Math.random().toString(36).slice(2,9)}`, text };
        tasks.push(task);
        renderTask(task);

        if (save) saveTasks();

        taskInput.value = '';
        taskInput.focus();
    }

    // Remove a task by id (from DOM and storage)
    function removeTask(id) {
        // remove from array
        const idx = tasks.findIndex(t => t.id === id);
        if (idx === -1) return;

        tasks.splice(idx, 1);
        saveTasks();

        // remove from DOM
        const li = taskList.querySelector(`li[data-id="${id}"]`);
        if (li) li.remove();
    }

    // Event listeners
    addButton.addEventListener('click', function() {
        addTask(taskInput.value);
    });

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    // Initial render
    loadTasks();
});
