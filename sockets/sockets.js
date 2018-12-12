const db = require('../models');

module.exports = function (io) {
let dbID;
    io.on('connection', (socket) => {
        let testObj = {
            html: '',
            css: '',
            javascript: '',
            name: ''
        }
        socket.on('codechange', (data) => {
            db.Project.find({})
            .then(allData =>{
                if(allData.length == 0){
                    db.Project.create(testObj)
                    .then( firstAndOnlyEntry => {
                        dbID = firstAndOnlyEntry._id
                    })
                } else { 
                    dbID = allData[0]._id
                    db.Project.findByIdAndUpdate({ _id: dbID }, { $set: data })
                    .catch(err => { console.log(err) })

                }
            })
            .catch(err => {console.log(err)})
        });

    });
}

// {html:data.html, css:data.css, javascript:data.javascript}