const mongoose = require('mongoose');

const schema = mongoose.Schema({
    
    name: {
        type: 'String',
        required: true,
    },
    lastname:{
        type:'String',
        require:true,
    },
    age:{
        type:'Number',
        require: true,
    },
    password:{
        type:'String',
        require: true,
    },
    email:{
        type:'String',
        require:true,
    },
    timestamp:{
        type: 'Date',
        default: new Date(),
    }
});

const Customer = mongoose.model('customer', schema);
module.exports = Customer