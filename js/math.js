document.addEventListener('DOMContentLoaded', function() {
      // Data Store with sample data
      const contentStore = {
        lessons: [
          {
            id: 1,
            title: "Introduction to Algebra",
            description: "Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols. In elementary algebra, those symbols (today written as Latin and Greek letters) represent quantities without fixed values, known as variables. Just as sentences describe relationships between specific words, in algebra, equations describe relationships between variables. Take the following example: I have two fields that total 1,800 square yards. Yields for each field are ⅔ gallon of grain per square yard and ½ gallon per square yard. The first field gave 500 more gallons than the second. What are the areas of each field? Let's solve this problem step by step.",
            thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            resources: [
              { 
                type: "video", 
                name: "Algebra Basics.mp4", 
                url: "https://example.com/videos/algebra-basics.mp4",
                isNew: true 
              },
              { 
                type: "pdf", 
                name: "Algebra Exercises.pdf", 
                url: "https://example.com/pdfs/algebra-exercises.pdf",
                isNew: false 
              },
              { 
                type: "image", 
                name: "Algebra Chart.png", 
                url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                isNew: true 
              }
            ],
            author: "John Doe",
            date: new Date('2023-05-15'),
            lastUpdated: new Date('2023-05-20'),
            likes: 24,
            comments: [
              { 
                id: 1, 
                author: "Jane Smith", 
                content: "Great explanation! Really helped me understand the basics.", 
                date: new Date('2023-05-16'),
                isNew: true,
                replies: [
                  {
                    id: 101,
                    author: "Mike Johnson",
                    content: "I agree! The examples were very clear.",
                    date: new Date('2023-05-17'),
                    isNew: false
                  }
                ]
              },
              { 
                id: 2, 
                author: "Alex Brown", 
                content: "Could you provide more examples of word problems?", 
                date: new Date('2023-05-17'),
                isNew: false,
                replies: []
              }
            ],
            showComments: true
          }
        ],
        exercises: [
          {
            id: 1,
            title: "Quadratic Equations Practice",
            description: "Practice solving quadratic equations using different methods: factoring, completing the square, and the quadratic formula.",
            difficulty: "medium",
            resources: [
              { 
                type: "pdf", 
                name: "Quadratic Exercises.pdf", 
                url: "https://example.com/pdfs/quadratic-exercises.pdf",
                isNew: false 
              },
              { 
                type: "image", 
                name: "Quadratic Graph.png", 
                url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                isNew: true 
              }
            ],
            author: "Sarah Johnson",
            date: new Date('2023-05-18'),
            completed: false
          },
          {
            id: 2,
            title: "Basic Arithmetic Drills",
            description: "Simple arithmetic problems to build foundational skills in addition, subtraction, multiplication and division.",
            difficulty: "easy",
            resources: [],
            author: "Michael Chen",
            date: new Date('2023-05-10'),
            completed: true
          }
        ],
        discussions: [
          {
            id: 1,
            title: "Best way to teach fractions?",
            content: "I'm struggling to find effective ways to teach fractions to my students. Does anyone have proven methods or activities that work well?",
            tags: ["fractions", "teaching", "elementary"],
            author: "Emma Wilson",
            date: new Date('2023-05-12'),
            replies: [
              {
                id: 101,
                author: "David Lee",
                content: "I've had success using pizza slices as visual aids. Kids really connect with food examples!",
                date: new Date('2023-05-13'),
                isNew: false
              },
              {
                id: 102,
                author: "Lisa Park",
                content: "Fraction bars work wonders. Start with concrete manipulatives before moving to abstract representations.",
                date: new Date('2023-05-14'),
                isNew: true
              }
            ],
            views: 124,
            likes: 18
          },
          {
            id: 2,
            title: "Calculus for beginners - resources?",
            content: "Can anyone recommend good resources for self-studying calculus? I'm starting from scratch.",
            tags: ["calculus", "self-study", "resources"],
            author: "Robert Taylor",
            date: new Date('2023-05-05'),
            replies: [],
            views: 87,
            likes: 5
          }
        ],
        submissions: [],
        grades: [],

      
      };
      
      // DOM Elements
      const tabBtns = document.querySelectorAll('.tab-btn');
      const tabContents = document.querySelectorAll('.tab-content');
      const lessonsList = document.getElementById('lessons-list');
      const exercisesList = document.getElementById('exercises-list');
      const discussionsList = document.getElementById('discussions-list');
      const resourcesList = document.getElementById('resources-list');
      const mediaModal = document.getElementById('media-modal');
      const newLessonModal = document.getElementById('new-lesson-modal');
      const newExerciseModal = document.getElementById('new-exercise-modal');
      const newDiscussionModal = document.getElementById('new-discussion-modal');
      const editLessonModal = document.getElementById('edit-lesson-modal');
      const confirmDialog = document.getElementById('confirm-dialog');
      
      // State variables
      let currentUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Guest' };
      let itemToDelete = null;
      let deleteType = null;
      let replyingTo = null;
      
      // Initialize
      setupEventListeners();
      renderLessons();
      renderExercises();
      renderDiscussions();
      renderResources();
      
      // Event Listeners
      function setupEventListeners() {
        // Tab Navigation
        tabBtns.forEach(btn => {
          btn.addEventListener('click', function() {
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
          });
        });
        
        // New Lesson Button
        document.getElementById('new-lesson-btn').addEventListener('click', function() {
          newLessonModal.classList.add('active');
        });
        
        // New Exercise Button
        document.getElementById('new-exercise-btn').addEventListener('click', function() {
          newExerciseModal.classList.add('active');
        });
        
        // New Discussion Button
        document.getElementById('new-discussion-btn').addEventListener('click', function() {
          newDiscussionModal.classList.add('active');
        });
        
        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
              modal.classList.remove('active');
            });
          });
        });
        
        // Lesson Form
        document.getElementById('lesson-form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form data
          const title = document.getElementById('lesson-title').value;
          const description = document.getElementById('lesson-description').value;
          const thumbnailFile = document.getElementById('lesson-thumbnail').files[0];
          const files = Array.from(document.getElementById('lesson-files').files).map(file => ({
            type: getFileType(file.type),
            name: file.name,
            url: URL.createObjectURL(file),
            isNew: true
          }));
          
          // Create thumbnail URL if available
          let thumbnailUrl = '';
          if (thumbnailFile) {
            thumbnailUrl = URL.createObjectURL(thumbnailFile);
          } else {
            // Default thumbnail if none provided
            thumbnailUrl = 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
          }
          
          // Create new lesson
          const newLesson = {
            id: Date.now(),
            title,
            description,
            thumbnail: thumbnailUrl,
            resources: files,
            author: currentUser.username,
            date: new Date(),
            lastUpdated: new Date(),
            likes: 0,
            comments: [],
            showComments: true
          };
          
          // Add to store and render
          contentStore.lessons.unshift(newLesson);
          renderLessons();
          renderResources();
          
          // Reset form and close modal
          this.reset();
          newLessonModal.classList.remove('active');
          
          // Show success message
          alert('Lesson created successfully!');
        });
        
        // Exercise Form
        document.getElementById('exercise-form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form data
          const title = document.getElementById('exercise-title').value;
          const description = document.getElementById('exercise-description').value;
          const difficulty = document.getElementById('exercise-difficulty').value;
          const files = Array.from(document.getElementById('exercise-files').files).map(file => ({
            type: getFileType(file.type),
            name: file.name,
            url: URL.createObjectURL(file),
            isNew: true
          }));
          
          // Create new exercise
          const newExercise = {
            id: Date.now(),
            title,
            description,
            difficulty,
            resources: files,
            author: currentUser.username,
            date: new Date(),
            completed: false
          };
          
          // Add to store and render
          contentStore.exercises.unshift(newExercise);
          renderExercises();
          renderResources();
          
          // Reset form and close modal
          this.reset();
          newExerciseModal.classList.remove('active');
          
          // Show success message
          alert('Exercise created successfully!');
        });
        
        // Discussion Form
        document.getElementById('discussion-form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form data
          const title = document.getElementById('discussion-title').value;
          const content = document.getElementById('discussion-content').value;
          const tags = document.getElementById('discussion-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
          
          // Create new discussion
          const newDiscussion = {
            id: Date.now(),
            title,
            content,
            tags,
            author: currentUser.username,
            date: new Date(),
            replies: [],
            views: 0,
            likes: 0
          };
          
          // Add to store and render
          contentStore.discussions.unshift(newDiscussion);
          renderDiscussions();
          
          // Reset form and close modal
          this.reset();
          newDiscussionModal.classList.remove('active');
          
          // Show success message
          alert('Discussion posted successfully!');
        });
        
        // Cancel buttons
        document.getElementById('cancel-lesson').addEventListener('click', function() {
          newLessonModal.classList.remove('active');
        });
        
        document.getElementById('cancel-exercise').addEventListener('click', function() {
          newExerciseModal.classList.remove('active');
        });
        
        document.getElementById('cancel-discussion').addEventListener('click', function() {
          newDiscussionModal.classList.remove('active');
        });
        
        // Media item click
        document.addEventListener('click', function(e) {
          // Media item click
          if (e.target.closest('.media-item')) {
            e.preventDefault();
            const mediaItem = e.target.closest('.media-item');
            const url = mediaItem.getAttribute('data-url');
            const type = mediaItem.getAttribute('data-type');
            showMediaModal(url, type);
          }
          
          // Edit lesson button
          if (e.target.closest('.edit-btn')) {
            e.preventDefault();
            const lessonId = parseInt(e.target.closest('.content-card').getAttribute('data-id'));
            openEditLessonModal(lessonId);
          }
          
          // Delete lesson button
          if (e.target.closest('.delete-btn')) {
            e.preventDefault();
            const lessonId = parseInt(e.target.closest('.content-card').getAttribute('data-id'));
            showConfirmDialog('Are you sure you want to delete this lesson?', lessonId, 'lesson');
          }
          
          // Edit comment button
          if (e.target.classList.contains('comment-edit')) {
            e.preventDefault();
            const commentId = parseInt(e.target.closest('.comment-item').getAttribute('data-comment-id'));
            const lessonId = parseInt(e.target.closest('.content-card').getAttribute('data-id'));
            editComment(lessonId, commentId);
          }
          
          // Delete comment button
          if (e.target.classList.contains('comment-delete')) {
            e.preventDefault();
            const commentId = parseInt(e.target.closest('.comment-item').getAttribute('data-comment-id'));
            const lessonId = parseInt(e.target.closest('.content-card').getAttribute('data-id'));
            showConfirmDialog('Are you sure you want to delete this comment?', {lessonId, commentId}, 'comment');
          }
          
          // Reply to comment button
          if (e.target.classList.contains('comment-reply')) {
            e.preventDefault();
            const commentId = parseInt(e.target.closest('.comment-item').getAttribute('data-comment-id'));
            const lessonId = parseInt(e.target.closest('.content-card').getAttribute('data-id'));
            
            // Hide any other reply forms
            document.querySelectorAll('.reply-form').forEach(form => {
              form.style.display = 'none';
            });
            
            // Show reply form for this comment
            const replyForm = e.target.closest('.comment-item').querySelector('.reply-form');
            replyForm.style.display = 'flex';
            replyForm.querySelector('input').focus();
            
            // Set replyingTo state
            replyingTo = { lessonId, commentId };
          }
          
          // Submit reply
          if (e.target.classList.contains('reply-submit')) {
            e.preventDefault();
            const input = e.target.previousElementSibling;
            const replyText = input.value.trim();
            
            if (replyText && replyingTo) {
              const { lessonId, commentId } = replyingTo;
              const lesson = contentStore.lessons.find(l => l.id === lessonId);
              
              if (lesson) {
                const comment = lesson.comments.find(c => c.id === commentId);
                
                if (comment) {
                  if (!comment.replies) comment.replies = [];
                  
                  const newReply = {
                    id: Date.now(),
                    author: currentUser.username,
                    content: replyText,
                    date: new Date(),
                    isNew: true
                  };
                  
                  comment.replies.push(newReply);
                  renderLessons();
                  input.value = '';
                  replyingTo = null;
                }
              }
            }
          }
          
          // View replies toggle
          if (e.target.classList.contains('view-replies')) {
            e.preventDefault();
            const repliesList = e.target.nextElementSibling;
            repliesList.style.display = repliesList.style.display === 'none' ? 'block' : 'none';
            e.target.textContent = repliesList.style.display === 'none' ? 
              'View replies' : 'Hide replies';
          }
          
          // Toggle comments visibility
          if (e.target.classList.contains('toggle-comments') || e.target.closest('.toggle-comments')) {
            e.preventDefault();
            const button = e.target.classList.contains('toggle-comments') ? 
              e.target : e.target.closest('.toggle-comments');
            const lessonId = parseInt(button.closest('.content-card').getAttribute('data-id'));
            const lesson = contentStore.lessons.find(l => l.id === lessonId);
            
            if (lesson) {
              lesson.showComments = !lesson.showComments;
              renderLessons();
            }
          }
          
          // Comment submission
          if (e.target.classList.contains('comment-submit')) {
            e.preventDefault();
            const input = e.target.previousElementSibling;
            const commentText = input.value.trim();
            const lessonId = parseInt(e.target.closest('.content-card').getAttribute('data-id'));
            
            if (commentText) {
              const lesson = contentStore.lessons.find(l => l.id === lessonId);
              if (lesson) {
                const newComment = {
                  id: Date.now(),
                  author: currentUser.username,
                  content: commentText,
                  date: new Date(),
                  isNew: true,
                  replies: []
                };
                
                if (!lesson.comments) lesson.comments = [];
                lesson.comments.push(newComment);
                renderLessons();
                input.value = '';
              }
            }
          }
          
          // Discussion reply submission
          if (e.target.classList.contains('discussion-reply-submit')) {
            e.preventDefault();
            const input = e.target.previousElementSibling;
            const replyText = input.value.trim();
            const discussionId = parseInt(e.target.closest('.discussion-card').getAttribute('data-id'));
            
            if (replyText) {
              const discussion = contentStore.discussions.find(d => d.id === discussionId);
              if (discussion) {
                const newReply = {
                  id: Date.now(),
                  author: currentUser.username,
                  content: replyText,
                  date: new Date(),
                  isNew: true
                };
                
                if (!discussion.replies) discussion.replies = [];
                discussion.replies.push(newReply);
                renderDiscussions();
                input.value = '';
              }
            }
          }
          
          // Toggle exercise completion
          if (e.target.classList.contains('toggle-exercise')) {
            e.preventDefault();
            const exerciseId = parseInt(e.target.closest('.exercise-card').getAttribute('data-id'));
            const exercise = contentStore.exercises.find(ex => ex.id === exerciseId);
            
            if (exercise) {
              exercise.completed = !exercise.completed;
              renderExercises();
            }
          }
        });
        
        // Edit lesson form submission
        document.getElementById('edit-lesson-form').addEventListener('submit', function(e) {
          e.preventDefault();
          const lessonId = parseInt(document.getElementById('edit-lesson-id').value);
          const title = document.getElementById('edit-lesson-title').value;
          const description = document.getElementById('edit-lesson-description').value;
          const thumbnailFile = document.getElementById('edit-lesson-thumbnail').files[0];
          const newFiles = Array.from(document.getElementById('edit-lesson-files').files);
          
          const lesson = contentStore.lessons.find(l => l.id === lessonId);
          if (lesson) {
            // Update basic info
            lesson.title = title;
            lesson.description = description;
            lesson.lastUpdated = new Date();
            
            // Update thumbnail if changed
            if (thumbnailFile) {
              lesson.thumbnail = URL.createObjectURL(thumbnailFile);
            }
            
            // Add new resources
            if (newFiles.length > 0) {
              newFiles.forEach(file => {
                lesson.resources.push({
                  type: getFileType(file.type),
                  name: file.name,
                  url: URL.createObjectURL(file),
                  isNew: true
                });
              });
            }
            
            // Mark as updated by current user
            lesson.updatedBy = currentUser.username;
            
            renderLessons();
            renderResources();
            editLessonModal.classList.remove('active');
          }
        });
        
        // Cancel edit
        document.getElementById('cancel-edit').addEventListener('click', function() {
          editLessonModal.classList.remove('active');
        });
        
        // Confirmation dialog
        document.getElementById('dialog-cancel').addEventListener('click', function() {
          confirmDialog.classList.remove('active');
        });
        
        document.getElementById('dialog-confirm').addEventListener('click', function() {
          if (deleteType === 'lesson') {
            deleteLesson(itemToDelete);
          } else if (deleteType === 'comment') {
            deleteComment(itemToDelete.lessonId, itemToDelete.commentId);
          } else if (deleteType === 'exercise') {
            deleteExercise(itemToDelete);
          } else if (deleteType === 'discussion') {
            deleteDiscussion(itemToDelete);
          }
          confirmDialog.classList.remove('active');
        });
        
        // User greeting
        const greeting = document.getElementById('user-greeting');
        
        if (currentUser.username !== 'Guest') {
          greeting.innerHTML = `<i class="fas fa-user"></i> ${currentUser.username}`;
        } else {
          document.getElementById('logout-btn').style.display = 'none';
        }
        
        // Logout
        document.getElementById('logout-btn').addEventListener('click', function() {
          localStorage.removeItem('currentUser');
          window.location.href = '../../index.html';
        });
      }
      
      // Enhanced Render Functions
      function renderLessons() {
        if (contentStore.lessons.length === 0) {
          lessonsList.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-book-open"></i>
              <h3>No Lessons Yet</h3>
              <p>Get started by creating your first lesson</p>
            </div>
          `;
          return;
        }
        
        lessonsList.innerHTML = contentStore.lessons.map(lesson => `
          <div class="content-card" data-id="${lesson.id}">
            <!-- Edit/Delete Controls (only show for author or admin) -->
            ${lesson.author === currentUser.username ? `
              <div class="edit-controls">
                <div class="edit-btn" title="Edit Lesson">
                  <i class="fas fa-edit"></i>
                </div>
                <div class="delete-btn" title="Delete Lesson">
                  <i class="fas fa-trash"></i>
                </div>
              </div>
            ` : ''}
            
            <h3>${lesson.title}</h3>
            
            ${lesson.thumbnail ? `
              <img src="${lesson.thumbnail}" class="lesson-thumbnail" alt="${lesson.title}">
            ` : ''}
            
            <div class="lesson-description collapsed">
              <p>${lesson.description}</p>
            </div>
            <a href="#" class="toggle-description">Read More</a>
            
            <!-- Media Viewer -->
            <div class="media-viewer">
              ${lesson.resources.map(resource => `
                <div class="media-item" data-url="${resource.url}" data-type="${resource.type}">
                  <div class="media-preview">
                    ${resource.type === 'image' ? `
                      <img src="${resource.url}" alt="${resource.name}">
                    ` : `
                      <div class="file-preview">
                        <i class="fas fa-${getFileIcon(resource.type)}"></i>
                        <span>${resource.type.toUpperCase()}</span>
                      </div>
                    `}
                  </div>
                  <div class="media-info">
                    <div class="media-name">${resource.name}</div>
                    <div class="media-type">${resource.type}</div>
                  </div>
                  ${resource.isNew ? `<span class="badge-new">NEW</span>` : ''}
                </div>
              `).join('')}
            </div>
            
            <div class="lesson-meta">
              <small>
                Posted by ${lesson.author} • ${formatDate(lesson.date)}
                ${lesson.lastUpdated ? `• Updated ${formatDate(lesson.lastUpdated)}` : ''}
              </small>
              <div class="lesson-actions">
                <span class="like-count">
                  <i class="fas fa-thumbs-up"></i> ${lesson.likes}
                </span>
                <span class="comment-count">
                  <i class="fas fa-comment"></i> ${lesson.comments ? lesson.comments.length : 0}
                </span>
              </div>
            </div>
            
            <!-- Toggle Comments Button -->
            <button class="toggle-comments">
              <i class="fas fa-comments"></i>
              ${lesson.showComments ? 'Hide Comments' : 'Show Comments'}
            </button>
            
            <!-- Comments Section -->
            <div class="comments-container ${lesson.showComments ? 'visible' : 'hidden'}">
              ${lesson.comments && lesson.comments.length > 0 ? `
                <div class="comment-list">
                  ${lesson.comments.map(comment => `
                    <div class="comment-item" data-comment-id="${comment.id}">
                      <div class="comment-avatar">${comment.author.charAt(0)}</div>
                      <div class="comment-content">
                        <div class="comment-author">
                          ${comment.author}
                          ${comment.isNew ? `<span class="badge badge-primary" style="margin-left: 5px;">New</span>` : ''}
                        </div>
                        <p>${comment.content}</p>
                        <div class="comment-date">${formatDate(comment.date)}</div>
                        
                        <!-- Replies Section -->
                        ${comment.replies && comment.replies.length > 0 ? `
                          <a href="#" class="view-replies">View replies (${comment.replies.length})</a>
                          <div class="replies-list" style="display:none;">
                            ${comment.replies.map(reply => `
                              <div class="comment-item" data-comment-id="${reply.id}">
                                <div class="comment-avatar">${reply.author.charAt(0)}</div>
                                <div class="comment-content">
                                  <div class="comment-author">
                                    ${reply.author}
                                    ${reply.isNew ? `<span class="badge badge-primary" style="margin-left: 5px;">New</span>` : ''}
                                  </div>
                                  <p>${reply.content}</p>
                                  <div class="comment-date">${formatDate(reply.date)}</div>
                                </div>
                                ${reply.author === currentUser.username ? `
                                  <div class="comment-controls">
                                    <span class="comment-edit"><i class="fas fa-edit"></i></span>
                                    <span class="comment-delete"><i class="fas fa-trash"></i></span>
                                  </div>
                                ` : ''}
                              </div>
                            `).join('')}
                          </div>
                        ` : ''}
                      </div>
                      <div class="comment-controls">
                        <span class="comment-reply"><i class="fas fa-reply"></i></span>
                        ${comment.author === currentUser.username ? `
                          <span class="comment-edit"><i class="fas fa-edit"></i></span>
                          <span class="comment-delete"><i class="fas fa-trash"></i></span>
                        ` : ''}
                      </div>
                      
                      <!-- Reply Form -->
                      <form class="reply-form">
                        <input type="text" class="comment-input" placeholder="Write a reply...">
                        <button type="submit" class="reply-submit">Reply</button>
                      </form>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <p class="text-muted">No comments yet. Be the first to comment!</p>
              `}
              
              <form class="comment-form">
                <input type="text" class="comment-input" placeholder="Add a comment...">
                <button type="submit" class="comment-submit">Post</button>
              </form>
            </div>
          </div>
        `).join('');
        
        // Add event listeners for description toggles
        document.querySelectorAll('.toggle-description').forEach(toggle => {
          toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const description = this.previousElementSibling;
            description.classList.toggle('expanded');
            this.textContent = description.classList.contains('expanded') ? 'Show Less' : 'Read More';
          });
        });
      }
      
      function renderExercises() {
        if (contentStore.exercises.length === 0) {
          exercisesList.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-running"></i>
              <h3>No Exercises Yet</h3>
              <p>Create your first exercise to get started</p>
            </div>
          `;
          return;
        }
        
        exercisesList.innerHTML = contentStore.exercises.map(exercise => `
          <div class="exercise-card" data-id="${exercise.id}">
            <!-- Edit/Delete Controls (only show for author or admin) -->
            ${exercise.author === currentUser.username ? `
              <div class="edit-controls">
                <div class="edit-btn" title="Edit Exercise">
                  <i class="fas fa-edit"></i>
                </div>
                <div class="delete-btn" title="Delete Exercise">
                  <i class="fas fa-trash"></i>
                </div>
              </div>
            ` : ''}
            
            <h3>${exercise.title}</h3>
            <span class="exercise-difficulty difficulty-${exercise.difficulty}">
              ${exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </span>
            
            <p>${exercise.description}</p>
            
            ${exercise.resources.length > 0 ? `
              <div class="media-viewer">
                ${exercise.resources.map(resource => `
                  <div class="media-item" data-url="${resource.url}" data-type="${resource.type}">
                    <div class="media-preview">
                      ${resource.type === 'image' ? `
                        <img src="${resource.url}" alt="${resource.name}">
                      ` : `
                        <div class="file-preview">
                          <i class="fas fa-${getFileIcon(resource.type)}"></i>
                          <span>${resource.type.toUpperCase()}</span>
                        </div>
                      `}
                    </div>
                    <div class="media-info">
                      <div class="media-name">${resource.name}</div>
                      <div class="media-type">${resource.type}</div>
                    </div>
                    ${resource.isNew ? `<span class="badge-new">NEW</span>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <div class="exercise-meta">
              <small>
                Posted by ${exercise.author} • ${formatDate(exercise.date)}
              </small>
              <div class="lesson-actions">
                <button class="toggle-exercise btn btn-sm ${exercise.completed ? 'btn-success' : 'btn-outline-secondary'}">
                  <i class="fas fa-${exercise.completed ? 'check-circle' : 'circle'}"></i>
                  ${exercise.completed ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          </div>
        `).join('');
      }
      
      function renderDiscussions() {
        if (contentStore.discussions.length === 0) {
          discussionsList.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-comments"></i>
              <h3>No Discussions Yet</h3>
              <p>Start the first discussion in the community</p>
            </div>
          `;
          return;
        }
        
        discussionsList.innerHTML = contentStore.discussions.map(discussion => `
          <div class="discussion-card" data-id="${discussion.id}">
            <!-- Edit/Delete Controls (only show for author or admin) -->
            ${discussion.author === currentUser.username ? `
              <div class="edit-controls">
                <div class="edit-btn" title="Edit Discussion">
                  <i class="fas fa-edit"></i>
                </div>
                <div class="delete-btn" title="Delete Discussion">
                  <i class="fas fa-trash"></i>
                </div>
              </div>
            ` : ''}
            
            <h3>${discussion.title}</h3>
            
            ${discussion.tags.length > 0 ? `
              <div class="discussion-tags">
                ${discussion.tags.map(tag => `
                  <span class="discussion-tag">${tag}</span>
                `).join('')}
              </div>
            ` : ''}
            
            <p>${discussion.content}</p>
            
            <div class="discussion-stats">
              <div class="discussion-stat">
                <i class="fas fa-user"></i> ${discussion.author}
              </div>
              <div class="discussion-stat">
                <i class="fas fa-calendar"></i> ${formatDate(discussion.date)}
              </div>
              <div class="discussion-stat">
                <i class="fas fa-eye"></i> ${discussion.views} views
              </div>
              <div class="discussion-stat">
                <i class="fas fa-thumbs-up"></i> ${discussion.likes} likes
              </div>
              <div class="discussion-stat">
                <i class="fas fa-comment"></i> ${discussion.replies.length} replies
              </div>
            </div>
            
            ${discussion.replies.length > 0 ? `
              <div class="replies-list">
                <h5>Replies:</h5>
                ${discussion.replies.map(reply => `
                  <div class="comment-item" data-comment-id="${reply.id}">
                    <div class="comment-avatar">${reply.author.charAt(0)}</div>
                    <div class="comment-content">
                      <div class="comment-author">
                        ${reply.author}
                        ${reply.isNew ? `<span class="badge badge-primary" style="margin-left: 5px;">New</span>` : ''}
                      </div>
                      <p>${reply.content}</p>
                      <div class="comment-date">${formatDate(reply.date)}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <form class="comment-form" style="margin-top: 1rem;">
              <input type="text" class="comment-input" placeholder="Add a reply...">
              <button type="submit" class="discussion-reply-submit">Post Reply</button>
            </form>
          </div>
        `).join('');
      }
      
      function renderResources() {
        // Collect all resources from all lessons and exercises
        const allResources = [];
        
        contentStore.lessons.forEach(lesson => {
          lesson.resources.forEach(resource => {
            allResources.push({
              ...resource,
              source: 'Lesson: ' + lesson.title,
              sourceId: lesson.id
            });
          });
        });
        
        contentStore.exercises.forEach(exercise => {
          exercise.resources.forEach(resource => {
            allResources.push({
              ...resource,
              source: 'Exercise: ' + exercise.title,
              sourceId: exercise.id
            });
          });
        });
        
        if (allResources.length === 0) {
          resourcesList.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-folder-open"></i>
              <h3>No Resources Yet</h3>
              <p>Resources will appear here when you create lessons or exercises with materials</p>
            </div>
          `;
          return;
        }
        
        resourcesList.innerHTML = `
          <div class="resource-list">
            ${allResources.map(resource => `
              <div class="resource-item">
                <i class="fas fa-${getFileIcon(resource.type)} resource-icon ${resource.type}"></i>
                <div style="flex-grow: 1;">
                  <div>${resource.name}</div>
                  <small class="text-muted">From: ${resource.source}</small>
                </div>
                ${resource.type === 'video' || resource.type === 'audio' ? `
                  <a href="#" class="play-media" data-url="${resource.url}" data-type="${resource.type}">
                    <i class="fas fa-play"></i> Play
                  </a>
                ` : ''}
                <a href="${resource.url}" download class="ml-2">
                  <i class="fas fa-download"></i>
                </a>
              </div>
            `).join('')}
          </div>
        `;
      }
      
      // New Functions for Enhanced Features
      function openEditLessonModal(lessonId) {
        const lesson = contentStore.lessons.find(l => l.id === lessonId);
        if (lesson) {
          document.getElementById('edit-lesson-id').value = lesson.id;
          document.getElementById('edit-lesson-title').value = lesson.title;
          document.getElementById('edit-lesson-description').value = lesson.description;
          
          // Show current thumbnail
          const thumbnailImg = document.getElementById('current-thumbnail');
          thumbnailImg.src = lesson.thumbnail;
          thumbnailImg.style.display = lesson.thumbnail ? 'block' : 'none';
          
          // Show current resources
          const resourcesContainer = document.getElementById('current-resources');
          resourcesContainer.innerHTML = lesson.resources.map(resource => `
            <div class="resource-item">
              <i class="fas fa-${getFileIcon(resource.type)} resource-icon ${resource.type}"></i>
              <span>${resource.name}</span>
              <button class="btn btn-sm btn-outline-danger delete-resource" data-resource-name="${resource.name}">
                <i class="fas fa-times"></i>
              </button>
            </div>
          `).join('');
          
          // Add event listeners for resource deletion
          document.querySelectorAll('.delete-resource').forEach(btn => {
            btn.addEventListener('click', function(e) {
              e.preventDefault();
              const resourceName = this.getAttribute('data-resource-name');
              lesson.resources = lesson.resources.filter(r => r.name !== resourceName);
              resourcesContainer.innerHTML = lesson.resources.map(resource => `
                <div class="resource-item">
                  <i class="fas fa-${getFileIcon(resource.type)} resource-icon ${resource.type}"></i>
                  <span>${resource.name}</span>
                  <button class="btn btn-sm btn-outline-danger delete-resource" data-resource-name="${resource.name}">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              `).join('');
            });
          });
          
          editLessonModal.classList.add('active');
        }
      }
      
      function showConfirmDialog(message, item, type) {
        document.getElementById('dialog-message').textContent = message;
        itemToDelete = item;
        deleteType = type;
        confirmDialog.classList.add('active');
      }
      
      function deleteLesson(lessonId) {
        contentStore.lessons = contentStore.lessons.filter(l => l.id !== lessonId);
        renderLessons();
        renderResources();
      }
      
      function deleteExercise(exerciseId) {
        contentStore.exercises = contentStore.exercises.filter(ex => ex.id !== exerciseId);
        renderExercises();
        renderResources();
      }
      
      function deleteDiscussion(discussionId) {
        contentStore.discussions = contentStore.discussions.filter(d => d.id !== discussionId);
        renderDiscussions();
      }
      
      function editComment(lessonId, commentId) {
        const lesson = contentStore.lessons.find(l => l.id === lessonId);
        if (lesson) {
          // Check if it's a main comment or reply
          let comment = lesson.comments.find(c => c.id === commentId);
          let isReply = false;
          
          if (!comment) {
            // If not found in main comments, check replies
            for (const mainComment of lesson.comments) {
              if (mainComment.replies) {
                const reply = mainComment.replies.find(r => r.id === commentId);
                if (reply) {
                  comment = reply;
                  isReply = true;
                  break;
                }
              }
            }
          }
          
          if (comment) {
            const newContent = prompt('Edit your comment:', comment.content);
            if (newContent !== null && newContent.trim() !== '') {
              comment.content = newContent.trim();
              comment.date = new Date();
              renderLessons();
            }
          }
        }
      }
      
      function deleteComment(lessonId, commentId) {
        const lesson = contentStore.lessons.find(l => l.id === lessonId);
        if (lesson) {
          // First try to find in main comments
          const commentIndex = lesson.comments.findIndex(c => c.id === commentId);
          
          if (commentIndex !== -1) {
            // It's a main comment
            lesson.comments.splice(commentIndex, 1);
          } else {
            // If not found, check replies
            for (const mainComment of lesson.comments) {
              if (mainComment.replies) {
                const replyIndex = mainComment.replies.findIndex(r => r.id === commentId);
                if (replyIndex !== -1) {
                  mainComment.replies.splice(replyIndex, 1);
                  break;
                }
              }
            }
          }
          
          renderLessons();
        }
      }
      
      function showMediaModal(url, type) {
        const mediaPlayer = document.getElementById('media-player');
        
        if (type === 'video') {
          mediaPlayer.innerHTML = `
            <video controls autoplay style="width:100%">
              <source src="${url}" type="video/mp4">
              Your browser doesn't support HTML5 video
            </video>
          `;
        } else if (type === 'audio') {
          mediaPlayer.innerHTML = `
            <audio controls autoplay style="width:100%">
              <source src="${url}" type="audio/mpeg">
              Your browser doesn't support HTML5 audio
            </audio>
          `;
        } else if (type === 'image') {
          mediaPlayer.innerHTML = `
            <img src="${url}" style="max-width:100%; max-height:80vh; display:block; margin:0 auto;">
          `;
        } else {
          mediaPlayer.innerHTML = `
            <div class="text-center p-4">
              <i class="fas fa-file-alt fa-5x mb-3"></i>
              <h4>This file type cannot be previewed</h4>
              <a href="${url}" download class="btn btn-primary mt-3">
                <i class="fas fa-download"></i> Download File
              </a>
            </div>
          `;
        }
        
        mediaModal.classList.add('active');
      }
      
      // Helper Functions
      function getFileType(mimeType) {
        if (mimeType.includes('image')) return 'image';
        if (mimeType.includes('video')) return 'video';
        if (mimeType.includes('audio')) return 'audio';
        if (mimeType.includes('pdf')) return 'pdf';
        return 'file';
      }
      
      function getFileIcon(type) {
        const icons = {
          pdf: 'file-pdf',
          video: 'video',
          audio: 'file-audio',
          image: 'file-image'
        };
        return icons[type] || 'file';
      }
      
      function formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
      }
    });