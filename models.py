
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(15))

    def serialize(self):
        return {"id": self.id, "name": self.name}

class Exercise(db.Model):
    __tablename__ = 'exercise'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)

    def serialize(self):
        return {"id": self.id, "name": self.name}

class Workout(db.Model):
    __tablename__ = 'workout'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

    def serialize(self):
        return {"id": self.id, "name": self.name}

class WorkoutLine(db.Model):
    __tablename__ = 'workoutline'
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'))
    lineNum = db.Column(db.Integer, autoincrement=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'))
    sets = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    weight = db.Column(db.Float)

    def serialize(self):
        return {"workout_id": self.workout_id, "lineNum": self.lineNum, "exercise_id": self.exercise_id, "sets": self.sets, "reps": self.reps, "weight": self.weight}#, "id": self.id}
