const db = require('../models');

module.exports = function (io) {

    io.on('connection', (socket) => {

        console.log('connected');

        socket.on('codechange', (data) => {

            db.Project.findOneAndUpdate({ _id: data._id }, { $set: data })
                .catch(err => { console.log(err) })

            io.emit('usercodechange', {
                message: data
            });
        });

    });
}

// {html:data.html, css:data.css, javascript:data.javascript}
