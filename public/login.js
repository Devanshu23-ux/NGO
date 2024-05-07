document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    login();
});

function login() {
    const email = document.getElementById("logEmail").value;
    const password = document.getElementById("logPassword").value;

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
        alert('Login successful!');
        window.location.href = 'index2.html';
    })
    .catch(error => {
        console.log('Error:', error);
        document.getElementById("error").innerHTML = error.message || 'Failed to login. Please try again later.';
    });
}

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
    var passwordInput = document.getElementById('logPassword');
    var eyeIcon = document.getElementById('eye');
    var eyeSlashIcon = document.getElementById('eye-slash');

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

function myRegPassword() {
    var passwordInput = document.getElementById('regPassword');
    var eyeIcon = document.getElementById('eye-2');
    var eyeSlashIcon = document.getElementById('eye-slash-2');

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
