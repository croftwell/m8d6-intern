import { Controller } from "stimulus";

export default class extends Controller {
    static targets = ["alertBox", "studentTable", "form", "name", "number", "midterm", "final"];

    connect() {
        this.students = JSON.parse(localStorage.getItem("students")) || [];
        this.updatedIndex = null;
        this.tableVisible = false;
        this.studentTableTarget.style.display = "none";
    }

    save(event) {
        event.preventDefault();

        const name = this.nameTarget.value;
        const number = this.numberTarget.value;
        const midterm = parseFloat(this.midtermTarget.value);
        const final = parseFloat(this.finalTarget.value);

        if (!name || !number || isNaN(midterm) || isNaN(final)) {
            this.showAlert("Please fill in all fields!", "error");
            return;
        }

        if (midterm < 0 || midterm > 100 || final < 0 || final > 100) {
            this.showAlert("Midterm and final grades must be between 0 and 100!", "error");
            return;
        }

        let average = (midterm * 0.4) + (final * 0.6);

        if (this.updatedIndex !== null) {
            this.students[this.updatedIndex] = { name, number, midterm, final, average };
            this.updatedIndex = null;
            this.showAlert("Student updated!", "success");
        } else {
            this.students.push({ name, number, midterm, final, average });
            this.showAlert("Student added!", "success");
        }

        localStorage.setItem("students", JSON.stringify(this.students));
        this.formTarget.reset();
    }

    show() {
        if (this.tableVisible) {
            this.studentTableTarget.style.display = "none";
            this.tableVisible = false;
            return;
        }

        const tbody = this.studentTableTarget.querySelector("tbody");
        tbody.innerHTML = ""; 

        if (this.students.length === 0) {
            this.showAlert("No students yet.", "error");
            return;
        }

        this.students.forEach((student, index) => {
            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.number}</td>
                <td>${student.midterm}</td>
                <td>${student.final}</td>
                <td>${student.average.toFixed(2)}</td>
                <td>
                    <button data-action="click->student#deleteStudent" data-index="${index}">Delete</button>
                    <button data-action="click->student#update" data-index="${index}">Update</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.studentTableTarget.style.display = "table"; // Tabloyu göster
        this.tableVisible = true;
    }

    deleteStudent(event) {
        const index = event.target.dataset.index;
        this.students.splice(index, 1); // Öğrenciyi listeden sil
        localStorage.setItem("students", JSON.stringify(this.students));
        this.show();
        this.showAlert("Student deleted!", "error");
    }

    update(event) {
        const index = event.target.dataset.index;
        const student = this.students[index];

        this.nameTarget.value = student.name;
        this.numberTarget.value = student.number;
        this.midtermTarget.value = student.midterm;
        this.finalTarget.value = student.final;

        this.updatedIndex = index;
    }

    showAlert(message, type) {
        this.alertBoxTarget.textContent = message;
        this.alertBoxTarget.style.backgroundColor = type === "error" ? "#f44336" : "#4CAF50";
        this.alertBoxTarget.style.display = "block";

        setTimeout(() => {
            this.alertBoxTarget.style.display = "none";
        }, 5000);
    }
}
