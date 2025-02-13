let students = [];
let updatedIndex = null;

const form = document.querySelector("#form");
form.addEventListener("submit", save);

function save(event) {
    event.preventDefault();

    const params = new FormData(event.currentTarget);
    const name = params.get("name");
    const number = params.get("number");
    const midterm = parseFloat(params.get("midterm"));
    const final = parseFloat(params.get("final"));

    if (!name || !number || isNaN(midterm) || isNaN(final)) {
        showAlert("Please fill in all fields!", "error");
        return;
    }

    if (midterm < 0 || midterm > 100 || final < 0 || final > 100) {
        showAlert("Midterm and final grades must be between 0 and 100!", "error");
        return;
    }

    let average = (midterm * 0.4) + (final * 0.6);

    if (updatedIndex !== null) {
        students[updatedIndex] = { name, number, midterm, final, average };
        updatedIndex = null;
        showAlert("Student information has been updated!", "success");
    } else {
        students.push({ name, number, midterm, final, average });
        showAlert("Student successfully added!", "success");
    }

    event.currentTarget.reset();
}

function show() {
    let studentTable = document.getElementById("studentTable");
    let tbody = studentTable.querySelector("tbody");
    tbody.innerHTML = "";

    if (students.length === 0) {
        showAlert("No students registered yet.", "error");
        return;
    }

    students.forEach((student, index) => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.number}</td>
            <td>${student.midterm}</td>
            <td>${student.final}</td>
            <td>${student.average.toFixed(2)}</td>
            <td class="action-buttons">
                <button onclick="deleteStudent(${index})">Delete</button>
                <button onclick="update(${index})">Update</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    studentTable.style.display = "table";  
}

function deleteStudent(index) {
    students.splice(index, 1);
    show();
    showAlert("Student deleted!", "error");
}

function update(index) {
    let student = students[index];
    document.getElementById("name").value = student.name;
    document.getElementById("number").value = student.number;
    document.getElementById("midterm").value = student.midterm;
    document.getElementById("final").value = student.final;

    updatedIndex = index; 
}

/* Geri Sayımlı Bildirim Fonksiyonu */
function showAlert(message, type) {
    const alertBox = document.getElementById("alertBox");
    const alertMessage = document.getElementById("alertMessage");
    const countdownSpan = document.getElementById("countdown");

    alertMessage.textContent = message;
    alertBox.style.backgroundColor = type === "error" ? "#f44336" : "#4CAF50";
    alertBox.style.display = "block";

    let secondsLeft = 5;
    countdownSpan.textContent = ` (${secondsLeft}s)`;

    let countdown = setInterval(() => {
        secondsLeft--;
        countdownSpan.textContent = ` (${secondsLeft}s)`;

        if (secondsLeft <= 0) {
            clearInterval(countdown);
            alertBox.style.display = "none";
        }
    }, 1000);
}

/* Bildirimi Kapatma */
function closeAlert() {
    document.getElementById("alertBox").style.display = "none";
}
