// Add new subject functionality
document.getElementById('add-subject-btn').addEventListener('click', function() {
    const subjectName = document.getElementById('new-subject-name').value.trim();
    
    if (subjectName !== "") {
      const subjectList = document.getElementById('subject-list');
      
      // Create new subject item
      const newSubjectItem = document.createElement('li');
      newSubjectItem.classList.add('subject-item');
      
      newSubjectItem.innerHTML = `
        <span>${subjectName}</span>
        <button class="delete-subject-btn">Delete</button>
      `;
      
      // Append new subject to the list
      subjectList.appendChild(newSubjectItem);
      
      // Clear input field
      document.getElementById('new-subject-name').value = "";
      
      // Add delete functionality for the new subject
      newSubjectItem.querySelector('.delete-subject-btn').addEventListener('click', function() {
        subjectList.removeChild(newSubjectItem);
      });
    } else {
      alert("Please enter a subject name.");
    }
  });
  
  // Delete subject functionality (for existing subjects)
  document.querySelectorAll('.delete-subject-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const subjectItem = btn.parentElement;
      const subjectList = document.getElementById('subject-list');
      subjectList.removeChild(subjectItem);
    });
  });
  