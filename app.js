const button = document.getElementById('button');
const main = document.getElementById('grid_note');

button.addEventListener('click', () => {
    addNote();
});

const notes = JSON.parse(localStorage.getItem("notes"));

if (notes) {
    notes.forEach((note) => {
        addNote(note);
    });
}

function addNote(text = "") {
    const para = document.createElement('div');
    para.classList.add('row');

    para.innerHTML = ` <div class="col-12 grid_note_container">                                
    <div class="col-12 icon_edit">
        <img src="images/edit.png" id="button_1" alt="icon_edit" srcset="">
        <img src="https://img.icons8.com/clouds/42/000000/delete-forever.png" id="button_2"/>
    </div>
    <div class="col-12 col-sm-12 grid_note_content">
    <div class="context"></div>
        <textarea class="textarea"></textarea>
    </div>
    </div>`
    main.appendChild(para);

    const saveBtn = para.querySelector('#button_1');
    const deleteBtn = para.querySelector('#button_2');

    const context = para.querySelector('.context');
    const textArea = para.querySelector('textarea');

    textArea.value = text;
    const p = document.createElement('p');
    let count = true;
   

    saveBtn.addEventListener('click', () => {
        if (count) {
            p.textContent = textArea.value;
            context.append(p);
            textArea.classList.add('none');
            context.classList.add('hidden')
            count = false;
        } else {
            textArea.classList.remove('none');
            context.classList.remove('hidden')
            count = true;
        }
    });
    deleteBtn.addEventListener('click', () => {
        para.remove();
        updateDB();
    });

    textArea.addEventListener("input", (e) => {
        updateDB();
    });

}

function updateDB() {
    const valueTextArea = document.querySelectorAll('textarea');

    let notes = [];

    valueTextArea.forEach(e => {
        notes.push(e.value);
    });

    localStorage.setItem("notes", JSON.stringify(notes));
}





