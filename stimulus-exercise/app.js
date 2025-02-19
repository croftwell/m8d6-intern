import { Application } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.esm.js";

const application = Application.start();

application.register("crud", class extends Stimulus.Controller {
  static get targets() {
    return ["list"];
  }

  connect() {
    try {
      const savedItems = localStorage.getItem("items");
      console.log("LocalStorage'dan alınan veri:", savedItems);
      this.items = savedItems ? JSON.parse(savedItems) : [];
      this.render();
    } catch (error) {
      console.error("LocalStorage okuma hatası:", error);
    }
  }

  create(event) {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const newItem = formData.get("name").trim();

      console.log("Formdan gelen veri:", newItem);

      if (!newItem) {
        console.warn("Boş veri girildi!");
        return;
      }

      this.items.push(newItem);
      this.updateStorage();
      event.currentTarget.reset();
      this.render();
    } catch (error) {
      console.error("Veri ekleme hatası:", error);
    }
  }

  render() {
    try {
      console.log("Render edilen öğeler:", this.items);
      this.listTarget.innerHTML = "";

      this.items.forEach((item, index) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = item;

        const actionsCell = document.createElement("td");

        const showButton = document.createElement("button");
        showButton.textContent = "Göster";
        showButton.addEventListener("click", () => this.show(index));

        const editButton = document.createElement("button");
        editButton.textContent = "Düzenle";
        editButton.addEventListener("click", () => this.edit(index));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Sil";
        deleteButton.addEventListener("click", () => this.delete(index));

        actionsCell.append(showButton, editButton, deleteButton);
        row.append(nameCell, actionsCell);
        this.listTarget.appendChild(row);
      });
    } catch (error) {
      console.error("Render işlemi hatası:", error);
    }
  }

  show(index) {
    try {
      if (index >= 0 && index < this.items.length) {
        alert(`Seçilen öğe: ${this.items[index]}`);
      } else {
        alert("Hata: Öğeyi bulamadım!");
      }
    } catch (error) {
      console.error("Gösterme hatası:", error);
    }
  }

  showAll() {
    try {
      const displayArea = document.getElementById('displayArea');
      displayArea.innerHTML = ''; // Önceki öğeleri temizle

      if (this.items.length === 0) {
        displayArea.innerHTML = "Liste boş!";
      } else {
        this.items.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.textContent = item; // Öğeyi ekrana yazdır
          displayArea.appendChild(itemElement);
        });
      }
    } catch (error) {
      console.error("Tüm öğeleri gösterme hatası:", error);
    }
  }

  edit(index) {
    try {
      const newValue = prompt("Yeni değeri gir:", this.items[index]);
      if (newValue) {
        this.items[index] = newValue.trim();
        this.updateStorage();
        this.render();
      }
    } catch (error) {
      console.error("Düzenleme hatası:", error);
    }
  }

  delete(index) {
    try {
      this.items.splice(index, 1);
      this.updateStorage();
      this.render();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  }

  updateStorage() {
    try {
      localStorage.setItem("items", JSON.stringify(this.items));
    } catch (error) {
      console.error("LocalStorage'a veri yazma hatası:", error);
    }
  }
});

// Butonun olay dinleyicisi
document.getElementById('showButton').addEventListener('click', function() {
    // Tüm öğeleri göster
    this.showAll(); // Bu fonksiyonun çağrıldığından emin olun
});

const students = [];

// Formu kaydetme işlemi
document.getElementById('studentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const number = document.getElementById('number').value;
    const midterm = document.getElementById('midterm').value;
    const final = document.getElementById('final').value;

    // Öğrenci nesnesini oluştur
    const student = {
        name: name,
        number: number,
        midterm: midterm,
        final: final
    };

    // Öğrenciyi diziye ekle
    students.push(student);
    console.log(students); // Öğrencilerin doğru bir şekilde kaydedildiğini kontrol et
    this.reset(); // Formu sıfırla
});

// Öğrenci verilerini gösterme işlemi
document.getElementById('showButton').addEventListener('click', function() {
    const displayArea = document.getElementById('displayArea');
    displayArea.innerHTML = ''; // Önceki verileri temizle

    if (students.length === 0) {
        displayArea.innerHTML = 'Hiç öğrenci yok.';
        return;
    }

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>İsim</th><th>Numara</th><th>Vize Notu</th><th>Final Notu</th>';
    table.appendChild(headerRow);

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${student.name}</td><td>${student.number}</td><td>${student.midterm}</td><td>${student.final}</td>`;
        table.appendChild(row);
    });

    displayArea.appendChild(table);
});
