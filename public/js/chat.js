import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
//upload image
// const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
//     multiple: true,
//     maxFileCount: 6
// });

//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        // const images = upload.cachedFileArray;
        // console.log(images)

        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            // images: images
            e.target.elements.content.value = ""
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}
//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .inner-body")
    const boxTyping = document.querySelector(".chat .inner-list-typing")

    const div = document.createElement("div");
    let htmlFullname = "";
    if (myId == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        htmlFullname = `<div class="inner-name">${data.fullname}</div>`
        div.classList.add("inner-incoming")
    }
    div.classList.add("inner-incoming");
    div.innerHTML = `
     ${htmlFullname}
     <div class="inner-name">${data.content}</div>
    `
    body.insertBefore(div, boxTyping);
    bodyChat.scrollTop = bodyChat.scrollHeight
})

const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight
}

const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)
    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
// Insert Icon
var timeOut;

const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    }, 3000);
}
const emojiPicker = document.querySelector('emoji-picker')
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")
    emojiPicker.addEventListener('emoji-click', (event) => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;

        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end)
        inputChat.focus();

        showTyping();
    });
    //input keyup

    inputChat.addEventListener("keyup", () => {
        showTyping();
    })
}
// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing")
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const bodyChat = document.querySelector(".chat .inner-body");
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);
                boxTyping.innerHTML = `
                <div class="inner-name">${data.fullname}</div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight
            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);

            }

        }
    })
}

