document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    try {
        const response = await fetch('http://localhost:2000/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, email, password, role })
        });

        if (response.ok) {
            const result = await response.json();
            
            alert('Registration successful! You will be redirected to the login page.');

       
            window.location.href = 'login/login.html';  
        } else {
            const errorData = await response.json();
            
          
            alert(`Registration failed: ${errorData.message || 'Please try again.'}`);
        }
    } catch (error) {

        console.error('Error:', error.message);
      
        alert('An unexpected error occurred. Please try again.');
    }
});
