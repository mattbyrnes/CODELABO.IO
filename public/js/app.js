$(document).ready(function () {

    function getProjects() {
        $("#projectlist").empty();
        $.get("api/project", function (data) {
            data.forEach(e => {
                $("#projectlist").append(
                    `
                    <a class="open-project" id='${e._id}' href="/edit/${e._id}">${e.name}</a><br />
                    `
                );
            });
        });
    };

    getProjects();

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
    editor.on('change', function () {
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


    // Get Save Project

    const saveProject = function (event) {
        event.preventDefault();
        const html = $("#htmlEditor").val();
        const css = $("#cssEditor").val();
        const js = $("#jsEditor").val();
        socket.emit("save-project", { html: html, css: css, js: js });
        $("#htmlEditor").val("");
        $("#cssEditor").val("");
        $("#jsEditor").val("");
    };

    $("#btn-save").on("click", saveProject);

});
