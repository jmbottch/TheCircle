const User = require('../models/user');
const Activity = require('../models/activity')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/auth_config');
const cert = require('../services/certificates');

function getAll(req, res) {
    Activity.find({}, { __v: 0})
    
    .then(activities => {
      res.status(200).send(activities);
    })
    .catch(err => {
      res.status(401).send(err);
    });
}

function addActivity(author, input, cat, res) {
    console.log(input) //author is retrieved from the request body
    Activity.create({                        //input is given through UserController.addActivity(req.body.author, 'Input Message')
      userid : author,  //create the activity
      activity : input,
      category: cat  
    })
      .then(activity => {
        User.findById(author) //find the author
      .then((user) => {
        if(user === null) {
          res.status(401).send({Error: 'User does not exist'}) //if author is not found, abort
        } else {
          user.activities.push(activity) //push the created activity to the activities array of the found user
          user.save()   //save the user (very important)
        }
      })
      .catch (err => {
        console.log(err)
      })
    })
  }

  module.exports = {
      getAll,
      addActivity
  }