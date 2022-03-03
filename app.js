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

let db = null;

function Database(obj) {
    let request = window.indexedDB.open('note_os', 3);

    request.onerror = function () {
        console.log(request.error);
    }

    request.onsuccess = function (e) {
        db = e.target.result;
        addData(obj);
        console.log('We have data ');
        Display(e);
    }

    request.onupgradeneeded = function (e) {
        let db = request.result;
        let objectStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('information', 'information', { unique: false });
        console.log('Set up 100% Database')
    }
}

function addData(e) {
    if (!e == '') {
        let content = { information: e };
        console.log('log content: ' + e);
        let transaction = db.transaction('notes', 'readwrite');
        let object = transaction.objectStore('notes');
        let request = object.add(content);

        return request;
    }
}

function Display(e) {
    console.log('Display now')
    let transaction = db.transaction('notes', 'readwrite');
    let object = transaction.objectStore('notes');
    object.openCursor().onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {
            let arrays = [];
            arrays.push(cursor.value.information);
            for (let index = 0; index < arrays.length; index++) {
                console.log(arrays[index]);
            }
            cursor.continue();
        }
    }
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
            updateDB();
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
        const { value } = e.target;

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





