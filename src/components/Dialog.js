export default function showDialog(type, title, message, detail){
    window.api.showDialog({type: type, title: title, message: message, detail: detail});
}