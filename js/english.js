// math.js

// Simulated discussions data (to be replaced with backend data later)
let discussions = [
    {
      title: "How to solve quadratic equations?",
      content: "Does anyone know the best way to solve quadratic equations?",
      comments: [
        { username: "John Doe", comment: "You can use the quadratic formula to solve these.", likes: 5 },
        { username: "Jane Smith", comment: "I find factoring easier.", likes: 3 },
      ]
    },
    {
      title: "Integration tips",
      content: "Any tips for solving integration problems?",
      comments: [
        { username: "Alice Brown", comment: "Practice is key!", likes: 2 },
        { username: "Bob White", comment: "Look for substitution methods.", likes: 1 },
      ]
    }
  ];
  
  // Function to display discussions and their comments
  function displayDiscussions() {
    const discussionsContainer = document.getElementById('discussions-container');
    discussionsContainer.innerHTML = ''; // Clear existing content
  
    discussions.forEach(discussion => {
      const discussionDiv = document.createElement('div');
      discussionDiv.classList.add('discussion-item');
      
      discussionDiv.innerHTML = `
        <p class="discussion-title">${discussion.title}</p>
        <p class="discussion-content">${discussion.content}</p>
        
        <!-- Comments Section -->
        <div class="comments-section">
          ${discussion.comments.map(comment => `
            <div class="comment">
              <p><strong>${comment.username}:</strong> ${comment.comment}</p>
              <button class="like-btn" onclick="likeComment(${discussions.indexOf(discussion)}, ${discussion.comments.indexOf(comment)})">Like (${comment.likes})</button>
              <button class="reply-btn">Reply</button>
            </div>
          `).join('')}
        </div>
        
        <!-- Comment Form -->
        <div class="comment-form">
          <textarea placeholder="Add a comment..." rows="3"></textarea>
          <button class="comment-submit" onclick="postComment(${discussions.indexOf(discussion)})">Post Comment</button>
        </div>
      `;
  
      discussionsContainer.appendChild(discussionDiv);
    });
  }
  
  // Function to post a new discussion
  function postDiscussion() {
    const discussionText = document.getElementById('new-discussion-text').value.trim();
    if (discussionText !== '') {
      const newDiscussion = {
        title: discussionText.split('\n')[0], // Title is the first line of the discussion
        content: discussionText,
        comments: []
      };
      discussions.push(newDiscussion);
      displayDiscussions(); // Refresh the discussions list
      document.getElementById('new-discussion-text').value = ''; // Clear the textarea
    } else {
      alert("Please write something to start a discussion.");
    }
  }
  
  // Function to post a comment on a discussion
  function postComment(discussionIndex) {
    const commentText = document.querySelectorAll('.discussion-item')[discussionIndex].querySelector('textarea').value.trim();
    if (commentText !== '') {
      const newComment = { username: "Current User", comment: commentText, likes: 0 };
      discussions[discussionIndex].comments.push(newComment);
      displayDiscussions(); // Refresh the discussions list
    } else {
      alert("Please write a comment.");
    }
  }
  
  // Function to like a comment and update its display
function likeComment(discussionIndex, commentIndex) {
    discussions[discussionIndex].comments[commentIndex].likes++;
    const commentElement = document.querySelectorAll('.discussion-item')[discussionIndex]
      .querySelectorAll('.comment')[commentIndex];
    const likeButton = commentElement.querySelector('.like-btn');
    likeButton.innerHTML = `Like (${discussions[discussionIndex].comments[commentIndex].likes})`;
  }
  
  
  // Initial display of discussions when the page loads
  document.addEventListener('DOMContentLoaded', function() {
    displayDiscussions();
  });
  