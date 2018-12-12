$(document).ready(function () {

    var url = window.location.href;
    var projectId = url.split("/");
    var projectId = projectId[4];
    console.log(projectId);

    const createProject = function (e) {
        e.preventDefault()
        console.log("clicked")
        let testObj = { 
            html: '<h1>Hello World</h1>', 
            css: '<style></style>', 
            javascript: '<script></script>', 
            name: 'Untitled Project'
        }

        // let divBody = $('#input-content').map(function () { return $('#bodyDoc').html() }).get()
        // let bodyStrng = divBody[0];
        // const newDocument = {
        //     docTitle: $('#input-title').val(),
        //     docContent: bodyStrng
        // };

        // localStorage.setItem('doczAutoSave' + document.location, newDocument)
        $.post({ url: '/add', method: 'POST', data: testObj }).then(function (res) {
            console.log(res)
        });

    }

    $("#btn-create").click(createProject);


    const socket = io();

    var code = $("#htmlEditor")[0];
    var cssCode = $("#cssEditor")[0];
    var jsCode = $("#jsEditor")[0];

    const submitCode = function (e, fileType) {
        const html = $htmlEditor.val()
        const css = $cssEditor.val()
        const js = $(this).val()
        console.log(js)

        socket.emit('codechange', {
            user: state.user,
            html: html,
            css: css,
            js: js,
            iframe: iframe
        })
    };

    // HTML Editor
    var editor = CodeMirror.fromTextArea(code, {
        mode: "xml",
        theme: "monokai",
        lineNumbers: true,
        autoCloseTags: true,
        lineWrapping: true,
        extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });
    editor.on('keyup', function (e) {
        // e.preventDefault();
        clearTimeout(delay);
        delay = setTimeout(updatePreview, 300);
        var msg = {
            html: editor.getValue()
        };
        socket.emit("codechange", msg);
    });

    // CSS Editor
    var editorCSS = CodeMirror.fromTextArea(cssCode, {
        mode: "css",
        theme: "monokai",
        lineNumbers: true,
        autoCloseTags: true,
        lineWrapping: true,
        extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });
    editorCSS.on('change', function () {
        clearTimeout(delay);
        delay = setTimeout(updatePreview, 300);
        var msg = {
            css: editorCSS.getValue()
        };
        socket.emit("codechange", msg);
    });

    // JS Editor
    var editorJS = CodeMirror.fromTextArea(jsCode, {
        mode: "javascript",
        theme: "monokai",
        lineNumbers: true,
        autoCloseTags: true,
        lineWrapping: true,
        extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });
    editorJS.on('change', function () {
        clearTimeout(delay);
        delay = setTimeout(updatePreview, 300);
        var msg = {
            javascript: editorJS.getValue()
        };
        socket.emit("codechange", msg);
        updateEditor(editorJS, msg)
    });

    // Preview
    var delay;

    function updatePreview() {
        var previewFrame = document.getElementById('preview');
        var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
        preview.open();

        preview.write(editor.getValue());
        preview.write(editorCSS.getValue());
        preview.write(editorJS.getValue());

        preview.close();
    }
    setTimeout(updatePreview, 300);
    
    socket.on('usercodechange', (data) => {
         e.preventDefault();
        console.log("codechange data", data.message.html)
        editor.setValue(data.message.html)
    })

});
