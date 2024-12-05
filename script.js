// Select elements
const taskTitleInput = document.getElementById("task-title");
const taskCategoryInput = document.getElementById("task-category");
const taskPriorityInput = document.getElementById("task-priority");
const taskDeadlineInput = document.getElementById("task-deadline");
const addTaskButton = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const completedCount = document.getElementById("completed-count");
const totalTasks = document.getElementById("total-tasks");
const progressFill = document.querySelector(".progress-fill");
const searchInput = document.getElementById("search");

// Pomodoro timer elements
const pomodoroDisplay = document.getElementById("pomodoro-display");
const startPomodoroButton = document.getElementById("start-pomodoro");
const resetPomodoroButton = document.getElementById("reset-pomodoro");
const pomodoroStatus = document.getElementById("pomodoro-status");

// Global variables
let tasks = [];
let totalTaskCount = 0;
let completedTaskCount = 0;
let pomodoroTime = 25 * 60; // Default 25 minutes
let breakTime = 5 * 60; // Default 5 minutes
let timerInterval = null;
let isPomodoroRunning = false;

// Update progress bar
function updateProgress() {
  completedCount.textContent = completedTaskCount;
  totalTasks.textContent = totalTaskCount;

  const progressPercentage = totalTaskCount === 0 ? 0 : (completedTaskCount / totalTaskCount) * 100;
  progressFill.style.width = `${progressPercentage}%`;
}

// Render tasks
function renderTasks(filteredTasks = tasks) {
  taskList.innerHTML = "";
  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    taskItem.innerHTML = `
      <div class="task-info">
        <span class="task-title ${task.completed ? "completed" : ""}">${task.title}</span>
        <span class="task-category">${task.category} | ${task.priority.toUpperCase()} | Deadline: ${new Date(task.deadline).toLocaleString()}</span>
      </div>
      <div class="task-controls">
        <button class="complete-btn" onclick="toggleComplete(${index})">${task.completed ? "Undo" : "Complete"}</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Add task
addTaskButton.addEventListener("click", () => {
  const taskTitle = taskTitleInput.value.trim();
  const taskCategory = taskCategoryInput.value;
  const taskPriority = taskPriorityInput.value;
  const taskDeadline = taskDeadlineInput.value;

  if (!taskTitle || !taskCategory || !taskPriority || !taskDeadline) {
    alert("Please fill in all fields!");
    return;
  }

  const newTask = {
    title: taskTitle,
    category: taskCategory,
    priority: taskPriority,
    deadline: taskDeadline,
    completed: false,
  };

  tasks.push(newTask);
  totalTaskCount++;
  updateProgress();
  renderTasks();

  // Clear inputs
  taskTitleInput.value = "";
  taskCategoryInput.value = "";
  taskPriorityInput.value = "";
  taskDeadlineInput.value = "";
});

// Toggle task completion
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;

  if (tasks[index].completed) {
    completedTaskCount++;
  } else {
    completedTaskCount--;
  }

  updateProgress();
  renderTasks();
}

// Delete task
function deleteTask(index) {
  if (tasks[index].completed) {
    completedTaskCount--;
  }
  totalTaskCount--;
  tasks.splice(index, 1);

  updateProgress();
  renderTasks();
}

// Search tasks
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm) ||
    task.category.toLowerCase().includes(searchTerm) ||
    task.priority.toLowerCase().includes(searchTerm)
  );

  renderTasks(filteredTasks);
});

// Start Pomodoro timer
startPomodoroButton.addEventListener("click", () => {
  if (isPomodoroRunning) return;

  isPomodoroRunning = true;
  let currentPomodoroTime = pomodoroTime;

  pomodoroStatus.textContent = "Focus Time!";
  timerInterval = setInterval(() => {
    const minutes = Math.floor(currentPomodoroTime / 60);
    const seconds = currentPomodoroTime % 60;
    pomodoroDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    currentPomodoroTime--;
    if (currentPomodoroTime < 0) {
      clearInterval(timerInterval);
      pomodoroStatus.textContent = "Break Time!";
      startBreakTimer();
    }
  }, 1000);
});

// Start break timer
function startBreakTimer() {
  let currentBreakTime = breakTime;

  timerInterval = setInterval(() => {
    const minutes = Math.floor(currentBreakTime / 60);
    const seconds = currentBreakTime % 60;
    pomodoroDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    currentBreakTime--;
    if (currentBreakTime < 0) {
      clearInterval(timerInterval);
      pomodoroStatus.textContent = "Focus Time!";
      isPomodoroRunning = false;
    }
  }, 1000);
}

// Reset Pomodoro timer
resetPomodoroButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  pomodoroDisplay.textContent = "25:00";
  pomodoroStatus.textContent = "Focus Time!";
  isPomodoroRunning = false;
});
