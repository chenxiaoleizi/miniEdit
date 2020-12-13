interface Command {
    command: string;
    text: string;
    values?: Array<string | any>
}

const commander: Array<Command> = [
    {
        command: "bold",
        text: "B"
    },
    {
        command: "forecolor",
        text: "C",
        values: [
            "skyblue",
            "orange",
            "green"
        ]
    },
    {
        command: "fontSize",
        text: "H",
        values: [
            {
                text: "h1",
                value: "7"
            },
            {
                text: "h2",
                value: "6"
            },
            {
                text: "h3",
                value: "5"
            },
            {
                text: "h4",
                value: "4"
            }
        ]
    }
]

function createElem(type: string, className?){
    let dom = document.createElement(type);
    dom.className = className || "";
    return dom
}

let cachedRange: any = null;


class MiniEdit {
    constructor(dom) {
        let editBox = document.getElementById(dom);

        let miniEdit = createElem("div", "mini-edit");

        let editHeader = createElem("div", "mini-edit-header");
        // create command button
        commander.forEach(command => {
            let commandButton = this.createCommandButton(command);
            editHeader.appendChild(commandButton)
        })
 
        let editContent = createElem("div", "mini-edit-content");
        editContent.contentEditable = "true";
        editContent.onmouseleave = this.handleMosueLeave;
        
        miniEdit.appendChild(editHeader)
        miniEdit.appendChild(editContent)
        editBox.appendChild(miniEdit)
    }

    createCommandButton(command: Command) {
        let _self = this;
        let commandButton = createElem("div", "mini-edit-command");

        let textButton = createElem("div");
        textButton.innerText = command.text;
        commandButton.appendChild(textButton)

        if (command.values) {
            let valueButtons = createElem("div", "mini-edit-command-values");
            command.values.forEach(function(value){
                let valueButton = createElem("div", "mini-edit-command-value");
                
                let cmdText = "";
                let cmdVal = ""
                if (typeof value === "string") {
                    cmdText = value;
                    cmdVal = value
                } else {
                    cmdText = value.text;
                    cmdVal = value.value
                }
                valueButton.innerHTML = cmdText;
                valueButton.setAttribute("command", command.command)
                valueButton.setAttribute("command-value", cmdVal)

                _self.handleEvent(valueButton)

                valueButtons.appendChild(valueButton)
            })
            commandButton.appendChild(valueButtons)
        } else {
            textButton.setAttribute("command", command.command)
            _self.handleEvent(textButton)
        }

        return commandButton
    }

    execCommand(event) {
        let command = event.target.getAttribute("command");
        let value = event.target.getAttribute("command-value");
        document.execCommand(command, false, value || null);
    }

    handleMosueLeave(event){
        let selObj = window.getSelection();
        // 鼠标leave时，缓存当前的选区，isCollapsed为false表示有选取，false表示的知识当前的焦点在可编辑区域
        if (!selObj.isCollapsed) {
            cachedRange  = selObj.getRangeAt(0);
        }
    }

    handleEvent(dom){
        let _self = this;
        // fix 点击按钮时会导致可编辑区域失去焦点，没有选区，导致执行command无效
        // 另外可以使用getSelection API对选区进行缓存，当执行命令前，先回复原来的选区
        dom.onmousedown = function(event){
            // event.preventDefault()
        } 
        dom.onclick = function(event){
            var selObj = window.getSelection();
            // 先清除掉选区
            selObj.removeAllRanges()
            // 再使用缓存的range
            selObj.addRange(cachedRange)

            _self.execCommand(event)
        };
    }
}

export default MiniEdit