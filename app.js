import axios from "axios"

// 5xruby@aa.cc
// 123456

const token = localStorage.getItem("todo-token")

document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault()
  const email = document.querySelector("#email")
  const nickname = document.querySelector("#nickname")
  const password = document.querySelector("#password")

  if (email.value.trim() !== "" && password.value.trim() !== "") {
    const userData = {
      user: {
        email: email.value,
        nickname: nickname.value,
        password: password.value,
      },
    }

    axios.post("https://todoo.5xcamp.us/users", userData).then(({ data }) => {
      console.log(data)
    })
  }
})

document.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const email = document.querySelector("#login_email")
  const password = document.querySelector("#login_password")

  if (email.value.trim() !== "" && password.value.trim() !== "") {
    const userData = {
      user: {
        email: email.value,
        password: password.value,
      },
    }

    axios
      .post("https://todoo.5xcamp.us/users/sign_in", userData)
      .then((resp) => {
        const token = resp.headers.authorization
        localStorage.setItem("todo-token", token)
        console.log("登入成功")
        console.log(token)
      })
  }
})

document.querySelector("#checkForm").addEventListener("submit", (e) => {
  e.preventDefault()

  if (token) {
    axios
      .get("https://todoo.5xcamp.us/check", {
        headers: {
          Authorization: token,
        },
      })
      .then(({ data }) => {
        document.querySelector("#result").textContent = data.message
      })
  }
})

document.querySelector("#logoutForm").addEventListener("submit", (e) => {
  e.preventDefault()

  axios
    .delete("https://todoo.5xcamp.us/users/sign_out", {
      headers: {
        Authorization: token,
      },
    })
    .then((resp) => {
      localStorage.setItem("todo-token", "")
    })
    .catch((err) => {
      console.log(err)
    })
  // 1. 打 API
  // 2. 清 localStorage
})

document.querySelector("#todoForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const todo = document.querySelector("#todo")
  const todoData = {
    todo: {
      content: todo.value.trim(),
    },
  }
  axios
    .post("https://todoo.5xcamp.us/todos", todoData, {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => {
      const li = `<li data-id="${todo.id}"><span>X</span>${data.content}</li>`
      document.querySelector("#todos").insertAdjacentHTML("afterbegin", li)
      e.target.reset()
    })
    .catch((err) => {
      console.log(err)
    })
})

if (token) {
  axios
    .get("https://todoo.5xcamp.us/todos", {
      headers: {
        Authorization: token,
      },
    })
    .then(({ data }) => {
      const ul = document.querySelector("#todos")
      data.todos.forEach((todo) => {
        const li = `<li data-id="${todo.id}">
          <span>X</span>
          ${todo.content}
        </li>`
        ul.insertAdjacentHTML("beforeend", li)
      })
    })
}

document.querySelector("#todoForm").addEventListener("click", (e) => {
  if (e.target.nodeName === "SPAN") {
    const li = e.target.parentElement
    const id = li.dataset.id
    li.remove()
    axios.delete(`https://todoo.5xcamp.us/todos/${id}`, {
      headers: {
        Authorization: token,
      },
    })
  }
})
