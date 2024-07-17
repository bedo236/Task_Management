document.addEventListener('DOMContentLoaded', () => {
    // Function to handle login and store token
    async function handleLogin(username, password) {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const { token } = data;

            // Store token securely (e.g., localStorage)
            localStorage.setItem('token', token);

            // Optionally, redirect or update UI upon successful login
            console.log('Login successful');
        } catch (error) {
            console.error('Login error:', error.message);
            // Handle login error: display message to user, retry logic, etc.
        }
    }

    // Function to fetch tasks
    async function fetchTasks() {
        const token = localStorage.getItem('token');
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
            // Update the UI with fetched tasks
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
        }
    }

    // Function to fetch teachers
    async function fetchTeachers() {
        const token = localStorage.getItem('token');
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
            // Update the UI with fetched teachers
        } catch (error) {
            console.error('Error fetching teachers:', error.message);
        }
    }

    // Event listener for login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            await handleLogin(username, password);
            await fetchTasks(); // Fetch tasks after successful login
            await fetchTeachers(); // Fetch teachers after successful login
        });
    } else {
        console.error('Login form not found');
    }
});
