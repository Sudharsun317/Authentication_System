
const session = JSON.parse(localStorage.getItem("sessionUser"));

let currentPage = window.location.pathname.split("/").pop();

if (!currentPage) currentPage = "index.html";

const protectedPages = [
    "dashboard.html",
    "students.html",
    "taskmanager.html",
    "products.html",
    "timer.html",
    "oop.html"
];

if (!session && protectedPages.includes(currentPage)) {
    window.location.href = "index.html";
}

if (session && currentPage === "index.html") {
    window.location.href = "dashboard.html";
}


const users = [
    { id: 1, username: "admin", password: "admin", role: "admin", isLocked: false, failedAttempts: 0 },
    { id: 2, username: "Sudharsun", password: "123", role: "student", isLocked: false, failedAttempts: 0 },
    { id: 3, username: "student", password: "123", role: "student", isLocked: false, failedAttempts: 0 }
];

const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");



/* Protect dashboard pages */

// const protectedPages = ["dashboard.html", "students.html", "taskmanager.html", "products.html", "timer.html", "oop.html"];

// if (!session && protectedPages.some(p => window.location.pathname.includes(p))) {
//     window.location.href = "dashboard.html";



/* LOGIN */

loginForm?.addEventListener("submit", (e) => {

    e.preventDefault();

    const uname = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (!uname || !pass) {
        loginMsg.textContent = "Fields cannot be empty";
        return;
    }

    const user = users.find(u => u.username === uname);

    if (!user) {
        loginMsg.textContent = "Invalid username";
        return;
    }

    if (user.isLocked) {
        loginMsg.textContent = "Account locked!";
        return;
    }

    if (user.password === pass) {

        user.failedAttempts = 0;

        localStorage.setItem("sessionUser", JSON.stringify(user));

        window.location.href = "dashboard.html";

    } else {

        user.failedAttempts++;

        if (user.failedAttempts >= 3) {
            user.isLocked = true;
            loginMsg.textContent = "Account locked!";
        } else {
            loginMsg.textContent = "Wrong password";
        }
    }
});


/* LOGOUT */

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", () => {

    localStorage.removeItem("sessionUser");

    window.location.href = "index.html";
});




/* ================= THEME ================= */

const themeBtn = document.getElementById("themeBtn");

themeBtn?.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
    );

});

if (localStorage.getItem("theme") === "true") {
    document.body.classList.add("dark");
}


/* ================= SESSION USER ================= */

const sessionUser = JSON.parse(localStorage.getItem("sessionUser"));


/* ================= SIDEBAR PROFILE ================= */

const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarRole = document.getElementById("sidebarRole");

if (sessionUser) {

    if (sidebarUserName)
        sidebarUserName.textContent = sessionUser.username;

    if (sidebarRole) {

        sidebarRole.textContent = sessionUser.role;

        sidebarRole.className =
            sessionUser.role === "admin"
                ? "badge bg-danger"
                : "badge bg-success";
    }
}


/* ================= DASHBOARD DATA ================= */

const welcomeUser = document.getElementById("welcomeUser");

if (welcomeUser && sessionUser) {
    welcomeUser.textContent =
        `Welcome ${sessionUser.username} 👋`;
}
if (welcomeUser && sessionUser) {

    welcomeUser.textContent =
        `Welcome ${sessionUser.username} (${sessionUser.role}) 👋`;

}


if (welcomeUser && sessionUser) {

    welcomeUser.textContent =
        `Welcome ${sessionUser.username} (${sessionUser.role}) 👋`;

}



/* Total Students */

const totalStudentsEl = document.getElementById("totalStudents");
if (totalStudentsEl) {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    totalStudentsEl.textContent = students.length;
}


/* Total Tasks */

const totalTasksEl = document.getElementById("totalTasks");
if (totalTasksEl) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    totalTasksEl.textContent = tasks.length;
}


/* Date */

const todayDate = document.getElementById("todayDate");

if (todayDate) {
    todayDate.textContent = new Date().toLocaleDateString();
}



/* ================= STUDENTS ================= */

let students = JSON.parse(localStorage.getItem("students"));
if (!students) {

    students = [

        {
            name: "Lewis Hamilton",
            marks: [85, 78, 92, 88, 76],
            total: 419,
            avg: 83.8,
            grade: "A+"
        },
        {
            name: "Max Verstappen",
            marks: [95, 90, 93, 97, 91],
            total: 466,
            avg: 93.2,
            grade: "O"
        },
        {
            name: "Charles Leclerk",
            marks: [60, 55, 70, 65, 68],
            total: 318,
            avg: 63.6,
            grade: "B"
        },
        {
            name: "Lando Norris",
            marks: [40, 38, 50, 45, 42],
            total: 215,
            avg: 43,
            grade: "Fail"
        }

    ];
    localStorage.setItem("students", JSON.stringify(students));
}
if (!localStorage.getItem("students")) {
    localStorage.setItem("students", JSON.stringify(students));
}

