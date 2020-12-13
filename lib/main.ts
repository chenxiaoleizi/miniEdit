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

    handleEvent(dom){
        let _self = this;
        // fix 点击按钮时会导致可编辑区域失去焦点，没有选区，导致执行command无效
        dom.onmousedown = function(event){
            event.preventDefault()
        } 
        dom.onclick = function(event){
            _self.execCommand(event)
        };
    }
}

export default MiniEdit