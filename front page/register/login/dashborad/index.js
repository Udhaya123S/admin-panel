document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('header-logout');
    logoutBtn.addEventListener('click', handleLogout);

    const searchInput = document.getElementById('search');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    let currentPage = 1; 
    const limit = 5; 

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim();
        currentPage = 1; 
        fetchUsers(currentPage, limit, searchTerm);
    });

   
    fetchUsers(currentPage, limit);
    
    
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchUsers(currentPage, limit, searchInput.value.trim());
        }
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        fetchUsers(currentPage, limit, searchInput.value.trim());
    });
});

async function fetchUsers(page = 1, limit = 5, search = '') {
    const url = `http://localhost:2000/v1/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Network response was not ok: ${errorMessage}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        const tableBody = document.querySelector('#user-table tbody');
        tableBody.innerHTML = '';

        if (data && data.data && data.data.length > 0) {
            data.data.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>******</td>
                        <td>${user.role}</td>
                        <td>${user.status}</td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="6">No users found.</td></tr>'; 
        }

      
        updatePagination(data.total, page, limit);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('Failed to load user data. Please try again later.');
    }
}

function updatePagination(totalCount, currentPage, limit) {
    const totalPages = Math.ceil(totalCount / limit);
    const currentPageSpan = document.getElementById('current-page');
    
    
    currentPageSpan.textContent = `Page ${currentPage} of ${totalPages}`;

    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
}

async function handleLogout(event) {
    event.preventDefault();
    console.log('Logout initiated');

    try {
        const response = await fetch('http://localhost:2000/v1/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',  });

        console.log('Logout response status:', response.status);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Logout failed: ${errorMessage}`);
        }

        deleteTokenCookie();  

        alert("Logout successful");
        window.location.href = '/login.html';  
    } catch (error) {
        console.error('Error during logout:', error);
        alert(`Error: ${error.message}`);
    }
}

function deleteTokenCookie() {
    document.cookie =`token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}


