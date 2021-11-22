from flask import Blueprint, request
from models import User, Workout, WorkoutLine, Exercise
from models import db
from api.response import Response

api = Blueprint("api", __name__)

@api.route("/WorkoutNames")
def workoutNames():
    names = []
    workouts = Workout.query.all()
    for workout in workouts:
        names.append(workout.serialize())

    return {"Workouts": names}   

@api.route('/WorkoutNames/<_workoutName>/save', methods=["POST"])
def saveWorkoutName(_workoutName):
    workout = Workout()
    workout.name = _workoutName

    try:
        db.session.add(workout)
        db.session.commit()

        response = Response.Ok(workout.id)
    except Exception as exc:
        response =  Response.Error(str(exc)) 

    return response


@api.route("/UserNames")
def userNames():
    users = User.query.all()
    print("Users:")
    print(users)
    return {"Users": users}

@api.route("/ExerciseNames")
def exerciseNames():
    exercises = Exercise.query.order_by(Exercise.name).all()
    names = [exercise.serialize() for exercise in exercises]

    return {"Exercises": names}

@api.route("/ExerciseNames/<_exerciseName>/save", methods=["POST"])
def saveExerciseName(_exerciseName):
    exercise = Exercise()
    exercise.name = _exerciseName

    try:
        db.session.add(exercise)
        db.session.commit()

        response = Response.Ok(exercise.id)
    except Exception as exc:
        response =  Response.Error(str(exc)) 

    return response

@api.route("/WorkoutLines/<int:_workout_id>")
def workoutLines(_workout_id):
    workoutLines = WorkoutLine.query.filter_by(workout_id=_workout_id).order_by(WorkoutLine.lineNum).all()
    lines = []
    for workoutLine in workoutLines:
        exercise = Exercise.query.get(workoutLine.exercise_id)
        line = workoutLine.serialize()
        line["name"] = exercise.name
        lines.append(line)

    return {"WorkoutLines": lines }

@api.route("/WorkoutLines/<int:_workout_id>/save", methods=["POST"])
def saveWorkoutLines(_workout_id):
    json = request.get_json()

    for line in json['data']:
        insert = False
        workoutLine = WorkoutLine.query.filter_by(workout_id=_workout_id,lineNum=line['line_num']).first()
        if workoutLine is None:
            workoutLine = WorkoutLine()
            workoutLine.workout_id = _workout_id
            insert = True
        
        workoutLine.exercise_id = line['exercise_id']
        workoutLine.sets = line['sets']
        workoutLine.reps = line['reps']
        workoutLine.weight = line['weight']
        workoutLine.lineNum = line['line_num']

        if insert == True:
            db.session.add(workoutLine)

        db.session.commit()              
    
    return Response.Ok(workoutLine.id)

@api.route("/WorkoutLines/<int:_workout_id>/Delete/<int:_line_num>", methods=["POST"])
def workoutLinesDelete(_workout_id,_line_num):
    if _line_num >= 0 and _workout_id >= 0:
        workoutLine = WorkoutLine.query.filter_by(workout_id=_workout_id,lineNum=_line_num).first()
        db.session.delete(workoutLine)
        db.session.commit()

        return Response.Ok()

    return Response.Error("Workout Id and Line number cannot be less than 0")
    