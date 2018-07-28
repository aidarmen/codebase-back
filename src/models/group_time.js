const mongoose = require('mongoose')

// let newTimeValue = value['time'].map(async (time,id) =>{
                        
//     // let a = null
//     let a = await GROUP_TIME.findOne({_id: mongoose.Types.ObjectId(value['time'][id]['time_id'])}, (err, group_item) => {
//         // result[index]['time'][id]['time_id'] = 
//         //console.log(group_item)
//         time['time_id'] = group_item
//         return time;
        
        
//     })
 
//     return  a;
    
  
// })
// console.log(newTimeValue)
const GroupTimeSchema = new mongoose.Schema({
	group_id: {
		type: mongoose.Schema.ObjectId,
		ref: 'group'
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model('group_time', GroupTimeSchema)
