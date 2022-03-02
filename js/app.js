const button = document.getElementById('button');
let main = document.getElementById('grid_note');
let arrays = [];
let buttonDelete = document.querySelectorAll('img#button_2');
let para;
let textarea = document.getElementById('textarea');
const form = document.querySelectorAll('#button_1');

for (let index = 0; index < form.length; index++) {
    form[index].addEventListener('click', (e) => {
        Database();
    })
}

window.onload = Database();
let db;
function Database() {
    let request = window.indexedDB.open('note_os', 3);

    request.onerror = function () {
        console.log(request.error);
    }

    request.onsuccess = function () {
        db = request.result;
        addData(db);
        console.log("Database have data");
        Display(db);
    }

    request.onupgradeneeded = function (e) {
        let db = e.target.result;
        let objectStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('title', 'title', { unique: false });
        console.log(db);
    }
}


function addData(e) {
    console.log('textarea: ' + textarea.value)
    if (!textarea.value == '') {
    let content = { title: textarea.value };
    console.log('log content: ' + content.title);
    let transaction = e.transaction('notes', 'readwrite');
    let object = transaction.objectStore('notes');
    let request = object.add(content);
}

    // request.onsuccess = function () {
    //     textarea.value = '';
    // }
}

function Display(e) {
    let transaction = e.transaction('notes');
    let object = transaction.objectStore('notes');
    object.openCursor().onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {
            console.log(cursor.value.title);
            textarea.textContent = cursor.value.title;
            cursor.continue();
        }
    }

}

button.addEventListener('click', (e) => {
    for (let index = 0; index < 2; index++) {
        para = document.createElement('div');
        para.classList.add('row');

        para.innerHTML = ` <div class="col-12 grid_note_container">
        <div class="col-12 grid_note_color">
            <div class="col-3 icon_edit">
                <img src="images/edit.png" alt="icon_edit" srcset="">
                <img src="https://img.icons8.com/clouds/42/000000/delete-forever.png"/>
            </div>
        </div>
        <div class="col-12 col-sm-12 grid_note_content">
            <textarea></textarea>
        </div>
    </div>`
        arrays.push(para);
        main.appendChild(arrays[index]);
        break;
        // buttonClick();   
    }
});




