const router = require("express").Router();
const Exercise = require("../models/workout.js");
const path = require('path');

router.post("/api/exercise", ({ body }, res) => {
  Exercise.create(body)
    .then(dbExercise => {
      res.json(dbExercise);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/api/exercise/bulk", ({ body }, res) => {
  Exercise.insertMany(body)
    .then(dbExercise => {
      res.json(dbExercise);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/api/workouts", (req, res) => {
  Exercise.aggregate([
    {
      $addFields:{
        totalDuration: {
          $sum: '$exercises.duration'
        }
      }
    }
  ])
    .then(dbExercise => {
      res.json(dbExercise);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.put("/api/workouts/:id", (req, res) => {
  Exercise.findByIdAndUpdate(req.params.id, {$push:{exercises:req.body}}, {new: true})
  .then(dbExercise => {
    res.json(dbExercise);
  })
  .catch(err => {
    res.status(400).json(err);
  })
}); 

router.post("/api/workouts", async (req, res) => {
  try {
    const exercise = new Exercise({})
    await exercise.save()
    res.send(exercise);
  } catch(err) {
    res.status(400).json(err)
  }
});


router.get("/api/workouts/range", (req, res) => {
  
  Exercise.aggregate([
    {
      $addFields:{
        totalDuration: {
          $sum: '$exercises.duration'
        },
      },
    },
  ])
  .sort({ _id: -1 })
  .limit(7)
  .then(exercise => {
    res.status(200).json(exercise);
  })
  .catch(err => {
    res.status(400).json(err);
  })
});

router.get('/exercise', (req,res) => {
  try {
    res.sendFile(path.join(__dirname, '../public/exercise.html'));
  } catch (err) {
    res.status(500).json(err)
  };
});

router.get('/stats', (req,res) => {
  try {
    res.sendFile(path.join(__dirname, '../public/stats.html'));
  } catch (err) {
    res.status(500).json(err)
  };
});



module.exports = router;