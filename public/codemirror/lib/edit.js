$(document).ready(function () {

  const socket = io();

  var code = $("#htmlEditor")[0];
  var cssCode = $("#cssEditor")[0];
  var jsCode = $("#jsEditor")[0];

  // Socket Stuff //

  // const submitCode = function (e, fileType) {
  //   const html = $htmlEditor.val(e)
  //   const css = $cssEditor.val(e)
  //   const js = $(this).val(e)

  //   socket.emit('codechange', {
  //     html: html,
  //     css: css,
  //     js: js
  //   })
  // };


  //Get ALL Projects and List in Finder
  const getAllProjects = function () {
    $.getJSON('/api/project')
      .then(function (data) {
        const projectItem = data.map((e) =>
          `
              <a class="open-project" id='${e._id}' href="/edit/${e._id}">${e.name}</a><br />
              <p><input id="${e._id}" class="" value="${e.name}"></input></p>
              `
        )
        $('#projectlist').html(projectItem);
        $('.fa-times').on('click', deleteDoc);
      })
  };
  getAllProjects();

  // Get Selected Project and Display in Editor
  var url = window.location.href;
  var projectId = url.split("/");
  var projectId = projectId[4];

  const getDoc = function () {
    $.ajax({ url: `/api/project/${projectId}`, method: "GET" }).then(function (dbLoad) {
      let docBody = $.parseHTML(dbLoad.docContent);
      const docItem = (
        `
        <form>
        <div class="edit-col">
          <h2 id="project-title">${dbLoad.name}</h2> 
          <textarea id="htmlEditor">${dbLoad.html}</textarea>
          <textarea id="cssEditor">${dbLoad.css}</textarea>
          <textarea id="jsEditor">${dbLoad.javascript}</textarea>
        </div>

        <div class="preview-col">
          <Label>Preview</label>
          <iframe id="preview"></iframe>
        </div>
        </form>
        <form>
          <div class="docArea" contenteditable="true" id ="bodyDoc" value=""></div>
          <input type="hidden" id="input-content" />
        </form>
        
        `
        );

    $('#gdocEdit').html(docItem);
    $('#bodyDoc').html(docBody)
    $('#saveNew').on('click', createDoc);
    $('#updateNew').on('click', updateDoc);
  })
};

getDoc();
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

});


  // Save Project
  // const saveProject = function (event) {
  //   event.preventDefault();
  //   const html = $("#htmlEditor").val();
  //   const css = $("#cssEditor").val();
  //   const js = $("#jsEditor").val();
  //   socket.emit("save-project", { html: html, css: css, js: js });
  //   $("#htmlEditor").val("");
  //   $("#cssEditor").val("");
  //   $("#jsEditor").val("");
  // };

  // $("#btn-save").on("click", saveProject);


  //Create Project
  // const createProject = function () {
  //     console.log('Create');
  //     let projectBody = $('#input-project').map(function(){return $('#bodyProject').html() }).get()
  //     let projectStrng = projectBody[0];
  //     const newProject = {
  //         projectTitle: $('#input-project').val(),
  //         projectContent: projectStrng
  //     };
  //     $.ajax({ url: '/add', method: 'POST', data: newProject }).then(function (res) {
  //     });
  //   };

  //   createProject();

  //Update Doc
  // const updateDoc = function () {
  //     const id = docId;
  //     let divBodyUpdt = $('#input-content').map(function(){return $('#bodyDoc').html() }).get()
  //     let bodyStrngUpdt = divBodyUpdt[0];
  //     var upDocument = {
  //         docId: id,
  //         docTitle: $('#input-title').val(),
  //         docContent: bodyStrngUpdt
  //     };
  //     console.log($('#input-content').val());
  //     $.ajax({ url: `/api/update/${id}`, method: 'PUT', data: upDocument }).then(function (res) {
  //         console.log(id);
  //         console.log(upDocument);
  //     });
  // };
