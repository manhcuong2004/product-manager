// chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");
            socket.emit("CLIENT_ADD_FRIEND", userId);
        })
    })
}


// chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");
            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        })
    })
}
//chức năng từ chối
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");
            const userId = button.getAttribute("btn-refuse-friend");
            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        })
    })
}
//chấp nhạn kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accepted");
            const userId = button.getAttribute("btn-accept-friend");
            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
        })
    })
}

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUsersAccept = document.querySelector("[badge-users-accept]");
if (badgeUsersAccept) {
    const userId = badgeUsersAccept.getAttribute("badge-users-accept");
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if (userId === data.userId) {
            badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
        }
    })
}

const dataUsersAccept = document.querySelector("[data-users-accept]");
if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
        if (userId === data.userId) {
            const div = document.createElement("div");
            div.classList.add("col-6");
            div.setAttribute("user-id", data.infoUserA._id)
            div.innerHTML = `
                <div class="col-6">
                    <div class="box-user">
                    <div class="inner-avatar"><img src="" alt="">
                </div>
                <div class="inner-info">
                <div class="inner-name">${data.infoUserA.fullname}</div>
                <div class="inner-buttons">
                <button class="btn btn-sm btn-primary mr-1" 
                btn-accept-friend=${data.infoUserA._id}>Chấp nhận</button>
                <button class="btn btn-sm btn-danger mr-1"
                btn-refuse-friend=${data.infoUserA._id}>Từ chối</button>
                <button class="btn btn-sm btn-secondary mr-1" 
                btn-deleted-friend="btn-deleted-friend" 
                disabled="disabled">Đã từ chối</button>
                <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="btn-accepted-friend"
                disabled="disabled">Đã chấp nhận</button></div>
                </div>
                </div>
                </div>
                `;
            dataUsersAccept.appendChild(div)
        }
    })
}

// SERVER_RETURN_USER_TO_CANCEL_FRIEND

socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`);
    if (boxUserRemove) {
        const dataUsersAccept = document.querySelector("[data-users-accept]");
        const userIdB = badgeUsersAccept.getAttribute("badge-users-accept");
        if (userIdB === data.userIdB) {
            dataUsersAccept.removeChild(boxUserRemove);

        }
    }
})


// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_STATUS_ONLINE", (data) => {
    const dataUsersFriend = document.querySelector(`[data-users-friend]`);
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${data.userId}"]`);
        if (boxUser) {
            const boxStatus = boxUser.querySelector("[status]")
            boxStatus.setAttribute("status", data.status);
        }
    }
})