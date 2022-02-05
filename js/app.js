window.addEventListener("load", () => {
  todoMain();
  console.log("To-Do List loaded successfully.");
});

function todoMain() {
  // Input Elements
  let taskInputElem,
    dateDueInputElem,
    categoryInputElem,
    addTodoBtn,
    sortDateAddedElem,
    sortCategoryElem,
    sortCompletedElem,
    sortDateDueElem,
    showDateAddedCB,
    showTodoTaskCB,
    showCategoryCB,
    showDateDueCB,
    showCompletedCB,
    showDeleteCB;

  // HTML Table
  let todoTable;

  // Local app data
  let todoData = [];
  let sortView = [];
  let columnView = [];

  let sortElems = [];
  let columnViewElems = [];

  initApp();

  function initApp() {
    getElements();
    retrieveAppData();
    loadAppData();
    renderTable();
  }

  function getElements() {
    taskInputElem = document.getElementById("task-input");
    dateDueInputElem = document.getElementById("due-date-input");
    categoryInputElem = document.getElementById("category-input");
    addTodoBtn = document.getElementById("add-todo-btn");
    sortDateAddedElem = document.getElementById("date-added-sort-selection");
    sortCategoryElem = document.getElementById("category-sort-selection");
    sortCompletedElem = document.getElementById("completed-sort-selection");
    sortDateDueElem = document.getElementById("due-date-sort-selection");
    showDateAddedCB = document.getElementById("filterDateAddedCB");
    showCategoryCB = document.getElementById("filterCategoryCB");
    showTodoTaskCB = document.getElementById("filterTodoTaskCB");
    showDateDueCB = document.getElementById("filterDateDueCB");
    showCompletedCB = document.getElementById("filterCompletedCB");
    showDeleteCB = document.getElementById("filterDeleteCB");
    todoTable = document.getElementById("todo-table");

    sortElems = [
      sortDateAddedElem,
      sortCategoryElem,
      sortCompletedElem,
      sortDateDueElem,
    ];

    columnViewElems = [
      showDateAddedCB,
      showCategoryCB,
      showTodoTaskCB,
      showDateDueCB,
      showCompletedCB,
      showDeleteCB,
    ];

    addListeners();
  }

  function addListeners() {
    addTodoBtn.addEventListener("click", addTodo, false);
    sortDateAddedElem.addEventListener("change", recordSortState, false);
    sortCategoryElem.addEventListener("change", recordSortState, false);
    sortCompletedElem.addEventListener("change", recordSortState, false);
    sortDateDueElem.addEventListener("change", recordSortState, false);
    showDateAddedCB.addEventListener("change", recordColumnState, false);
    showTodoTaskCB.addEventListener("change", recordColumnState, false);
    showCategoryCB.addEventListener("change", recordColumnState, false);
    showDateDueCB.addEventListener("change", recordColumnState, false);
    showCompletedCB.addEventListener("change", recordColumnState, false);
    showDeleteCB.addEventListener("change", recordColumnState, false);
  }

  function addTodo() {
    let todo = {
      id: generateUUID(),
      dateAdded: new Date().toUTCString(),
      task: taskInputElem.value,
      category: categoryInputElem.value,
      dateDue: dateDueInputElem.value,
      completed: false,
    };

    todoData.push(todo);

    saveTodoData();

    taskInputElem.value = "";
    categoryInputElem.value = "";
    dateDueInputElem.value = "";

    renderTable();
  }

  function generateUUID() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  function doEach(functions) {
    functions.forEach((fn) => {
      fn();
    });
  }

  function recordSortState() {
    sortView = [
      sortDateAddedElem.value,
      sortCategoryElem.value,
      sortCompletedElem.value,
      sortDateDueElem.value,
    ];

    saveSortView();
    renderTable();
  }

  function recordColumnState() {
    columnView = [
      showDateAddedCB.checked,
      showTodoTaskCB.checked,
      showCategoryCB.checked,
      showDateDueCB.checked,
      showCompletedCB.checked,
      showDeleteCB.checked,
    ];

    saveColumnView();
    renderTable();
  }

  function saveTodoData() {
    localStorage.setItem("todoData", JSON.stringify(todoData));
  }

  function saveSortView() {
    if (sortView.length == 0) {
      sortView = [
        sortDateAddedElem.value,
        sortCategoryElem.value,
        sortCompletedElem.value,
        sortDateDueElem.value,
      ];
    }
    localStorage.setItem("sortView", JSON.stringify(sortView));
  }

  function saveColumnView() {
    if (columnView == 0) {
      columnView = [
        showDateAddedCB.checked,
        showTodoTaskCB.checked,
        showCategoryCB.checked,
        showDateDueCB.checked,
        showCompletedCB.checked,
        showDeleteCB.checked,
      ];
    }
    localStorage.setItem("columnView", JSON.stringify(columnView));
  }

  function retrieveAppData() {
    let localTodoData = localStorage.getItem("todoData");
    let localSortView = localStorage.getItem("sortView");
    let localColumnView = localStorage.getItem("columnView");

    if (localTodoData == null) saveTodoData();
    else todoData = JSON.parse(localTodoData);

    if (localSortView == null) saveSortView();
    else sortView = JSON.parse(localSortView);

    if (localColumnView == null) saveColumnView();
    else columnView = JSON.parse(localColumnView);
  }

  function loadAppData() {
    retrieveAppData();

    loadCategoryInputOptions();

    loadSortCategoryOptions();

    sortElems.forEach((elem, index) => {
      elem.value = sortView[index];
    });

    columnViewElems.forEach((elem, index) => {
      elem.checked = columnView[index];
    });
  }

  function getFilteredTodos() {
    // There's a better way to calculate order ...but how?
    let selectedCategory = sortCategoryElem.value;
    let selectedCompleted = sortCompletedElem.value;

    let filteredTodos = [];

    let filteredCategory = [];
    if (selectedCategory == "default-category-option") {
      filteredCategory = todoData;
    } else {
      filteredCategory = todoData.filter(
        (todo) => todo.category == selectedCategory
      );
    }

    filteredTodos = filteredCategory;

    let filteredCompleted = [];
    if (selectedCompleted == "Completed: Hide") {
      filteredCompleted = filteredTodos.filter(
        (todo) => todo.completed == false
      );
    } else {
      filteredCompleted = filteredTodos;
    }

    filteredTodos = filteredCompleted;

    return filteredTodos;
  }

  function getSortedTodos(todoList) {
    let sortedTodos = [...todoList];

    if (sortDateAddedElem.value == "Date Added: First") {
      sortedTodos.sort((todoA, todoB) => {
        let dateA = Date.parse(todoA.dateAdded);
        let dateB = Date.parse(todoB.dateAdded);
        return dateA - dateB;
      });
    }

    if (sortDateAddedElem.value == "Date Added: Last") {
      sortedTodos.sort((todoA, todoB) => {
        let dateA = Date.parse(todoA.dateAdded);
        let dateB = Date.parse(todoB.dateAdded);
        return dateB - dateA;
      });
    }

    // Under construction
    if (sortCompletedElem.value == "Completed: Top") {
      sortedTodos.sort((todoA, todoB) => {
        if (!todoA.completed && todoB.completed) return 1;
        else if (todoA.completed && !todoB.completed) return -1;
        else return 0;
      });
    }

    if (sortCompletedElem.value == "Completed: Bottom") {
      sortedTodos.sort((todoA, todoB) => {
        if (!todoA.completed && todoB.completed) return -1;
        else if (todoA.completed && !todoB.completed) return 1;
        else return 0;
      });
    }

    if (sortDateDueElem.value == "Date Due: First") {
      sortedTodos.sort((todoA, todoB) => {
        let dateA = Date.parse(todoA.dateDue);
        let dateB = Date.parse(todoB.dateDue);
        return dateA - dateB;
      });
    }

    if (sortDateDueElem.value == "Date Due: Last") {
      sortedTodos.sort((todoA, todoB) => {
        let dateA = Date.parse(todoA.dateDue);
        let dateB = Date.parse(todoB.dateDue);
        return dateB - dateA;
      });
    }

    return sortedTodos;
  }

  function renderTable() {
    let todos = getSortedTodos(getFilteredTodos(todoData));

    clearTable();

    renderTableHead();

    todos.forEach((todo) => {
      renderRow(todo);
    });

    hideColumns();
  }

  function clearTable() {
    todoTable.innerHTML = "";
  }

  function renderTableHead() {
    clearTable();

    let headerRow = document.createElement("tr");
    let dateAddedColumn = document.createElement("th");
    let taskColumn = document.createElement("th");
    let categoryColumn = document.createElement("th");
    let dateDueColumn = document.createElement("th");
    let completedColumn = document.createElement("th");
    let deleteColumn = document.createElement("th");

    dateAddedColumn.innerText = "Date Added";
    taskColumn.innerText = "To-Do Task";
    categoryColumn.innerText = "Category";
    dateDueColumn.innerText = "Date Due";
    completedColumn.innerText = "Completed";
    deleteColumn.innerText = "Delete";

    headerRow.id = "todo-table-header";
    dateAddedColumn.classList.add("column-date-added");
    taskColumn.classList.add("column-todo-task");
    categoryColumn.classList.add("column-category");
    dateDueColumn.classList.add("column-date-due");
    completedColumn.classList.add("column-completed");
    deleteColumn.classList.add("column-delete");

    headerRow.appendChild(dateAddedColumn);
    headerRow.appendChild(taskColumn);
    headerRow.appendChild(categoryColumn);
    headerRow.appendChild(dateDueColumn);
    headerRow.appendChild(completedColumn);
    headerRow.appendChild(deleteColumn);

    todoTable.appendChild(headerRow);
  }

  function renderRow(todo) {
    let newRow = document.createElement("tr");
    newRow.classList.add("todo-row");
    newRow.dataset.id = todo.id;

    // Create Cells
    let dateAddedCell = document.createElement("td");
    let dateDueCell = document.createElement("td");
    let categoryCell = document.createElement("td");
    let taskCell = document.createElement("td");
    let completedCell = document.createElement("td");
    let deleteCell = document.createElement("td");

    dateAddedCell.classList.add("column-date-added");
    dateDueCell.classList.add("column-date-due");
    categoryCell.classList.add("column-category");
    taskCell.classList.add("column-todo-task");
    completedCell.classList.add("column-completed");
    deleteCell.classList.add("column-delete");

    // Date Added:
    let dateAddedSpan = document.createElement("span");
    dateAddedSpan.classList.add("date-added-span");
    let dateAddedObj = new Date(todo.dateAdded);
    dateAddedSpan.innerText = dateAddedObj.toLocaleDateString();

    // Date Due :
    let dateDueSpan = document.createElement("span");
    dateDueSpan.classList.add("date-due-span");
    if (todo.dateDue == "") dateDueSpan.innerText = todo.dateDue;
    else {
      // Format date from input
      let year = todo.dateDue.substring(0, 4);
      let month = todo.dateDue.substring(5, 7);
      let day = todo.dateDue.substring(8, 10);
      if (month[0] == "0") month = month.substring(1, 2);
      if (day[0] == "0") day = day.substring(1, 2);
      dateDueSpan.innerText = month + "/" + day + "/" + year;
    }

    // Category:
    let categorySpan = document.createElement("span");
    dateAddedSpan.classList.add("category-span");
    categorySpan.innerText = todo.category;

    // To-Do Task:
    let taskSpan = document.createElement("span");
    taskSpan.classList.add("task-span");
    taskSpan.innerText = todo.task;

    // Completed:
    let completedSpan = document.createElement("span");
    let completedCheckbox = document.createElement("input");
    completedCheckbox.type = "checkbox";
    completedCheckbox.classList.add("completed-checkbox");
    completedCheckbox.checked = todo.completed;
    completedCheckbox.addEventListener("click", toggleCompleted, false);
    completedSpan.appendChild(completedCheckbox);

    // Delete:
    let deleteSpan = document.createElement("span");
    deleteSpan.innerHTML = "close";
    deleteSpan.classList.add("material-icons");
    deleteSpan.classList.add("delete-todo-btn");
    deleteSpan.addEventListener("click", promptDeleteMessage, false);

    // Add elements to cells
    dateAddedCell.appendChild(dateAddedSpan);
    dateDueCell.appendChild(dateDueSpan);
    categoryCell.appendChild(categorySpan);
    taskCell.appendChild(taskSpan);
    completedCell.appendChild(completedSpan);
    deleteCell.appendChild(deleteSpan);

    // Add cells to row
    newRow.appendChild(dateAddedCell);
    newRow.appendChild(taskCell);
    newRow.appendChild(categoryCell);
    newRow.appendChild(dateDueCell);
    newRow.appendChild(completedCell);
    newRow.appendChild(deleteCell);

    // Add new row to table
    document.getElementById("todo-table").appendChild(newRow);

    // Row Functions
    function toggleCompleted() {
      for (let i = 0; i < todoData.length; i++) {
        if (todoData[i].id == todo.id) {
          todoData[i].completed = completedCheckbox.checked;
          saveTodoData();
        }
      }
    }

    function promptDeleteMessage() {
      if (confirm("Delete?")) {
        deleteTodo();
      }
    }

    function deleteTodo() {
      for (let i = 0; i < todoData.length; i++) {
        if (todoData[i].id == todo.id) {
          todoData.splice(i, 1);
          saveTodoData();
          renderTable();
        }
      }
    }
  }

  function hideColumns() {
    let showDateAdded = showDateAddedCB.checked;
    let showTodoTask = showTodoTaskCB.checked;
    let showCategory = showCategoryCB.checked;
    let showDateDue = showDateDueCB.checked;
    let showCompleted = showCompletedCB.checked;
    let showDelete = showDeleteCB.checked;

    let tableRows = todoTable.getElementsByTagName("tr");

    Array.from(tableRows).forEach((row) => {
      Array.from(row.children).forEach((column) => {
        if (column.classList.contains("column-date-added") && !showDateAdded)
          column.remove();

        if (column.classList.contains("column-date-added") && !showDateAdded)
          column.remove();

        if (column.classList.contains("column-todo-task") && !showTodoTask)
          column.remove();

        if (column.classList.contains("column-category") && !showCategory)
          column.remove();

        if (column.classList.contains("column-date-due") && !showDateDue)
          column.remove();

        if (column.classList.contains("column-completed") && !showCompleted)
          column.remove();

        if (column.classList.contains("column-delete") && !showDelete)
          column.remove();
      });
    });
  }

  function loadCategoryInputOptions() {
    let prevOptions = document.getElementById("category-input-list").options;
    Array.from(prevOptions).forEach((option) => {
      option.remove();
    });

    for (let option of getCategoryOptions()) {
      categoryInputElem.appendChild(createCategoryOption(option));
    }
  }

  function loadSortCategoryOptions() {
    Array.from(sortCategoryElem.options).forEach((option, index) => {
      if (index != 0) option.remove();
    });

    for (let option of getCategoryOptions()) {
      sortCategoryElem.appendChild(createCategoryOption(option));
    }
  }

  function createCategoryOption(optionName) {
    let newOption = document.createElement("option");
    newOption.value = optionName;
    newOption.innerText = optionName;
    return newOption;
  }

  function getCategoryOptions() {
    let options = [];

    todoData.forEach((todo) => {
      options.push(todo.category);
    });

    return new Set(options);
  }
}
