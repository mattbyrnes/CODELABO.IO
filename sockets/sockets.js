const db = require('../models');

module.exports = function (io) {

    io.on('connection', (socket) => {
        
        let projectData = { 
            html: '<h1>Hello World</h1>', 
            css: '<style></style>', 
            javascript: '<script></script>', 
            name: 'Untitled Project'
        }

        db.Project.create(projectData);
        console.log('connected');

        socket.on('codechange', (data) => {

            db.Project.findByIdAndUpdate({ _id: data._id }, { $set: data })
                .catch(err => { console.log(err) })

            io.emit('codechange', {
                message: data
            });
        });

    });
}

// {html:data.html, css:data.css, javascript:data.javascript}
