document.addEventListener('DOMContentLoaded', () => {
    fillExercisesList(); 
    fillWorkoutList();

    fillWorkoutLineGrid(1); //TODO: Change hardcoded 1 to selected workout   
})

const workoutList = document.getElementById('workoutList')
workoutList.addEventListener('change', (event) => {
    fillWorkoutLineGrid(event.target.value)
})

const newExerciseName = document.getElementById('newExerciseName')
newExerciseName.addEventListener('input', (event) => {
    let disabled = event.target.value == ''
    setButtonDisabledAttribute('newExerciseBtn', disabled)
})

const newExerciseBtn = document.getElementById('newExerciseBtn')
newExerciseBtn.addEventListener('click', (event) => {
    let exerciseName = document.getElementById('newExerciseName').value
    saveExerciseName(exerciseName)
})

const newWorkoutName = document.getElementById('newWorkoutName')
newWorkoutName.addEventListener('input', (event) => {
    let disabled = event.target.value == ''
    setButtonDisabledAttribute('newWorkoutBtn', disabled)
})

const newWorkoutBtn = document.getElementById('newWorkoutBtn')
newWorkoutBtn.addEventListener('click', (event) => {
    let workoutName = document.getElementById('newWorkoutName').value
    fetch('/api/WorkoutNames/' + workoutName + '/save', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(json => handleWorkoutNameSaveResponse(json))
})

const newWorkoutLineBtn = document.getElementById('newWorkoutLineBtn')
newWorkoutLineBtn.addEventListener('click', (event) => {
    addWorkoutLine(1,0,0,0,99);  
})

const workoutLineGrid = document.getElementById('workoutLineGrid')
workoutLineGrid.addEventListener('click', event => {
    let lineNum = event.target.parentElement.querySelector('#lineNum').value
    let workoutId = document.querySelector("#workoutList").value
    
    fetch('/api/WorkoutLines/' + workoutId+'/Delete/' + lineNum, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(json => {
        if (json.Status == 'error'){
            console.log(json.Message)
        }
        else
        {
            let deletedLine = document.getElementById('line_' + lineNum)
            deletedLine.remove();
        }
    })
})

const workoutLineGridSave = document.getElementById('workoutLineGridSave')
workoutLineGridSave.addEventListener('click', (event) => {
    let lines = createJsonFromWorkoutLines()
    let workoutId = document.querySelector("#workoutList").value

    fetch("/api/WorkoutLines/" + workoutId + "/save", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({data:lines})
    })
    .then(response => response.json())
    .then(json => {
        if (json.Status == 'ok'){
            setButtonDisabledAttribute('workoutLineGridSave', true)
        }
    })
})

function createJsonFromWorkoutLines() {
    let lines = [];
    let table = document.getElementById("workoutLineGrid");
    for (var i = 1; i < table.rows.length; i++){
        let row = table.rows[i];
        let exerciseId = parseInt(row.querySelector('#exerciseId').value)
        let sets = parseInt(row.querySelector('#sets').value)
        let reps = parseInt(row.querySelector('#reps').value)
        let weight = parseFloat(row.querySelector('#weight').value)
        let lineNum = parseInt(row.querySelector('#order').value)

        lines.push({"exercise_id": exerciseId, "sets": sets, "reps": reps, "weight": weight, "line_num": lineNum});
    }

    return lines
}

function fillExercisesList(){
    fetch('/api/ExerciseNames')
    .then(response => response.json())
    .then(json =>{
        var select = document.getElementById('exercisesList')

        json.Exercises.forEach(exercise => {
            select.appendChild(createHtmlOption(exercise.id, exercise.name))  
        });
    });
}

function fillWorkoutList(){
    fetch('/api/WorkoutNames')
    .then(response => response.json())
    .then(json => {
        var select = document.getElementById('workoutList')

        json.Workouts.forEach(workout => {
            select.appendChild(createHtmlOption(workout.id, workout.name))
        })
    })
}

function fillWorkoutLineGrid(id){
    var exercises;
    document.querySelector('#workoutLineGrid tbody').innerHTML = '';
    fetch('/api/WorkoutLines/' + id)
    .then(response => response.json())
    .then(json => {
        json.WorkoutLines.forEach(line => {
            addWorkoutLine(line.exercise_id, line.sets, line.reps, line.weight,line.lineNum);   
        })
    }) 
}

function addWorkoutLine(_exercise_id, _sets, _reps, _weight, _lineNum){
    let row = document.createElement('tr')
    row.id = 'line_' + _lineNum
    let select = createHtmlSelect(_exercise_id)
    select.addEventListener('change', () => {  setButtonDisabledAttribute('workoutLineGridSave', false) })
    row.appendChild(createHtmlTableData(select))
    row.appendChild(createHtmlTableData(createHtmlInputNumber('sets',_sets,0,1)))
    row.appendChild(createHtmlTableData(createHtmlInputNumber('reps',_reps,0,1)))
    row.appendChild(createHtmlTableData(createHtmlInputNumber('weight',_weight,0,0.1)))
    row.appendChild(createHtmlTableData(createHtmlInputNumber('order', _lineNum, 0, 1)))
    row.appendChild(createDeleteSection(_lineNum));

    document.querySelector('#workoutLineGrid tbody').appendChild(row)
}

function createDeleteSection(_lineNum){
    let dataField = document.createElement('td')
    let deleteBtn = createHtmlInputButton('deleteLineBtn','Delete')
    deleteBtn.classList.add('button')
    deleteBtn.classList.add('delete')
    dataField.appendChild(deleteBtn)

    let lineInput = document.createElement('input')
    lineInput.type = 'hidden'
    lineInput.id = 'lineNum'
    lineInput.value = _lineNum
    dataField.appendChild(lineInput)
    
    return dataField;
}

function copyExerciseListOptions(){
    let copies = []
    let options = document.querySelectorAll('#exercisesList option')
    options.forEach(option => {
        copies.push(option.cloneNode(true))
    })

    return copies
}

function setButtonDisabledAttribute(_btnId, _disabled) {
    let saveBtn = document.getElementById(_btnId)
    saveBtn.disabled = _disabled  
}

function handleWorkoutNameSaveResponse(_json) {
    if (_json.Status == 'ok') {
        clearWorkoutList()
        fillWorkoutList()

        let workoutList = document.getElementById('workoutList')
        workoutList.value = _json.Id.toString()
        fillWorkoutLineGrid(_json.Id)

        document.getElementById('newWorkoutName').value = ''
        setButtonDisabledAttribute('newWorkoutBtn', true)
    }
    else {
        console.log(_json.Message)
    }
}

function clearWorkoutList() {
    document.getElementById('workoutList').innerHTML = ''
}

function clearExerciseNameList() {
    document.getElementById('exercisesList').innerHTML = '' 
}

function saveExerciseName(_exerciseName) {
    fetch('/api/ExerciseNames/' + _exerciseName + '/save', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(json => handleExerciseNameSaveResponse(json))
}

function handleExerciseNameSaveResponse(_json) {
    if (_json.Status == 'ok') {
        clearExerciseNameList()
        fillExercisesList()
        
        document.getElementById('newExerciseName').value = ''
        setButtonDisabledAttribute('newExerciseBtn', true)
    }
    else {
        console.log(_json.Message)
    }
}
