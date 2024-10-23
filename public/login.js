document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    login();
});

function login() {
    const emailInput = document.getElementById("logEmail");
    const passwordInput = document.getElementById("logPassword");
    const errorElement = document.getElementById("error");

    // Clear previous error messages
    errorElement.innerHTML = '';

    const email = emailInput.value;
    const password = passwordInput.value;

    // Simple client-side validation
    if (!validateEmail(email)) {
        errorElement.innerHTML = 'Please enter a valid email address.';
        clearInputFields(); // Set inputs to null
        return;
    }

    if (password.length < 6) {
        errorElement.innerHTML = 'Password must be at least 6 characters long.';
        clearInputFields(); // Set inputs to null
        return;
    }

    // Show loading state (optional)
    errorElement.innerHTML = 'Logging in...';
    document.getElementById("loginButton").disabled = true; // Disable button to prevent multiple clicks

    // Make a fetch request to your backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(data => {
                throw new Error(data.message || 'Failed to login');
            });
        }
    })
    .then(data => {
        // Log success and redirect
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.log('Error:', error);
        errorElement.innerHTML = error.message || 'Failed to login. Please try again later.';
        clearInputFields(); // Set inputs to null
    })
    .finally(() => {
        document.getElementById("loginButton").disabled = false; // Re-enable the button after the fetch
    });
}

// Clear input fields
function clearInputFields() {
    document.getElementById("logEmail").value = '';
    document.getElementById("logPassword").value = '';
}

// Simple email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Login and registration toggle functions
var x = document.getElementById('login');
var y = document.getElementById('register');
var z = document.getElementById('btn');

function login1() {
    x.style.left = "27px";
    y.style.right = "-350px";
    z.style.left = "0px";
}

function register() {
    x.style.left = "-350px";
    y.style.right = "25px";
    z.style.left = "150px";
}

// Toggle password visibility
function myLogPassword() {
    togglePasswordVisibility('logPassword', 'eye', 'eye-slash');
}

function myRegPassword() {
    togglePasswordVisibility('regPassword', 'eye-2', 'eye-slash-2');
}

function togglePasswordVisibility(inputId, eyeIconId, eyeSlashIconId) {
    var passwordInput = document.getElementById(inputId);
    var eyeIcon = document.getElementById(eyeIconId);
    var eyeSlashIcon = document.getElementById(eyeSlashIconId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.style.opacity = '0';
        eyeSlashIcon.style.opacity = '1';
    } else {
        passwordInput.type = 'password';
        eyeIcon.style.opacity = '1';
        eyeSlashIcon.style.opacity = '0';
    }
}
