let students = JSON.parse(localStorage.getItem("students")) || [];
let updatedIndex = null;
let tableVisible = false; // Sayfa yüklendiğinde tablo kapalı olsun

const form = document.querySelector("#form");
const studentTable = document.getElementById("studentTable");

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
        showAlert("Student updated!", "success");
    } else {
        students.push({ name, number, midterm, final, average });
        showAlert("Student added!", "success");
    }

    localStorage.setItem("students", JSON.stringify(students));
    event.currentTarget.reset();
}

function show() {
    if (tableVisible) {
        studentTable.style.display = "none";
        tableVisible = false;
        return;
    }

    let tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";

    if (students.length === 0) {
        showAlert("No students yet.", "error");
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
            <td>
                <button onclick="deleteStudent(${index})">Delete</button>
                <button onclick="update(${index})">Update</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    studentTable.style.display = "table";
    tableVisible = true;
}

function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
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

function showAlert(message, type) {
    const alertBox = document.getElementById("alertBox");
    alertBox.textContent = message;
    alertBox.style.backgroundColor = type === "error" ? "#f44336" : "#4CAF50";
    alertBox.style.display = "block";

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 5000);
}

// Sayfa yüklendiğinde tabloyu kapalı yap
document.addEventListener("DOMContentLoaded", () => {
    studentTable.style.display = "none";
});