const studentForm = document.getElementById("studentForm");

studentForm?.addEventListener("submit", (e) => {

    e.preventDefault();

    const name = document.getElementById("sname").value;

    const marks = [...document.querySelectorAll(".mark")]
        .map(m => Number(m.value));

    if (marks.some(m => m < 0 || m > 100)) {
        alert("Marks must be 0-100");
        return;
    }

    const total = marks.reduce((a, b) => a + b, 0);
    const avg = total / 5;

    let grade = "C";

    if (marks.some(m => m < 40)) grade = "Fail";
    else if (avg >= 90) grade = "O";
    else if (avg >= 80) grade = "A+";
    else if (avg >= 70) grade = "A";
    else if (avg >= 60) grade = "B";

    students.push({ name, marks, total, avg, grade });

    localStorage.setItem("students", JSON.stringify(students)); // SAVE

    renderStudents();

});


function renderStudents() {

    const table = document.getElementById("studentTable");
    const stats = document.getElementById("studentStats");

    if (!table) return;

    const sorted = [...students].sort((a, b) => b.total - a.total);

    table.innerHTML = sorted.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>
                ${s.name}
                ${i === 0 ? '<span class="badge bg-warning ms-2">Topper</span>' : ''}
            </td>
            <td>${s.total}</td>
            <td>${s.avg.toFixed(2)}</td>
            <td class="${s.grade === 'Fail' ? 'text-danger fw-bold' : ''}">
                ${s.grade}
            </td>
        </tr>
    `).join("");

    const classAvg =
        students.reduce((a, s) => a + s.avg, 0) / students.length;

    if (stats) {
        stats.textContent =
            `Class Avg: ${classAvg.toFixed(2)} | Topper: ${sorted[0]?.name || "-"}`;
    }
}


/* Load default data on page open */

if (document.getElementById("studentTable")) {
    renderStudents();
}


/* ================= TODO ================= */

let tasks = JSON.parse(localStorage.getItem("tasks"));

if (!tasks) {

    tasks = [

        {
            id: 1,
            title: "Complete Data Structures assignment",
            isCompleted: true,
            createdAt: new Date()
        },
        {
            id: 2,
            title: "Prepare for Mathematics test",
            isCompleted: true,
            createdAt: new Date()
        },
        {
            id: 3,
            title: "Submit Mini Project report",
            isCompleted: true,
            createdAt: new Date()
        },
        {
            id: 4,
            title: "Attend AI lecture at 10 AM",
            isCompleted: true,
            createdAt: new Date()
        },
        {
            id: 5,
            title: "Practice JavaScript coding problems",
            isCompleted: false,
            createdAt: new Date()
        },
        {
            id: 6,
            title: "Review Database Management notes",
            isCompleted: false,
            createdAt: new Date()       
        },
        {
            id: 7,
            title: "Study Operating Systems chapter 3",
            isCompleted: true,
            createdAt: new Date()
        },
        {
            id: 8,
            title: "Solve 20 LeetCode problems",
            isCompleted: true,
            createdAt: new Date()
        },
        {
            id: 9,
            title: "Solve aptitude questions",
            isCompleted: false,
            createdAt: new Date()
        },

    ];
}

if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const saveTasks = () =>
    localStorage.setItem("tasks", JSON.stringify(tasks));

const renderTasks = () => {

    if (!taskList) return;

    taskList.innerHTML = tasks.map(t => `
        <li class="list-group-item d-flex justify-content-between" data-id="${t.id}">
            <span class="${t.isCompleted ? 'done' : ''}">
                ${t.title}
            </span>

            <div>
                <button class="btn btn-sm btn-success complete">✔</button>
                <button class="btn btn-sm btn-danger delete">✖</button>
            </div>
        </li>
    `).join("");

    const stats = document.getElementById("taskStats");

    if (stats) {
        const completed = tasks.filter(t => t.isCompleted).length;
        stats.textContent =
            `Total: ${tasks.length} | Completed: ${completed}`;
    }
};

addTaskBtn?.addEventListener("click", () => {

    const input = document.getElementById("taskInput");

    if (!input.value.trim()) return;

    tasks.push({
        id: Date.now(),
        title: input.value,
        isCompleted: false,
        createdAt: new Date()
    });

    input.value = "";

    saveTasks();
    renderTasks();
});

taskList?.addEventListener("click", e => {

    const id = Number(e.target.closest("li").dataset.id);

    if (e.target.classList.contains("delete")) {
        tasks = tasks.filter(t => t.id !== id);
    }

    if (e.target.classList.contains("complete")) {
        const task = tasks.find(t => t.id === id);
        task.isCompleted = !task.isCompleted;
    }

    saveTasks();
    renderTasks();
});

renderTasks();


/* ================= PRODUCTS ================= */

const products = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: ["Electronics", "Books", "Clothing"][i % 3],
    price: Math.floor(Math.random() * 1000) + 100,
    rating: Math.floor(Math.random() * 5) + 1
}));

const searchInput = document.getElementById("search");

const renderProducts = (list) => {

    const container = document.getElementById("productList");
    const count = document.getElementById("resultCount");

    if (!container) return;

    if (count) count.textContent = `${list.length} Results`;

    container.innerHTML = list.map(p => `
        <div class="col-md-3">
            <div class="card p-2 mb-2">
                <h6>${p.name}</h6>
                <p>${p.category}</p>
                <p>₹${p.price}</p>
                <p>⭐ ${p.rating}</p>
            </div>
        </div>
    `).join("");
};

const filterProducts = () => {

    if (!searchInput) return;

    const search = searchInput.value.toLowerCase();
    const category = document.getElementById("category").value;
    const rating = document.getElementById("rating").checked;

    let list = products.filter(p =>
        p.name.toLowerCase().includes(search)
    );

    if (category !== "all")
        list = list.filter(p => p.category === category);

    if (rating)
        list = list.filter(p => p.rating >= 4);

    renderProducts(list);
};

searchInput?.addEventListener("input", filterProducts);
document.getElementById("category")?.addEventListener("change", filterProducts);
document.getElementById("rating")?.addEventListener("change", filterProducts);

renderProducts(products);


/* ================= TIMER ================= */

const clock = document.getElementById("clock");

if (clock) {
    setInterval(() => {
        clock.textContent = new Date().toLocaleTimeString();
    }, 1000);
}

let timerInterval = null;
let totalSeconds = 0;

document.getElementById("startTimer")?.addEventListener("click", () => {

    if (timerInterval) return;

    const min = Number(document.getElementById("min").value) || 0;
    const sec = Number(document.getElementById("sec").value) || 0;

    totalSeconds = min * 60 + sec;

    timerInterval = setInterval(() => {

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Time Up!");
            return;
        }

        totalSeconds--;

        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');

        document.getElementById("timerDisplay").textContent =
            `${h}:${m}:${s}`;

    }, 1000);
});
const progressBar = document.getElementById("timerProgress");
const initialSeconds = totalSeconds;

if (progressBar) {

    const percent =
        ((initialSeconds - totalSeconds) / initialSeconds) * 100;

    progressBar.style.width = percent + "%";
}


document.getElementById("pauseTimer")?.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById("resetTimer")?.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("timerDisplay").textContent = "00:00:00";
});
let sessionCount = 0;
let totalFocus = 0;

const sessionEl = document.getElementById("sessionCount");
const focusEl = document.getElementById("totalFocus");
const statusEl = document.getElementById("timerStatus");
const historyEl = document.getElementById("timerHistory");

document.getElementById("startTimer")?.addEventListener("click", () => {

    if (statusEl) statusEl.textContent = "Running";

});

document.getElementById("pauseTimer")?.addEventListener("click", () => {

    if (statusEl) statusEl.textContent = "Paused";

});

document.getElementById("resetTimer")?.addEventListener("click", () => {

    if (statusEl) statusEl.textContent = "Idle";

});

function timerCompleted(minutes){

    sessionCount++;
    totalFocus += minutes;

    if (sessionEl) sessionEl.textContent = sessionCount;
    if (focusEl) focusEl.textContent = totalFocus + " min";

    if (historyEl) {

        const li = document.createElement("li");

        li.className = "list-group-item";

        li.textContent =
            `Completed ${minutes} min session at ${new Date().toLocaleTimeString()}`;

        historyEl.prepend(li);
    }
}



/* ================= OOP ================= */

const oopOutput = document.getElementById("oopOutput");

if (oopOutput) {

    /* Base Class */

    class User {

        constructor(name) {
            this._name = name;   // Encapsulation
        }

        get name() {
            return this._name;
        }

        set name(value) {
            this._name = value;
        }

        login() {
            return `${this._name} logged in`;
        }

        logout() {
            return `${this._name} logged out`;
        }

        getRoleDetails() {
            return "Generic User";
        }
    }


    /* Student Class */

    class Student extends User {

        constructor(name, course) {
            super(name);
            this.course = course;
        }

        getRoleDetails() {
            return `Student enrolled in ${this.course}`;
        }
    }


    /* Admin Class */

    class Admin extends User {

        constructor(name) {
            super(name);
        }

        manageUsers() {
            return "Admin managing users";
        }

        getRoleDetails() {
            return "Administrator with full privileges";
        }
    }


    /* Objects */

    const users = [
        new Student("Sudharsun", "AI & DS"),
        new Admin("Max")
    ];


    /* Polymorphism Example */

    let html = "";

    users.forEach(user => {

        html += `
            <div class="card p-3 mb-2 shadow-sm">

                <h5>${user.name}</h5>

                <p>${user.login()}</p>

                <p>${user.getRoleDetails()}</p>

                ${user instanceof Admin
                    ? `<p>${user.manageUsers()}</p>`
                    : ""}

                <p>${user.logout()}</p>

            </div>
        `;
    });


    oopOutput.innerHTML = html;
}

