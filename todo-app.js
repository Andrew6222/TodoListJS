(function () {
  let arrTasks = [];
  let listName = "";
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.Placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);
    button.disabled = true;

    input.addEventListener("input", function () {
      if (input.value == "") {
        button.disabled = true;
      } else {
        button.disabled = false;
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = obj.name;
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    if (obj.done == true) {
      item.classList.add("list-group-item-success");
    }

    doneButton.addEventListener("click", function () {
      item.classList.toggle("list-group-item-success");
      for (let task of arrTasks) {
        if (task.id == obj.id) {
          task.done = !task.done;
        }
      }
      saveList(arrTasks, listName);
    });
    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        item.remove();
        for (let i = 0; i < arrTasks.length; i++) {
          if (arrTasks[i].id == obj.id) {
            arrTasks.splice(i, 1);
          }
        }
        saveList(arrTasks, listName);
      }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }
  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }
  function createTodoApp(container, title = "Список дел", keyName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
    listName = keyName;
    let data = localStorage.getItem(listName);
    if (data !== null && data !== "") {
      arrTasks = JSON.parse(data);
    }
    for (let itm of arrTasks) {
      let todoItem = createTodoItem(itm);
      todoList.append(todoItem.item);
    }

    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }
      let newTask = {
        id: Math.random(),
        name: todoItemForm.input.value,
        done: false,
      };

      let todoItem = createTodoItem(newTask);

      arrTasks.push(newTask);
      saveList(arrTasks, listName);

      todoList.append(todoItem.item);
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;
})();
