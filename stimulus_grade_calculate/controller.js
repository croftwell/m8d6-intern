import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";

export default class extends Controller {
    static targets = ["form", "table"];

    initialize() {
        this.students = [];
    }

    save(event) {

        const formData = new FormData(this.formTarget);
        const student = {
            name: formData.get("name"),
            number: formData.get("number"),
            midterm: formData.get("midterm"),
            final: formData.get("final")
        };

        console.log("Eklenen öğrenci:", student);

        this.students.push(student);
        this.formTarget.reset(); 
        alert("Kayıt yapıldı!");
    }

    show() {
        const tbody = this.tableTarget.querySelector("tbody");
        tbody.innerHTML = "";

        this.students.forEach(student => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.number}</td>
                <td>${student.midterm}</td>
                <td>${student.final}</td>
            `;
            tbody.appendChild(row);
        });

        this.tableTarget.style.display = "table";
    }
}
