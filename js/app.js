const button = document.getElementById('button');
const main = document.getElementById('grid_note');

// Add the future you need with interface
button.addEventListener('click', () => {
    addNote();
});


// create database
let db = null;

window.onload = Database();
function Database(text) {
    let request = window.indexedDB.open('note_os', 3);

    // throw err when database err
    request.onerror = function () {
        console.log(request.error);
    }

    // ex code when data has setup
    request.onsuccess = function (e) {
        db = e.target.result;
        console.log('We have data ');
        getAllTodoItems();
    }

    // when database open at first the function run code to setting database and create the threat to store data
    request.onupgradeneeded = function (e) {
        let db = e.target.result;
        let objectStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('text_os', 'text', { unique: false });
        console.log('Set up 100% Database')
    }
}

// get iD positive of NODES to remove TEXT.value in database
function deleteDB(id) {
    let indexdb = db;
    let transaction = indexdb.transaction(['notes'], 'readwrite');
    let objectStore = transaction.objectStore('notes');

    var request = objectStore.delete(id);
    console.log('Database has remove data');
}


// function render data on database down display NODES
function getAllTodoItems() {
    console.log('Start get all data')
    // main.innerHTML = '';

    let indexdb = db;
    let transaction = indexdb.transaction(['notes'], 'readwrite');
    let objectStore = transaction.objectStore('notes');
    var cursorRequest = objectStore.openCursor();
    cursorRequest.onsuccess = function (e) {
        var result = e.target.result;
        if (result) {
            addNote(result.value.text_content, result.value.id);
            result.continue();
        }
    };
}

// when click buttom ADD the function addNote will run
/* Create content in function to excute OOP when you click buttom addNote create
a object and have content in here the addNote is object main

deleteBtn will deltete object and call function deletecDB;
 */
var index = 0
function addNote(cursorTEX = "", cursorID = "") {
    ++index;
    console.log(cursorTEX)
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
        } else {
            textArea.classList.remove('none');
            context.classList.remove('hidden')
            count = true;
        }
    });
    deleteBtn.addEventListener('click', () => {
        para.remove();
        deleteDB(cursorID);
    });

    textArea.addEventListener('input', (e) => {
        const { value } = e.target;
        p.textContent = value;

        if (value != '') {
            let data = {
                text_content: value,
                id: index
            }   
            updateObject(data);
        }
        context.append(p);
    })
    main.appendChild(para);
}

// get ID use check positve of NODES and use update DATE tend positive ID; TEXT is input value user input;
/*The function have get ID positve to check ID own 
the NODES and add TEXT.value to database*/
function updateObject(data) {
    let id = data.id;
    console.log(id)
    let indexdb = db;
    let transaction = indexdb.transaction(['notes'], 'readwrite');
    let objectStore = transaction.objectStore('notes');
    const objectStoreTitleRequest = objectStore.get(id);

    objectStoreTitleRequest.onsuccess = function () {
        const updateTitleRequest = objectStore.put(data);

        updateTitleRequest.onsuccess = () => {
            console.log('Update!')
        };
    }
}






