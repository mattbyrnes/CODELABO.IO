const db = require('../models');

module.exports = function (io) {

    io.on('connection', (socket) => {

        let testObj = { 
            html: '<h1>Hello World</h1>', 
            css: '<style></style>', 
            javascript: '<script></script>', 
            name: 'Untitled Project'
        }

        db.Project.create(testObj);
        console.log('connected');

        socket.on('codechange', (data) => {

            db.Project.findByIdAndUpdate({ _id: data._id }, { $set: data })
                .catch(err => { console.log(err) })

            io.emit('codechange', {
                message: data
            });
        });

    });

    io.on('connection', function (socket) {
		socket.on('save-function', function (data) {
			db.Project.create(data)
				// .then(function (data) {
				// 	io.emit('render-project', data);
				// })
		})
	})

}

// socket.on('save-project', (d) => {}
// {html:data.html, css:data.css, javascript:data.javascript}
