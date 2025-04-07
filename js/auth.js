// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulate authentication
    if (email && password) {
      currentUser = {
        id: 1,
        username: email.split('@')[0],
        email: email,
        isAuthenticated: true
      };
      
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      updateAuthUI();
      closeModal();
      displayDiscussions();
    } else {
      alert('Please enter both email and password');
    }
  }
  
  function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (name && email && password) {
      currentUser = {
        id: 2,
        username: name,
        email: email,
        isAuthenticated: true
      };
      
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      updateAuthUI();
      closeModal();
      displayDiscussions();
      
      alert('Registration successful!');
    } else {
      alert('Please fill all fields');
    }
  }
  
  function logoutUser() {
    currentUser = {
      id: null,
      username: "Guest",
      isAuthenticated: false
    };
    
    localStorage.removeItem('currentUser');
    updateAuthUI();
    displayDiscussions();
  }
  
  // Initialize auth event listeners
  document.addEventListener('DOMContentLoaded', function() {
    // Check if elements exist before adding event listeners
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (registerBtn) registerBtn.addEventListener('click', showRegisterModal);
    if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
    
    // Check for stored user
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      updateAuthUI();
    }
  });