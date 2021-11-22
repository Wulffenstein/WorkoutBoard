document.addEventListener('DOMContentLoaded', () => {
    createWorkoutSelection("bineWorkout");
    createWorkoutSelection("andersWorkout");
    
    updateWorkoutTable('#bineTable > tbody', 1); //TODO: Use default value from select instead of hardcoded value 1
    updateWorkoutTable('#andersTable > tbody', 1); //TODO: Use default value from select instead of hardcoded value 1
})

const bineWorkout = document.getElementById('bineWorkout')
bineWorkout.addEventListener('change', event => {
    let id = event.target.value;
    updateWorkoutTable('#bineTable > tbody',id);
})

const andersWorkout = document.getElementById('andersWorkout')
andersWorkout.addEventListener('change', event => {
    let id = event.target.value;
    updateWorkoutTable('#andersTable > tbody',id);
})

function updateWorkoutTable(_tableBodySelector, _workoutId) {
    let tableBody = document.querySelector(_tableBodySelector)
    tableBody.innerHTML = ''
    fetch('/api/WorkoutLines/' + _workoutId)
    .then(response => response.json())
    .then(json => {
        var lineNum = 0
        json.WorkoutLines.forEach(line => {
            lineNum++
            let row = document.createElement('tr')
            row.appendChild(createHtmlTableData(lineNum))
            row.appendChild(createHtmlTableData(line.sets + ' x ' + line.reps))
            row.appendChild(createHtmlTableData(line.name))
            row.appendChild(createHtmlTableData(line.weight))

            if (lineNum % 2 == 1)
            {
                row.classList.add("evenLine");
            }

            document.querySelector(_tableBodySelector).appendChild(row)
        })
    })    
}

function createWorkoutSelection(_selectId){
    fetch('/api/WorkoutNames')
    .then(response => response.json())
    .then(json => {
        var select = document.getElementById(_selectId)

        json.Workouts.forEach(workout => {
            select.appendChild(createHtmlOption(workout.id, workout.name))
        })
    })
}
