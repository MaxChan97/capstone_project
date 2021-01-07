const router = require('express').Router();
let User = require('../models/user.model');

// Get all users
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});


// Get a user by id
router.route('/:id').get((req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});


//  Create a new user
router.route('/add').post((req, res) => {
  const username = req.body.username;
  const newUser = new User({username});

  newUser.save()
    .then(() => res.json('New User added.'))
    .catch(err => res.status(400).json('Error: ' + err));
});


// Update a user
router.route('/update/:id').patch((req, res) => {
  const id = req.params.id
  // const { username, description, duration, date } = req.body;
  const newUsername = req.body.username;

  User.findByIdAndUpdate(id, {username: newUsername})
  .then(updatedUser => res.json(updatedUser))
  .catch(err => res.status(400).json('Error: ' + err));
  
})

// Delete a user
router.route('/delete/:id').delete((req, res) => {
  const id = req.params.id

  User.findByIdAndDelete(id)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;