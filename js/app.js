const button = document.getElementById('button');
const main = document.getElementById('grid_note');

button.addEventListener('click', () => {
    addNote();
});

let db = null;

window.onload = Database();
function Database(text) {
    let request = window.indexedDB.open('note_os', 3);

    request.onerror = function () {
        console.log(request.error);
    }

    request.onsuccess = function (e) {
        db = e.target.result;
        console.log('We have data ');
        addData(text);
        getAllTodoItems();
    }

    request.onupgradeneeded = function (e) {
        let db = e.target.result;
        let objectStore = db.createObjectStore('notes', { keyPath: 'id' });
        objectStore.createIndex('text_os', 'text', { unique: false });
        console.log('Set up 100% Database')
    }
}

function addData(text) {
    if (!text == '') {
        let data =
        {
            text: text,
            id: new Date().getTime()

        };
        let indexdb = db;
        let transaction = indexdb.transaction(['notes'], 'readwrite');
        let objectStore = transaction.objectStore('notes');
        let request = objectStore.put(data);
        console.log('Add data final!' + data);
    }
}

function deleteDB(id) {
    let indexdb = db;
    let transaction = indexdb.transaction(['notes'], 'readwrite');
    let objectStore = transaction.objectStore('notes');

    var request = objectStore.delete(id);
    console.log('Database has remove data');
}

function getAllTodoItems() {
    console.log('Start get all data')
    main.innerHTML = '';

    let indexdb = db;
    let transaction = indexdb.transaction(['notes'], 'readwrite');
    let objectStore = transaction.objectStore('notes');
    var cursorRequest = objectStore.openCursor();
    cursorRequest.onsuccess = function (e) {
        var result = e.target.result;
        if (result) {
            addNote(result.value.text, result.value.id);
            result.continue();
        }
    };
}

function addNote(cursorTEX = "", cursorID) {
    const para = document.createElement('div');
    para.classList.add('row');
    para.innerHTML = ` <div class="col-12 grid_note_container">                                
    <div class="col-12 icon_edit">
        <img src="images/edit.png" id="button_1" alt="icon_edit" srcset="">
        <img src="https://img.icons8.com/clouds/42/000000/delete-forever.png" id="button_2"/>
    </div>
    <div class="col-12 col-sm-12 grid_note_content">
    <div class= "context"></div>
    <textarea class="textarea"></textarea>
    </div>
    </div>`

    const saveBtn = para.querySelector('#button_1');
    const deleteBtn = para.querySelector('#button_2');

    const context = para.querySelector('.context');
    const p = document.createElement('p');
    let count = true;

    const textArea = para.querySelector('textarea');
    textArea.value = cursorTEX;

    saveBtn.addEventListener('click', () => {
        if (count) {
            textArea.classList.add('none');
            context.classList.add('hidden')
            count = false;
            Database(textArea.value);
        } else {
            textArea.classList.remove('none');
            context.classList.remove('hidden')
            count = true;
            updateObject(textArea);
        }
    });
    deleteBtn.addEventListener('click', () => {
        para.remove();
        deleteDB(cursorID);
    });

    textArea.addEventListener('input', (e) => {
        const { value } = e.target;
        p.textContent = value;
        context.append(p);
    })
    main.appendChild(para);
}

function updateObject(e) {
    let indexdb = db;
    let transaction = indexdb.transaction(['notes'], 'readwrite');
    let objectStore = transaction.objectStore('notes');
    const objectStoreTitleRequest = objectStore.get(text);

    objectStore.onsuccess = function() {
        const data = objectStoreTitleRequest.result;
        data.notified = e.value;

        const updateTitleRequest = objectStore.put(data);

        updateTitleRequest.onsuccess = () => {
            getAllTodoItems();
          };
    }
}






