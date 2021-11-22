function createHtmlTableData(_childElement){
    let td = document.createElement('td')
    if (_childElement instanceof HTMLElement) {
        td.appendChild(_childElement)
    }
    else {
        td.innerText = _childElement
    }
    
    return td
}

function createHtmlOption(_value, _text){
    var opt = document.createElement('option')
    opt.value = _value
    opt.innerText = _text 

    return opt
}

function createHtmlSelect(_selectedId){
    let select = document.createElement('select')
    select.id = 'exerciseId'

    let options = copyExerciseListOptions()
    options.forEach(option => {
        select.appendChild(option)
    })

    select.value = _selectedId

    return select;
}

function createHtmlInputButton(_id, _value) {
    let btn = document.createElement('input')
    btn.type = 'button'
    btn.id = _id
    btn.value = _value

    return btn
}

function createHtmlInputNumber(_id, _value, _min, _step) {
    let num = document.createElement('input')
    num.type = 'number'
    num.id = _id
    num.value = _value
    num.min = _min
    num.step = _step
    num.addEventListener('input', () => { setButtonDisabledAttribute('workoutLineGridSave', false) })
    
    return num
}