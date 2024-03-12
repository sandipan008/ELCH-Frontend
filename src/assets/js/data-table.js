// const apiUrl = "http://35.169.136.179:8080/master/projectCode";
const apiUrl = "http://44.217.244.93:8082/master/projectCode";
// https://44.217.244.93:8082/master/projectCode
const dataTable = document.getElementById("data-body");

// Function to fetch data

function getData() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", apiUrl);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        renderData(data);
      } else {
        console.error("Error:", xhr.status);
      }
    }
  };
  xhr.send();
}

// Function to render data in the table
function renderData(data) {
  dataTable.innerHTML = "";
  data.forEach((item) => {
    const row = document.createElement("tr");

    const uidCell = createTableCell(item.uid);
    const projectCodeCell = createTableCell(item.projectCode);
    const projectNameCell = createTableCell(item.projectName);
    const projectTypeCell = createTableCell(item.projectType.projectType);
    const projectStrengthCell = createTableCell(item.project_strength);
    const createdByCell = createTableCell(item.createdBy);
    const createdDateCell = createTableCell(item.createdDate);
    // const endDateCell = createTableCell(item.endDate);
    const endDateCell = createTableCell(
      item.endDate ? item.endDate : "data not available"
    );
    // const actionCell = createTableCell(createDeleteButton(item.uid));
    const actionCell = createTableCell().appendChild(
      createDeleteButton(item.uid)
    );

    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkboxCell.appendChild(checkbox);

    row.appendChild(checkboxCell);
    row.appendChild(uidCell);
    row.appendChild(projectCodeCell);
    row.appendChild(projectNameCell);
    row.appendChild(projectTypeCell);
    row.appendChild(projectStrengthCell);
    row.appendChild(createdByCell);
    row.appendChild(createdDateCell);
    row.appendChild(endDateCell);
    row.appendChild(actionCell);

    dataTable.appendChild(row);
  });
}

// Function to create table cell
function createTableCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

// Function to create delete button
function createDeleteButton(uid) {
  const button = document.createElement("button");
  button.textContent = "Delete";
  button.onclick = function () {
    deleteData(uid);
  };
  return button;
}

// Function to delete data
function deleteData(uid) {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${apiUrl}/${uid}`);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        getData();
      } else {
        console.error("Error:", xhr.status);
      }
    }
  };
  xhr.send();
}

// Function to filter the table based on input values
// function filterTable(column, columnNumber) {
//   const filterInput = document.getElementById(`filter-${column}`);
//   const filterValue = filterInput.value.trim().toLowerCase();

//   const rows = dataTable.getElementsByTagName('tr');
//   for (let i = 1; i < rows.length; i++) {
//     const row = rows[i];
//     console.log(filterInput,`filter-${column}`);
//     // const cellValue = row.children[column === 'projectType' ? 3 : column].textContent.toLowerCase();
//     const cellValue = row.children[column === 'projectType' ? 3 : columnNumber].textContent.toLowerCase();
//     row.style.display = cellValue.includes(filterValue) ? '' : 'none';
//   }
// }

// Function to filter the table based on input values
function filterTable(event) {
  const filterValue = event.target.value.trim().toLowerCase();
  const columnNumber = event.target.parentElement.cellIndex;

  const rows = dataTable.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cellValue = row.children[columnNumber].textContent.toLowerCase();
    row.style.display = cellValue.includes(filterValue) ? "" : "none";
  }
}

// Function to send selected rows
function sendSelectedRows() {
  const selectedRows = [];
  const projectDropdown = document.getElementById("project-dropdown");
  const selectedProject = projectDropdown.value;

  const rows = dataTable.getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const checkbox = row.querySelector('input[type="checkbox"]');

    if (checkbox.checked) {
      const uid = row.children[1].textContent;
      selectedRows.push({ uid, project: selectedProject });
    }
  }

  console.log("Selected Rows:", selectedRows);
  // Perform the necessary action with the selected rows...
}

const loadButton = document.querySelector(".load-table-data");
const filterInput = document.querySelectorAll(".filter-table-input");
const sendSelectedRowsButton = document.querySelector(".sendSelectedRows");

if (loadButton) {
  loadButton.addEventListener("click", () => {
    getData();
  });
}

if (sendSelectedRowsButton) {
  sendSelectedRowsButton.addEventListener("click", () => {
    sendSelectedRows();
  });
}

if (filterInput.length) {
  filterInput.forEach((input) => {
    input.addEventListener("change", (event) => filterTable(event));
  });
}

alert("wowow");
