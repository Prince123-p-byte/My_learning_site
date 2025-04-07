document.addEventListener('DOMContentLoaded', function() {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Guest', role: 'student' };
    
    // Lighten color function
    function lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }

    // Get subject from URL
    const urlParams = new URLSearchParams(window.location.search);
    const subjectId = urlParams.get('subject');
    let currentSubject;
    
    // Load subject data
    if (['math', 'science', 'english'].includes(subjectId)) {
        const defaultSubjects = {
            math: {
                id: 'math',
                name: 'Math',
                description: 'Explore numbers, shapes, and basic arithmetic',
                icon: 'fas fa-calculator',
                color: '#4361ee'
            },
            science: {
                id: 'science',
                name: 'Science',
                description: 'Discover nature, animals, and simple experiments',
                icon: 'fas fa-flask',
                color: '#20c997'
            },
            english: {
                id: 'english',
                name: 'English',
                description: 'Learn letters, words, and basic reading skills',
                icon: 'fas fa-book-open',
                color: '#f72585'
            }
        };
        currentSubject = defaultSubjects[subjectId];
    } else {
        const customSubjects = JSON.parse(localStorage.getItem('customSubjects')) || [];
        currentSubject = customSubjects.find(s => s.id == subjectId);
        
        if (!currentSubject) {
            window.location.href = '../levels/early-childhood.html';
            return;
        }
    }
    
    // Apply subject theming
    document.documentElement.style.setProperty('--primary-color', currentSubject.color);
    document.documentElement.style.setProperty('--primary-light', lightenColor(currentSubject.color, 20));
    
    // Update page with subject data
    document.title = `${currentSubject.name} | Learning App`;
    document.getElementById('subject-title').textContent = currentSubject.name;
    document.getElementById('subject-description').textContent = currentSubject.description;
    document.getElementById('subject-name').textContent = currentSubject.name;
    document.getElementById('subject-icon').className = currentSubject.icon;
    document.getElementById('current-subject-link').href = `subject-viewer.html?subject=${subjectId}`;
    
    // User greeting
    const greeting = document.getElementById('user-greeting');
    if (currentUser.username !== 'Guest') {
        greeting.innerHTML = `<i class="fas fa-user"></i> ${currentUser.username}`;
    } else {
        document.getElementById('logout-btn').style.display = 'none';
    }
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    });
    
    // Initialize content management
    const contentStore = {
        lessons: JSON.parse(localStorage.getItem(`subject_${subjectId}_lessons`)) || [],
        exercises: JSON.parse(localStorage.getItem(`subject_${subjectId}_exercises`)) || [],
        discussions: JSON.parse(localStorage.getItem(`subject_${subjectId}_discussions`)) || [],
        submissions: JSON.parse(localStorage.getItem(`subject_${subjectId}_submissions`)) || [],
        grades: JSON.parse(localStorage.getItem(`subject_${subjectId}_grades`)) || []
    };
    
    // DOM Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const lessonsList = document.getElementById('lessons-list');
    const exercisesList = document.getElementById('exercises-list');
    const discussionsList = document.getElementById('discussions-list');
    const resourcesList = document.getElementById('resources-list');
    const resultsList = document.getElementById('results-list');
    
    // Modal elements
    const newLessonModal = document.getElementById('new-lesson-modal');
    const newExerciseModal = document.getElementById('new-exercise-modal');
    const newDiscussionModal = document.getElementById('new-discussion-modal');
    const editLessonModal = document.getElementById('edit-lesson-modal');
    const mediaModal = document.getElementById('media-modal');
    const submissionModal = document.getElementById('submission-modal');
    const gradeModal = document.getElementById('grade-modal');
    const viewSubmissionModal = document.getElementById('view-submission-modal');
    const confirmDialog = document.getElementById('confirm-dialog');
    
    // State variables
    let itemToDelete = null;
    let deleteType = null;
    let replyingTo = null;
    let currentExerciseId = null;
    
    // Render initial content
    renderLessons();
    renderExercises();
    renderDiscussions();
    renderResources();
    renderResults();
    
    // Tab Navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
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
    
    document.getElementById('cancel-edit').addEventListener('click', function() {
        editLessonModal.classList.remove('active');
    });
    
    document.getElementById('cancel-submission').addEventListener('click', function() {
        submissionModal.classList.remove('active');
    });
    
    document.getElementById('cancel-grade').addEventListener('click', function() {
        gradeModal.classList.remove('active');
    });
    
    document.getElementById('close-view-submission').addEventListener('click', function() {
        viewSubmissionModal.classList.remove('active');
    });
    
    // Confirmation dialog
    document.getElementById('dialog-cancel').addEventListener('click', function() {
        confirmDialog.classList.remove('active');
    });
    
    document.getElementById('dialog-confirm').addEventListener('click', function() {
        if (deleteType === 'lesson') {
            deleteLesson(itemToDelete);
        } else if (deleteType === 'exercise') {
            deleteExercise(itemToDelete);
        } else if (deleteType === 'discussion') {
            deleteDiscussion(itemToDelete);
        } else if (deleteType === 'comment') {
            deleteComment(itemToDelete.lessonId, itemToDelete.commentId);
        } else if (deleteType === 'submission') {
            deleteSubmission(itemToDelete);
        }
        confirmDialog.classList.remove('active');
    });
    
    // Form submissions
    document.getElementById('lesson-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('lesson-title').value;
        const description = document.getElementById('lesson-description').value;
        const thumbnailFile = document.getElementById('lesson-thumbnail').files[0];
        const files = Array.from(document.getElementById('lesson-files').files);
        
        let thumbnailUrl = '';
        if (thumbnailFile) {
            thumbnailUrl = URL.createObjectURL(thumbnailFile);
        } else {
            thumbnailUrl = 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
        }
        
        const newLesson = {
            id: Date.now(),
            title,
            description,
            thumbnail: thumbnailUrl,
            author: currentUser.username || 'Guest',
            date: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            resources: files.map(file => ({
                name: file.name,
                type: getFileType(file.type),
                url: URL.createObjectURL(file),
                isNew: true
            })),
            likes: 0,
            comments: [],
            showComments: true
        };
        
        contentStore.lessons.unshift(newLesson);
        localStorage.setItem(`subject_${subjectId}_lessons`, JSON.stringify(contentStore.lessons));
        
        renderLessons();
        renderResources();
        newLessonModal.classList.remove('active');
        this.reset();
        showNotification('Lesson created successfully!');
    });
    
    document.getElementById('exercise-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('exercise-title').value;
        const description = document.getElementById('exercise-description').value;
        const difficulty = document.getElementById('exercise-difficulty').value;
        const files = Array.from(document.getElementById('exercise-files').files);
        
        const newExercise = {
            id: Date.now(),
            title,
            description,
            difficulty,
            author: currentUser.username || 'Guest',
            date: new Date().toISOString(),
            resources: files.map(file => ({
                name: file.name,
                type: getFileType(file.type),
                url: URL.createObjectURL(file),
                isNew: true
            })),
            completed: false
        };
        
        contentStore.exercises.unshift(newExercise);
        localStorage.setItem(`subject_${subjectId}_exercises`, JSON.stringify(contentStore.exercises));
        
        renderExercises();
        renderResources();
        newExerciseModal.classList.remove('active');
        this.reset();
        showNotification('Exercise created successfully!');
    });
    
    document.getElementById('discussion-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('discussion-title').value;
        const content = document.getElementById('discussion-content').value;
        const tags = document.getElementById('discussion-tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        
        const newDiscussion = {
            id: Date.now(),
            title,
            content,
            tags,
            author: currentUser.username || 'Guest',
            date: new Date().toISOString(),
            replies: [],
            views: 0,
            likes: 0
        };
        
        contentStore.discussions.unshift(newDiscussion);
        localStorage.setItem(`subject_${subjectId}_discussions`, JSON.stringify(contentStore.discussions));
        
        renderDiscussions();
        newDiscussionModal.classList.remove('active');
        this.reset();
        showNotification('Discussion posted successfully!');
    });
    
    document.getElementById('edit-lesson-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const lessonId = parseInt(document.getElementById('edit-lesson-id').value);
        const title = document.getElementById('edit-lesson-title').value;
        const description = document.getElementById('edit-lesson-description').value;
        const thumbnailFile = document.getElementById('edit-lesson-thumbnail').files[0];
        const newFiles = Array.from(document.getElementById('edit-lesson-files').files);
        
        const lesson = contentStore.lessons.find(l => l.id === lessonId);
        if (lesson) {
            lesson.title = title;
            lesson.description = description;
            lesson.lastUpdated = new Date().toISOString();
            
            if (thumbnailFile) {
                lesson.thumbnail = URL.createObjectURL(thumbnailFile);
            }
            
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
            
            localStorage.setItem(`subject_${subjectId}_lessons`, JSON.stringify(contentStore.lessons));
            
            renderLessons();
            renderResources();
            editLessonModal.classList.remove('active');
            showNotification('Lesson updated successfully!');
        }
    });
    
    document.getElementById('submission-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const exerciseId = parseInt(document.getElementById('submission-exercise-id').value);
        const files = Array.from(document.getElementById('submission-files').files);
        const notes = document.getElementById('submission-notes').value;
        
        const newSubmission = {
            id: Date.now(),
            exerciseId,
            userId: currentUser.username || 'Guest',
            date: new Date().toISOString(),
            files: files.map(file => ({
                name: file.name,
                type: getFileType(file.type),
                url: URL.createObjectURL(file)
            })),
            notes,
            status: 'submitted'
        };
        
        contentStore.submissions.push(newSubmission);
        localStorage.setItem(`subject_${subjectId}_submissions`, JSON.stringify(contentStore.submissions));
        
        const exercise = contentStore.exercises.find(ex => ex.id === exerciseId);
        if (exercise) {
            exercise.completed = true;
            localStorage.setItem(`subject_${subjectId}_exercises`, JSON.stringify(contentStore.exercises));
        }
        
        renderExercises();
        renderResults();
        submissionModal.classList.remove('active');
        this.reset();
        showNotification('Exercise submitted successfully!');
    });
    
    document.getElementById('grade-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const submissionId = parseInt(document.getElementById('grade-submission-id').value);
        const score = parseInt(document.getElementById('grade-score').value);
        const letter = document.getElementById('grade-letter').value;
        const feedback = document.getElementById('grade-feedback').value;
        const gradeFile = document.getElementById('grade-file').files[0];
        
        let gradeIndex = contentStore.grades.findIndex(g => g.submissionId === submissionId);
        let grade;
        
        if (gradeIndex !== -1) {
            grade = contentStore.grades[gradeIndex];
            grade.score = score;
            grade.letter = letter;
            grade.feedback = feedback;
            grade.date = new Date().toISOString();
            
            if (gradeFile) {
                grade.file = {
                    name: gradeFile.name,
                    type: getFileType(gradeFile.type),
                    url: URL.createObjectURL(gradeFile)
                };
            }
        } else {
            grade = {
                id: Date.now(),
                submissionId,
                grader: currentUser.username || 'Teacher',
                date: new Date().toISOString(),
                score,
                letter,
                feedback,
                file: gradeFile ? {
                    name: gradeFile.name,
                    type: getFileType(gradeFile.type),
                    url: URL.createObjectURL(gradeFile)
                } : null
            };
            contentStore.grades.push(grade);
        }
        
        const submission = contentStore.submissions.find(s => s.id === submissionId);
        if (submission) {
            submission.status = 'graded';
            localStorage.setItem(`subject_${subjectId}_submissions`, JSON.stringify(contentStore.submissions));
        }
        
        localStorage.setItem(`subject_${subjectId}_grades`, JSON.stringify(contentStore.grades));
        
        renderResults();
        gradeModal.classList.remove('active');
        this.reset();
        showNotification('Grade submitted successfully!');
    });
    
    // Event delegation for dynamic elements
    document.addEventListener('click', function(e) {
        // Media item click
        if (e.target.closest('.media-item') || e.target.closest('.play-media')) {
            e.preventDefault();
            let url, type;
            
            if (e.target.closest('.media-item')) {
                const mediaItem = e.target.closest('.media-item');
                url = mediaItem.getAttribute('data-url') || mediaItem.querySelector('a').getAttribute('href');
                type = mediaItem.getAttribute('data-type') || getFileTypeFromUrl(url);
            } else {
                const playBtn = e.target.closest('.play-media');
                url = playBtn.getAttribute('data-url');
                type = playBtn.getAttribute('data-type');
            }
            
            showMediaModal(url, type);
        }
        
        // Edit lesson button
        if (e.target.closest('.edit-btn')) {
            e.preventDefault();
            const card = e.target.closest('.content-card, .exercise-card, .discussion-card');
            const itemId = parseInt(card.getAttribute('data-id'));
            
            if (card.classList.contains('content-card')) {
                openEditLessonModal(itemId);
            }
        }
        
        // Delete button
        if (e.target.closest('.delete-btn')) {
            e.preventDefault();
            const card = e.target.closest('.content-card, .exercise-card, .discussion-card, .submission-card');
            const itemId = parseInt(card.getAttribute('data-id'));
            
            if (card.classList.contains('content-card')) {
                showConfirmDialog('Are you sure you want to delete this lesson?', itemId, 'lesson');
            } else if (card.classList.contains('exercise-card')) {
                showConfirmDialog('Are you sure you want to delete this exercise?', itemId, 'exercise');
            } else if (card.classList.contains('discussion-card')) {
                showConfirmDialog('Are you sure you want to delete this discussion?', itemId, 'discussion');
            } else if (card.classList.contains('submission-card')) {
                showConfirmDialog('Are you sure you want to delete this submission?', itemId, 'submission');
            }
        }
        
        // Submit exercise button
        if (e.target.closest('.submit-exercise')) {
            e.preventDefault();
            const exerciseId = parseInt(e.target.closest('.exercise-card').getAttribute('data-id'));
            document.getElementById('submission-exercise-id').value = exerciseId;
            submissionModal.classList.add('active');
        }
        
        // Grade submission button
        if (e.target.closest('.grade-submission') || e.target.closest('#grade-from-view')) {
            e.preventDefault();
            const submissionId = parseInt(e.target.closest('.grade-submission, #grade-from-view').getAttribute('data-id') || 
                                 e.target.closest('.grade-submission, #grade-from-view').parentElement.getAttribute('data-id'));
            document.getElementById('grade-submission-id').value = submissionId;
            gradeModal.classList.add('active');
            viewSubmissionModal.classList.remove('active');
        }
        
        // View submission button
        if (e.target.closest('.view-submission')) {
            e.preventDefault();
            const submissionId = parseInt(e.target.closest('.view-submission').getAttribute('data-id'));
            viewSubmission(submissionId);
        }
        
        // Edit grade button
        if (e.target.closest('.edit-grade') || e.target.closest('#edit-grade-btn')) {
            e.preventDefault();
            const submissionId = parseInt(e.target.closest('.edit-grade, #edit-grade-btn').getAttribute('data-id'));
            editGrade(submissionId);
            viewSubmissionModal.classList.remove('active');
        }
        
        // Toggle exercise completion
        if (e.target.closest('.toggle-exercise')) {
            e.preventDefault();
            const exerciseId = parseInt(e.target.closest('.exercise-card').getAttribute('data-id'));
            const exercise = contentStore.exercises.find(ex => ex.id === exerciseId);
            
            if (exercise) {
                exercise.completed = !exercise.completed;
                localStorage.setItem(`subject_${subjectId}_exercises`, JSON.stringify(contentStore.exercises));
                renderExercises();
            }
        }
        
        // Toggle comments visibility
        if (e.target.closest('.toggle-comments')) {
            e.preventDefault();
            const lessonId = parseInt(e.target.closest('.content-card').getAttribute('data-id'));
            const lesson = contentStore.lessons.find(l => l.id === lessonId);
            
            if (lesson) {
                lesson.showComments = !lesson.showComments;
                localStorage.setItem(`subject_${subjectId}_lessons`, JSON.stringify(contentStore.lessons));
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
                        author: currentUser.username || 'Guest',
                        content: commentText,
                        date: new Date().toISOString(),
                        isNew: true,
                        replies: []
                    };
                    
                    if (!lesson.comments) lesson.comments = [];
                    lesson.comments.push(newComment);
                    localStorage.setItem(`subject_${subjectId}_lessons`, JSON.stringify(contentStore.lessons));
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
                        author: currentUser.username || 'Guest',
                        content: replyText,
                        date: new Date().toISOString(),
                        isNew: true
                    };
                    
                    if (!discussion.replies) discussion.replies = [];
                    discussion.replies.push(newReply);
                    localStorage.setItem(`subject_${subjectId}_discussions`, JSON.stringify(contentStore.discussions));
                    renderDiscussions();
                    input.value = '';
                }
            }
        }
        
        // Reply to comment
        if (e.target.classList.contains('comment-reply')) {
            e.preventDefault();
            const commentId = parseInt(e.target.closest('.comment-item').getAttribute('data-comment-id'));
            const lessonId = parseInt(e.target.closest('.content-card').getAttribute('data-id'));
            
            document.querySelectorAll('.reply-form').forEach(form => {
                form.style.display = 'none';
            });
            
            const replyForm = e.target.closest('.comment-item').querySelector('.reply-form');
            replyForm.style.display = 'flex';
            replyForm.querySelector('input').focus();
            
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
                            author: currentUser.username || 'Guest',
                            content: replyText,
                            date: new Date().toISOString(),
                            isNew: true
                        };
                        
                        comment.replies.push(newReply);
                        localStorage.setItem(`subject_${subjectId}_lessons`, JSON.stringify(contentStore.lessons));
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
        
        // Edit comment
        if (e.target.classList.contains('comment-edit')) {
            e.preventDefault();
            const commentId = parseInt(e.target.closest('.comment-item').getAttribute('data-comment-id'));
            const lessonId = parseInt(e.target.closest('.content-card').getAttribute('data-id'));
            editComment(lessonId, commentId);
        }
        
        // Delete comment
        if (e.target.classList.contains('comment-delete')) {
            e.preventDefault();
            const commentId = parseInt(e.target.closest('.comment-item').getAttribute('data-comment-id'));
            const lessonId = parseInt(e.target.closest('.content-card').getAttribute('data-id'));
            showConfirmDialog('Are you sure you want to delete this comment?', {lessonId, commentId}, 'comment');
        }
        
        // Toggle description
        if (e.target.classList.contains('toggle-description')) {
            e.preventDefault();
            const description = e.target.previousElementSibling;
            description.classList.toggle('expanded');
            e.target.textContent = description.classList.contains('expanded') ? 'Show Less' : 'Read More';
        }
    });
    
    // Render Functions
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
                
                <button class="toggle-comments">
                    <i class="fas fa-comments"></i>
                    ${lesson.showComments ? 'Hide Comments' : 'Show Comments'}
                </button>
                
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
                
                ${exercise.resources && exercise.resources.length > 0 ? `
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
                        ${!exercise.completed ? `
                            <button class="submit-exercise btn btn-sm btn-primary">
                                <i class="fas fa-paper-plane"></i> Submit
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    // ... (previous code continues)

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
                
                ${discussion.tags && discussion.tags.length > 0 ? `
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
                        <i class="fas fa-eye"></i> ${discussion.views || 0} views
                    </div>
                    <div class="discussion-stat">
                        <i class="fas fa-thumbs-up"></i> ${discussion.likes || 0} likes
                    </div>
                    <div class="discussion-stat">
                        <i class="fas fa-comment"></i> ${discussion.replies ? discussion.replies.length : 0} replies
                    </div>
                </div>
                
                ${discussion.replies && discussion.replies.length > 0 ? `
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
        const allResources = [];
        
        contentStore.lessons.forEach(lesson => {
            if (lesson.resources) {
                lesson.resources.forEach(resource => {
                    allResources.push({
                        ...resource,
                        source: 'Lesson: ' + lesson.title,
                        sourceId: lesson.id
                    });
                });
            }
        });
        
        contentStore.exercises.forEach(exercise => {
            if (exercise.resources) {
                exercise.resources.forEach(resource => {
                    allResources.push({
                        ...resource,
                        source: 'Exercise: ' + exercise.title,
                        sourceId: exercise.id
                    });
                });
            }
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
    
    function renderResults() {
        const userSubmissions = contentStore.submissions.filter(
            sub => sub.userId === currentUser.username || (currentUser.username === 'Guest' && sub.userId === 'Guest')
        );

        if (userSubmissions.length === 0) {
            resultsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <h3>No Results Yet</h3>
                    <p>Submit exercises to see your results here</p>
                </div>
            `;
            return;
        }

        resultsList.innerHTML = `
            <div class="submissions-container">
                ${userSubmissions.map(submission => {
                    const exercise = contentStore.exercises.find(ex => ex.id === submission.exerciseId);
                    const grade = contentStore.grades.find(g => g.submissionId === submission.id);
                    
                    return `
                        <div class="submission-card" data-id="${submission.id}">
                            <div class="submission-header">
                                <h4>${exercise ? exercise.title : 'Unknown Exercise'}</h4>
                                <span class="submission-status ${
                                    submission.status === 'graded' ? 'badge-success' : 'badge-warning'
                                }">
                                    ${submission.status === 'graded' ? 'Graded' : 'Pending'}
                                </span>
                            </div>
                            
                            <div class="submission-meta">
                                <span><i class="fas fa-calendar-alt"></i> Submitted: ${formatDate(submission.date)}</span>
                                ${grade ? `<span class="ml-3"><i class="fas fa-star"></i> Grade: ${grade.score}/100 (${grade.letter})</span>` : ''}
                            </div>
                            
                            ${submission.notes ? `
                                <div class="submission-notes">
                                    <p><strong>Your Notes:</strong> ${submission.notes}</p>
                                </div>
                            ` : ''}
                            
                            ${submission.files.length > 0 ? `
                                <div class="submission-files">
                                    ${submission.files.map(file => `
                                        <div class="submission-file">
                                            <i class="fas fa-${getFileIcon(file.type)} mr-2"></i>
                                            <span>${file.name}</span>
                                            <a href="${file.url}" target="_blank" class="ml-2">
                                                <i class="fas fa-external-link-alt"></i>
                                            </a>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            ${grade ? `
                                <div class="grade-details mt-3">
                                    <h5>Feedback:</h5>
                                    <p>${grade.feedback}</p>
                                    
                                    ${grade.file ? `
                                        <div class="graded-file mt-2">
                                            <i class="fas fa-paperclip"></i>
                                            <a href="${grade.file.url}" target="_blank">${grade.file.name}</a>
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}
                            
                            <div class="submission-actions mt-3">
                                <button class="btn btn-sm btn-outline-primary view-submission" data-id="${submission.id}">
                                    <i class="fas fa-eye"></i> View Details
                                </button>
                                
                                ${submission.userId === currentUser.username ? `
                                    <button class="btn btn-sm btn-outline-secondary edit-submission ml-2" data-id="${submission.id}">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                ` : ''}
                                
                                ${currentUser.role === 'teacher' && !grade ? `
                                    <button class="btn btn-sm btn-primary grade-submission ml-2" data-id="${submission.id}">
                                        <i class="fas fa-graduation-cap"></i> Grade
                                    </button>
                                ` : ''}
                                
                                ${currentUser.role === 'teacher' && grade ? `
                                    <button class="btn btn-sm btn-info edit-grade ml-2" data-id="${submission.id}">
                                        <i class="fas fa-edit"></i> Update Grade
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Add event listeners for the new buttons
        document.querySelectorAll('.view-submission').forEach(btn => {
            btn.addEventListener('click', function() {
                const submissionId = parseInt(this.getAttribute('data-id'));
                viewSubmission(submissionId);
            });
        });

        document.querySelectorAll('.grade-submission').forEach(btn => {
            btn.addEventListener('click', function() {
                const submissionId = parseInt(this.getAttribute('data-id'));
                document.getElementById('grade-submission-id').value = submissionId;
                gradeModal.classList.add('active');
            });
        });

        document.querySelectorAll('.edit-grade').forEach(btn => {
            btn.addEventListener('click', function() {
                const submissionId = parseInt(this.getAttribute('data-id'));
                editGrade(submissionId);
            });
        });
    }

    function viewSubmission(submissionId) {
        const submission = contentStore.submissions.find(s => s.id === submissionId);
        if (!submission) return;

        const exercise = contentStore.exercises.find(ex => ex.id === submission.exerciseId);
        const grade = contentStore.grades.find(g => g.submissionId === submissionId);

        document.getElementById('view-submission-title').textContent = 
            `Submission for: ${exercise ? exercise.title : 'Unknown Exercise'}`;

        let content = `
            <div class="submission-details">
                <p><strong>Submitted on:</strong> ${formatDate(submission.date)}</p>
                
                ${submission.notes ? `
                    <div class="submission-notes">
                        <h5>Student Notes:</h5>
                        <p>${submission.notes}</p>
                    </div>
                ` : ''}
                
                ${submission.files.length > 0 ? `
                    <div class="submission-files">
                        <h5>Submitted Files:</h5>
                        <div class="file-list">
                            ${submission.files.map(file => `
                                <div class="file-item">
                                    <i class="fas fa-${getFileIcon(file.type)}"></i>
                                    <span>${file.name}</span>
                                    <a href="${file.url}" target="_blank" class="ml-2">
                                        <i class="fas fa-external-link-alt"></i> View
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        let gradeContent = '';
        if (grade) {
            gradeContent = `
                <div class="grade-details">
                    <h4>Grading Information</h4>
                    <div class="grade-summary">
                        <span class="grade-badge grade-${grade.letter}">${grade.letter} (${grade.score}/100)</span>
                        <span class="ml-3">Graded by: ${grade.grader}</span>
                        <span class="ml-3">on ${formatDate(grade.date)}</span>
                    </div>
                    
                    <div class="grade-feedback mt-3">
                        <h5>Feedback:</h5>
                        <p>${grade.feedback}</p>
                    </div>
                    
                    ${grade.file ? `
                        <div class="graded-file mt-3">
                            <h5>Graded File:</h5>
                            <a href="${grade.file.url}" target="_blank">
                                <i class="fas fa-download"></i> Download ${grade.file.name}
                            </a>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            gradeContent = `
                <div class="no-grade">
                    <p><i class="fas fa-info-circle"></i> This submission hasn't been graded yet.</p>
                    ${currentUser.role === 'teacher' ? `
                        <button class="btn btn-primary mt-2" id="grade-from-view" data-id="${submission.id}">
                            <i class="fas fa-graduation-cap"></i> Grade Now
                        </button>
                    ` : ''}
                </div>
            `;
        }

        document.getElementById('view-submission-content').innerHTML = content;
        document.getElementById('grade-display').innerHTML = gradeContent;
        
        if (currentUser.role === 'teacher') {
            document.getElementById('edit-grade-btn').style.display = 'inline-block';
            document.getElementById('edit-grade-btn').setAttribute('data-id', submissionId);
        } else {
            document.getElementById('edit-grade-btn').style.display = 'none';
        }

        viewSubmissionModal.classList.add('active');
    }

    function editGrade(submissionId) {
        const grade = contentStore.grades.find(g => g.submissionId === submissionId);
        if (!grade) return;

        document.getElementById('grade-submission-id').value = submissionId;
        document.getElementById('grade-score').value = grade.score;
        document.getElementById('grade-letter').value = grade.letter;
        document.getElementById('grade-feedback').value = grade.feedback;
        
        gradeModal.classList.add('active');
    }

    function openEditLessonModal(lessonId) {
        const lesson = contentStore.lessons.find(l => l.id === lessonId);
        if (lesson) {
            document.getElementById('edit-lesson-id').value = lesson.id;
            document.getElementById('edit-lesson-title').value = lesson.title;
            document.getElementById('edit-lesson-description').value = lesson.description;
            
            const thumbnailImg = document.getElementById('current-thumbnail');
            thumbnailImg.src = lesson.thumbnail;
            thumbnailImg.style.display = lesson.thumbnail ? 'block' : 'none';
            
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
        localStorage.setItem(`subject_${subjectId}_lessons`, JSON.stringify(contentStore.lessons));
        renderLessons();
        renderResources();
        showNotification('Lesson deleted successfully');
    }
    
    function deleteExercise(exerciseId) {
        contentStore.exercises = contentStore.exercises.filter(ex => ex.id !== exerciseId);
        localStorage.setItem(`subject_${subjectId}_exercises`, JSON.stringify(contentStore.exercises));
        renderExercises();
        renderResources();
        showNotification('Exercise deleted successfully');
    }
    
    function deleteDiscussion(discussionId) {
        contentStore.discussions = contentStore.discussions.filter(d => d.id !== discussionId);
        localStorage.setItem(`subject_${subjectId}_discussions`, JSON.stringify(contentStore.discussions));
        renderDiscussions();
        showNotification('Discussion deleted successfully');
    }
    
    function deleteSubmission(submissionId) {
        contentStore.submissions = contentStore.submissions.filter(s => s.id !== submissionId);
        
        // Also remove any grades associated with this submission
        contentStore.grades = contentStore.grades.filter(g => g.submissionId !== submissionId);
        
        localStorage.setItem(`subject_${subjectId}_submissions`, JSON.stringify(contentStore.submissions));
        localStorage.setItem(`subject_${subjectId}_grades`, JSON.stringify(contentStore.grades));
        
        renderResults();
        showNotification('Submission deleted successfully');
    }
    
    function editComment(lessonId, commentId) {
        const lesson = contentStore.lessons.find(l => l.id === lessonId);
        if (lesson) {
            let comment = lesson.comments.find(c => c.id === commentId);
            let isReply = false;
            
            if (!comment) {
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
                    comment.date = new Date().toISOString();
                    localStorage.setItem(`subject_${subjectId}_lessons`, JSON.stringify(contentStore.lessons));
                    renderLessons();
                }
            }
        }
    }
    
    function deleteComment(lessonId, commentId) {
        const lesson = contentStore.lessons.find(l => l.id === lessonId);
        if (lesson) {
            const commentIndex = lesson.comments.findIndex(c => c.id === commentId);
            
            if (commentIndex !== -1) {
                lesson.comments.splice(commentIndex, 1);
            } else {
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
            
            localStorage.setItem(`subject_${subjectId}_lessons`, JSON.stringify(contentStore.lessons));
            renderLessons();
            showNotification('Comment deleted successfully');
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
    
    function getFileType(mimeType) {
        if (mimeType.includes('image')) return 'image';
        if (mimeType.includes('video')) return 'video';
        if (mimeType.includes('audio')) return 'audio';
        if (mimeType.includes('pdf')) return 'pdf';
        return 'file';
    }
    
    function getFileTypeFromUrl(url) {
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
        if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
        if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
        if (['pdf'].includes(extension)) return 'pdf';
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
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});