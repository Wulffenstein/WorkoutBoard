from  models import User,Exercise,WorkoutLine,Workout

class TestData:

    #def initAll(self,_db):
    #    self.clearTables()
    #    self.createTestData(_db)

    def clearTables(self):
        Exercise.query.delete()
        User.query.delete()
        Workout.query.delete()
        WorkoutLine.query.delete()

    def createTestData(self,_db):
        anders = User(name='Anders')
        bine = User(name='Bine')
        _db.session.add(anders)
        _db.session.add(bine)
        _db.session.commit()

        pullup = Exercise(name='Pullup')
        benchpress = Exercise(name='Bench press')
        situp = Exercise(name='Situp')
        bicepCurl = Exercise(name='Bicep curl')
        lunge = Exercise(name='Lunge')
        _db.session.add(pullup)
        _db.session.add(benchpress)
        _db.session.add(bicepCurl)
        _db.session.add(situp)
        _db.session.add(lunge)

        workout1 = Workout(name='Workout 1')
        workout2 = Workout(name='Workout 2')
        _db.session.add(workout1)
        _db.session.add(workout2)
        _db.session.commit()

        line11 = WorkoutLine(workout_id=workout1.id, lineNum=1, exercise_id=pullup.id, sets=4, reps=2, weight=0)
        line12 = WorkoutLine(workout_id=workout1.id, lineNum=2, exercise_id=benchpress.id, sets=3, reps=8, weight=25)
        line13 = WorkoutLine(workout_id=workout1.id, lineNum=3, exercise_id=bicepCurl.id, sets=5, reps=6, weight=22)
        _db.session.add(line11)
        _db.session.add(line12)
        _db.session.add(line13)

        line21 = WorkoutLine(workout_id=workout2.id, lineNum=1, exercise_id=situp.id, sets=3, reps=20, weight=0)
        line22 = WorkoutLine(workout_id=workout2.id, lineNum=2, exercise_id=lunge.id, sets=4, reps=10, weight=8)
        line23 = WorkoutLine(workout_id=workout2.id, lineNum=3, exercise_id=benchpress.id, sets=5, reps=6, weight=40)
        _db.session.add(line21)
        _db.session.add(line22)
        _db.session.add(line23)

        _db.session.commit()