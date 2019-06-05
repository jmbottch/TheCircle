const Message = require('../models/message');


function getAll(req, res) {
    Message.find({})
        .then(messages => {
            res.status(200).send(messages);
        })
        .catch(err => {
            res.status(401).send(err);
        })
} 

  function post (req, res) {
    try{
        var message = new Message(req.body);
    
        var savedMessage =  message.save()
          console.log('saved');
    
        var censored =  Message.findOne({message:'badword'});
          if(censored)
             Message.remove({_id: censored.id})
          else
            io.emit('message', req.body);
          res.sendStatus(200);
      }
      catch (error){
        res.sendStatus(500);
        return console.log('error',error);
      }
      finally{
        console.log('Message Posted')
      }
};

  module.exports = {
    getAll,
    post
}