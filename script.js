document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('entrada-tarea');
    const categorySelect = document.getElementById('selector-categoria');
    const dueDateInput = document.getElementById('entrada-fecha-vencimiento');
    const addBtn = document.getElementById('btn-agregar');
    const taskList = document.getElementById('lista-tareas');
    const darkToggle = document.getElementById('alternador-oscuro');
    const filterBtns = document.querySelectorAll('.btn-filtro');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    let isFilterChange = false;

    // Modo oscuro
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
        darkToggle.textContent = '☀️';
    }

    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        document.documentElement.classList.toggle('dark');
        const isDarkMode = document.body.classList.contains('dark');
        darkToggle.textContent = isDarkMode ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Eventos de filtro
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            isFilterChange = true;
            renderTasks();
            isFilterChange = false;
        });
    });

    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    function addTask() {
        console.log('addTask llamado');
        const taskText = taskInput.value.trim();
        console.log('taskText:', taskText);
        console.log('categoria:', categorySelect.value);
        console.log('fechaVencimiento:', dueDateInput.value);
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            category: categorySelect.value,
            dueDate: dueDateInput.value || null,
            completed: false
        };

        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        dueDateInput.value = '';
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        console.log('renderTasks llamado');
        if (isFilterChange) {
            taskList.classList.add('fade-out');
            setTimeout(() => {
                taskList.innerHTML = '';
                let filteredTasks = tasks.filter(task => {
                    if (currentFilter === 'pendiente') return !task.completed;
                    if (currentFilter === 'completado') return task.completed;
                    if (currentFilter === 'urgente') return task.category === 'urgente';
                    return true;
                });

                // Ordenar por fecha de vencimiento, completadas al final
                filteredTasks.sort((a, b) => {
                    if (a.completed && !b.completed) return 1;
                    if (!a.completed && b.completed) return -1;
                    if (!a.dueDate || !b.dueDate) return 0;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });

                console.log('filteredTasks:', filteredTasks);

                filteredTasks.forEach(task => {
                    const li = document.createElement('li');
                    li.className = `elemento-tarea ${task.completed ? 'completado' : ''}`;
                    li.dataset.id = task.id;

                    const categoryBadge = document.createElement('span');
                    categoryBadge.className = `insignia-categoria categoria-${task.category}`;
                    categoryBadge.textContent = task.category.charAt(0).toUpperCase() + task.category.slice(1);

                    const dueDateSpan = document.createElement('span');
                    dueDateSpan.className = 'fecha-vencimiento';
                    if (task.dueDate) {
                        const due = new Date(task.dueDate);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (due < today) {
                            dueDateSpan.classList.add('vencida');
                        }
                        dueDateSpan.textContent = due.toLocaleDateString();
                } else {
                    dueDateSpan.textContent = 'Sin Fecha';
                }

                    const taskText = document.createElement('span');
                    taskText.className = 'texto-tarea';
                    taskText.textContent = task.text;

                    const editInput = document.createElement('input');
                    editInput.className = 'entrada-edicion';
                    editInput.type = 'text';
                    editInput.value = task.text;
                    editInput.style.display = 'none';

                    const doneBtn = document.createElement('button');
                    doneBtn.className = 'btn-tarea';
                    doneBtn.innerHTML = task.completed ? '↻' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    doneBtn.addEventListener('click', () => toggleComplete(task.id));

                    const editBtn = document.createElement('button');
                    editBtn.className = 'btn-tarea btn-editar';
                    editBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    editBtn.addEventListener('click', () => enterEditMode(li, task));

                const saveBtn = document.createElement('button');
                saveBtn.className = 'btn-tarea btn-guardar';
                saveBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                saveBtn.style.display = 'none';
                saveBtn.addEventListener('click', () => saveEdit(task.id, editInput.value));

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'btn-tarea';
                    deleteBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    deleteBtn.addEventListener('click', () => deleteTask(task.id));

                    // Agregar en orden: insignia, fecha, texto/entrada, botones
                    li.appendChild(categoryBadge);
                    li.appendChild(dueDateSpan);
                    li.appendChild(taskText);
                    li.appendChild(editInput);
                    li.appendChild(doneBtn);
                    li.appendChild(editBtn);
                    li.appendChild(saveBtn);
                    li.appendChild(deleteBtn);

                    editInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') saveEdit(task.id, editInput.value);
                    });

                    taskList.appendChild(li);

                    setTimeout(() => {
                        li.classList.add('fade-in');
                    }, 0);
                });

                taskList.classList.remove('fade-out');
            }, 150);
        } else {
            taskList.innerHTML = '';
            let filteredTasks = tasks.filter(task => {
                if (currentFilter === 'pendiente') return !task.completed;
                if (currentFilter === 'completado') return task.completed;
                if (currentFilter === 'urgente') return task.category === 'urgente';
                return true;
            });

            // Ordenar por fecha de vencimiento, completadas al final
            filteredTasks.sort((a, b) => {
                if (a.completed && !b.completed) return 1;
                if (!a.completed && b.completed) return -1;
                if (!a.dueDate || !b.dueDate) return 0;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });

            console.log('filteredTasks:', filteredTasks);

            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `elemento-tarea ${task.completed ? 'completado' : ''}`;
                li.dataset.id = task.id;

                const categoryBadge = document.createElement('span');
                categoryBadge.className = `insignia-categoria categoria-${task.category}`;
                categoryBadge.textContent = task.category.charAt(0).toUpperCase() + task.category.slice(1);

                const dueDateSpan = document.createElement('span');
                dueDateSpan.className = 'fecha-vencimiento';
                if (task.dueDate) {
                    const due = new Date(task.dueDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (due < today) {
                        dueDateSpan.classList.add('vencida');
                    }
                    dueDateSpan.textContent = due.toLocaleDateString();
                } else {
                    dueDateSpan.textContent = 'Sin Fecha';
                }

                const taskText = document.createElement('span');
                taskText.className = 'texto-tarea';
                taskText.textContent = task.text;

                const editInput = document.createElement('input');
                editInput.className = 'entrada-edicion';
                editInput.type = 'text';
                editInput.value = task.text;
                editInput.style.display = 'none';

                const doneBtn = document.createElement('button');
                doneBtn.className = 'btn-tarea';
                doneBtn.innerHTML = task.completed ? '↻' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                doneBtn.addEventListener('click', () => toggleComplete(task.id));

                const editBtn = document.createElement('button');
                editBtn.className = 'btn-tarea btn-editar';
                editBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                editBtn.addEventListener('click', () => enterEditMode(li, task));

                const saveBtn = document.createElement('button');
                saveBtn.className = 'btn-tarea btn-guardar';
                saveBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                saveBtn.style.display = 'none';
                saveBtn.addEventListener('click', () => saveEdit(task.id, editInput.value));

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn-tarea';
                deleteBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                deleteBtn.addEventListener('click', () => deleteTask(task.id));

                // Agregar en orden: insignia, fecha, texto/entrada, botones
                li.appendChild(categoryBadge);
                li.appendChild(dueDateSpan);
                li.appendChild(taskText);
                li.appendChild(editInput);
                li.appendChild(doneBtn);
                li.appendChild(editBtn);
                li.appendChild(saveBtn);
                li.appendChild(deleteBtn);

                editInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') saveEdit(task.id, editInput.value);
                });

                taskList.appendChild(li);

                setTimeout(() => {
                    li.classList.add('fade-in');
                }, 0);
            });
        }
    }

    function toggleComplete(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    function enterEditMode(li, task) {
        li.classList.add('modo-edicion');
        const editInput = li.querySelector('.entrada-edicion');
        editInput.focus();
    }

    function saveEdit(id, newText) {
        if (newText.trim() === '') return;
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }

    // Renderizado inicial
    renderTasks();
});
