document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#registerForm');
    const loginForm = document.querySelector('#loginForm');
    const taskForm = document.querySelector('#taskForm');
    const tasksContainer = document.querySelector('#tasksContainer');
    const confirmation = document.querySelector('#confirmation');
    const teacherSelect = document.querySelector('#teacherSelect');
    let token = null;
    let userRole = null;

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.querySelector('#registerUsername').value;
            const password = document.querySelector('#registerPassword').value;
            const role = document.querySelector('#registerRole').value;

            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, role })
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('User registered successfully:', result);
                    confirmation.textContent = 'User registered successfully';
                    confirmation.style.color = 'green';
                    token = result.token;
                    userRole = role;
                } else {
                    console.error('Error registering user:', result);
                    confirmation.textContent = `Error registering user: ${result.message}`;
                    confirmation.style.color = 'red';
                }
            } catch (error) {
                console.error('Network error:', error);
                confirmation.textContent = 'Network error. Please try again later.';
                confirmation.style.color = 'red';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.querySelector('#loginUsername').value;
            const password = document.querySelector('#loginPassword').value;
            const role = document.querySelector('#loginRole').value;

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, role })
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('User logged in successfully:', result);
                    confirmation.textContent = 'User logged in successfully';
                    confirmation.style.color = 'green';
                    token = result.token;
                    userRole = result.role;
                    localStorage.setItem('token', token);
                    if (userRole === 'admin') {
                        window.location.href = 'admin_tasks.html';
                    } else {
                        window.location.href = 'teacher_tasks.html';
                    }
                } else {
                    console.error('Error logging in:', result);
                    confirmation.textContent = `Error logging in: ${result.message}`;
                    confirmation.style.color = 'red';
                }
            } catch (error) {
                console.error('Network error:', error);
                confirmation.textContent = 'Network error. Please try again later.';
                confirmation.style.color = 'red';
            }
        });
    }

    if (taskForm) {
        fetchTeachers();
        fetchTasks();

        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const description = document.querySelector('#taskDescription').value;
            const date = document.querySelector('#taskDate').value;
            const teacherId = document.querySelector('#teacherSelect').value;

            try {
                const response = await fetch('http://localhost:3000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ description, date, teacherId })
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Task added successfully:', result);
                    confirmation.textContent = 'Task added successfully';
                    confirmation.style.color = 'green';
                    fetchTasks();
                } else {
                    console.error('Error adding task:', result);
                    confirmation.textContent = `Error adding task: ${result.message}`;
                    confirmation.style.color = 'red';
                }
            } catch (error) {
                console.error('Network error:', error);
                confirmation.textContent = 'Network error. Please try again later.';
                confirmation.style.color = 'red';
            }
        });
    }

    async function fetchTasks() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized: Invalid or expired token');
                }
                throw new Error('Failed to fetch tasks');
            }

            const tasks = await response.json();
            console.log('Tasks:', tasks);
            if (tasksContainer) {
                tasksContainer.innerHTML = '';
                tasks.forEach(task => {
                    const taskElement = document.createElement('li');
                    taskElement.textContent = `${task.description} - ${task.date}`;
                    tasksContainer.appendChild(taskElement);
                });
            }
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
        }
    }

    async function fetchTeachers() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/teachers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized: Invalid or expired token');
                }
                throw new Error('Failed to fetch teachers');
            }

            const teachers = await response.json();
            console.log('Teachers:', teachers);
            if (teacherSelect) {
                teacherSelect.innerHTML = '';
                teachers.forEach(teacher => {
                    const option = document.createElement('option');
                    option.value = teacher.id;
                    option.textContent = teacher.username;
                    teacherSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error fetching teachers:', error.message);
        }
    }

    if (window.location.pathname.endsWith('teacher_tasks.html')) {
        fetchTasks();
    }
});
