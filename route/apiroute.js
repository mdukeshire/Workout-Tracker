const router = require('express').Router();
const { Router } = require('express');
const path = require('path');
const workout = require('../models/workouts');

router.get('/exercise', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/exercise.html'));
});

router.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/stats.html'));
});

router.get('/api/workouts', (req, res) => {
    workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: '$exercises.duration'
                }
            }
        }
    ]).then((workoutInfo) => {
        res.json(workoutInfo);
    }).catch((err) => {
        res.json(err);
    })
});

router.put('/api/workout/:id', (req, res) => {
    workout.findByIdAndUpdate(req.params.id,
        {
            $push: {
                exercises: req.body,
            }
        }, { new: true })
        .then((updatedExercise) => {
            console.log(updatedExercise)
            res.json(updatedExercise);
        }).catch((err) => {
            res.json(err);
        })
});

router.post('/api/workouts', (req, res) => {
    workout.create()
    .then((newWorkout) => {
        res.json(newWorkout);
    }) .catch((err) => {
        res.json(err);
    })
    
});

router.get("/api/workouts/range", (req, res) => {
    Workout.find().limit(7)
      .then((previousWorkouts) => {
        res.json(previousWorkouts);
      })
      .catch((err) => {
        res.json(err);
      });
  });

module.exports = router;