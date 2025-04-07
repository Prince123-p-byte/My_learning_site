// Add new discussion
document.querySelector('.submit-btn').addEventListener('click', function() {
    const newDiscussionText = document.querySelector('.new-discussion textarea').value;
    
    if (newDiscussionText.trim() !== "") {
      const newDiscussion = document.createElement('div');
      newDiscussion.classList.add('discussion-item');
      
      newDiscussion.innerHTML = `
        <p class="discussion-title">New Discussion:</p>
        <p class="discussion-content">${newDiscussionText}</p>
        <div class="comments-section">
          <div class="comment">
            <p><strong>You:</strong> Great discussion!</p>
            <button class="like-btn">Like</button>
            <button class="reply-btn">Reply</button>
          </div>
        </div>
        <div class="comment-form">
          <textarea placeholder="Add a comment..." rows="3"></textarea>
          <button class="comment-submit">Post Comment</button>
        </div>
      `;
      
      // Append new discussion to the container
      document.querySelector('.discussion-section').appendChild(newDiscussion);
      document.querySelector('.new-discussion textarea').value = ""; // Clear the textarea
    }
  });

// Add like button functionality
document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('You liked this comment!');
    });
});

// Add reply button functionality
document.querySelectorAll('.reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('You replied to this comment!');
    });
});

// Add new comment functionality
document.querySelectorAll('.comment-submit').forEach(btn => {
    btn.addEventListener('click', function() {
      const commentText = this.previousElementSibling.value;
      
      if (commentText.trim() !== "") {
        const newComment = document.createElement('div');
        newComment.classList.add('comment');
        newComment.innerHTML = `
          <p><strong>You:</strong> ${commentText}</p>
          <button class="like-btn">Like</button>
          <button class="reply-btn">Reply</button>
        `;
        
        // Append new comment to the discussion
        this.parentElement.querySelector('.comments-section').appendChild(newComment);
        this.previousElementSibling.value = ""; // Clear the comment input
      }
    });
});

// Dynamically populate the subjects on the homepage
document.addEventListener('DOMContentLoaded', function() {
    const subjects = ["Math", "Science", "English", "History", "Geography"];
    const subjectsContainer = document.getElementById('subjects-container');
  
    subjects.forEach(subject => {
      const li = document.createElement('li');
      li.classList.add('subject-item');
      li.innerHTML = `
        <a href="subjects/${subject.toLowerCase()}.html" class="subject-link">${subject}</a>
      `;
      subjectsContainer.appendChild(li);
    });
});
