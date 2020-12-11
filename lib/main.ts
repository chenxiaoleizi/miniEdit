let textColor:string = "chenlei "

class MiniEdit {
    constructor(dom){
        let editBox = document.getElementById(dom);
        let miniEdit = document.createElement("div");
        miniEdit.className = "mini-edit";

        editBox.appendChild(miniEdit)
    }
}

export default MiniEdit