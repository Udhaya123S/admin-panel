
function getCookie(name) {
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");

        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}


function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure; SameSite=Strict";
}


document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const response = await fetch('http://localhost:2000/v1/auth/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
                //'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert('Email or password is invalid');
            errorMessage.textContent = errorData.message || 'Login failed.';
            errorMessage.style.display = 'block';
        } else {
            const result = await response.json();
            console.log("Response:", result);

            
            if (result.user && result.user.token) {
                manageToken(result.userId, result.user.token);
                getCookie();
            }

            
            if (result.user.role === 'admin') {
                alert(result.message || 'Welcome, Admin!');
                window.location.href = "/dashboard/index.html";
            } else {
                alert('Login successful, but you do not have admin access.');
            }
        }
    } catch (error) {
        console.error('Network Error:', error);
        errorMessage.textContent = 'An unexpected network error occurred. Please try again later.';
        errorMessage.style.display = 'block';
    }
});


function manageToken(userId, token) {
    const existingTokens = getCookie('tokens');
    let tokens = existingTokens ? JSON.parse(existingTokens) : {};

    
    if (tokens[userId]) {
        delete tokens[userId];
    }

    
    tokens[userId] = token;

   
    setCookie('tokens', JSON.stringify(tokens), 7); 
}
