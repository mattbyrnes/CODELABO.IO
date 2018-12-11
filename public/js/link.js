const socket = io();
const $htmlEditor = $('#htmlEditor');
const $cssEditor = $('#cssEditor');
const $jsEditor = $('#jsEditor');
// const $iframe = $('#iframe');

const state = {
    user: '',
    codeLine: {
        html: [],
        css: [],
        js: [],
        iframe: [],
    }
}

console.log($('textarea'))
// CodeMirror.on('change', submitCode)

socket.on('code change', (data) => {
    console.log('data', data);
})

