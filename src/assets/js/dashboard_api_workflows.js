"use strict";

const apiEndPoints = {
  BASE_URL: "http://localhost:8082", // API Base url
  CREATED_BY: "Gaurav",
  SKILL_DATA: "master/skill", // skill Data
  JOB_DATA: "master/job", // job Data
  HRL_4_DATA: "master/hrl4", // hrl4 Data
  RM_DATA: "master/rm", // reporting Mgr SAPID Data
  PROJECT_CODE: "master/projectCode", // projectCode (Table data)
  AVAILABLE_CANDIDATES_DETAILS: "availableCandidatesDetails", // availableCandidatesDetails (Table data)
  LEADERSHIP_DASHBOARD_DETAILS: "leadershipDashboardDetails", // leadershipDashboardDetails
  SAVE_DATA: "savedata", // saveData
};

let dataTable = document.querySelector(".table__projectCode"),
  loadButton = document.querySelector(".refresh__projectCode-data"),
  dropDownList = document.querySelector(".dropdown__projectCode-list"),
  skillDropList = document.querySelector(".skillDrop"),
  jobDropList = document.querySelector(".jobDrop"),
  hrl4idDropList = document.querySelector(".hrl4idDrop"),
  shoreDropList = document.querySelector(".shoreDrop"),
  reportingMgrsapidDropList = document.querySelector(".reportingMgrsapidDrop"),
  locationDropList = document.querySelector(".locationDrop"),
  countryDropList = document.querySelector(".countryDrop"),
  assignmentStartDateInput = document.querySelector(".assignmentStartDate"),
  assignmentEndDateInput = document.querySelector(".assignmentEndDate"),
  formDetails = document.getElementById("formCandidateSelection"),
  selectedCandidate = [],
  selectedProject,
  selectedSkills = {};

const isAnyCheckboxChecked = () => {
  const checkboxes = document.querySelectorAll(".form-check-input");
  return Array.from(checkboxes).some((checkbox) => checkbox.checked);
};

// Function to GET data
const getAPIData = async (api) => {
  const resposeData = await fetch(`${apiEndPoints.BASE_URL}/${api}`);
  const data = await resposeData.json();
  return data;
};

// Function to POST data
const postDataToAPI = (api, data) => {
  // Create the options for the POST request
  const options = {
    method: "POST", // HTTP method
    headers: {
      "Content-Type": "application/json", // Specify the content type
      // You can also add other headers here, such as authentication tokens
    },
    body: JSON.stringify(data), // Convert the data to JSON format
  };
 
  // Make the POST request
  fetch(`${apiEndPoints.BASE_URL}/${api}`, options)
    .then((response) => {
      // Check if the response status is OK (200)
      if (response.ok) {
        return response.json(); // Parse the response body as JSON
      } else {
        throw new Error("Request failed"); // Handle the error
      }
    })
    .then((data) => {
      // Handle the JSON data here
      const success__saveData = document.querySelector(".success__saveData");
      success__saveData.style.display = "flex";
      success__saveData.innerHTML = `This is assigned SAP ID: ${data.assignedSapId} and transactionId: ${data.transactionId}`;
      // We Need To Add Table Data Here
      renderData();
      const params = new URLSearchParams(window.location.search);
      const filter = params.get("filter");
      const column = params.get("column");
      filterTable({}, filter, column);
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      const failed__saveData = document.querySelector(".failed__saveData");
      failed__saveData.style.display = "flex";
      failed__saveData.innerHTML = `This is assigned SAP ID: ${data.unassignedSapId} and transactionId: ${data.transactionId}`;
    });
};

const configData = async () => {
  const setAPIData = {
    availableCandidatesDetails: await getAPIData(
      apiEndPoints.AVAILABLE_CANDIDATES_DETAILS,
    ),
    projectCode: await getAPIData(apiEndPoints.PROJECT_CODE),
    leadershipDashboardDetails: await getAPIData(
      apiEndPoints.LEADERSHIP_DASHBOARD_DETAILS,
    ),
    skill: await getAPIData(apiEndPoints.SKILL_DATA),
    hrl4: await getAPIData(apiEndPoints.HRL_4_DATA),
    rm: await getAPIData(apiEndPoints.RM_DATA),
    job: await getAPIData(apiEndPoints.JOB_DATA),
  };

  return setAPIData;
};

// Function to create table cell
const createTableCell = (text) => {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
};

const generateFormList = ({ data, className, label, value }) => {
  const parentElem = document.querySelector(`.${className}`);
  console.log("data ", data);
  data.forEach((dd) => {
    const list = document.createElement("option");
    const ddKey = dd[label];
    list.innerHTML = ddKey;
    list.value = dd[value] ?? ddKey?.replaceAll(" ", "_").toLowerCase();

    parentElem.appendChild(list);
  });
};

const generateProjectListDropdown = (projectCode, listClass) => {
  projectCode.forEach((item) => {
    const list = document.createElement("li");
    list.classList.add("dropdown-item");

    const projectName = item.projectName;
    const projectCode = item.projectCode;
    const listItem = `${projectName} (${projectCode})`;

    list.innerHTML = listItem;
    list.addEventListener("click", async (event) => {
      const currentTeamStrength = document.querySelector(
        ".current-team__strength",
      );
      currentTeamStrength.innerHTML = item.projectCode;
      const projectCodeDetails = await getAPIData(
        `getByProjectCode/${item.projectCode}`,
      );

      const projectDetailsContainer = document.querySelector("#projectDetails");
      projectDetailsContainer.style.display = "flex";

      const projectDetailsForm = document.querySelector("#projectDetailsForm");
      projectDetailsForm.style.display = "flex";

      const projectName = document.querySelector(
        ".projectCodeDetails__projectName",
      );
      projectName.innerHTML = projectCodeDetails.projectName;

      const team__strength = document.querySelector(".current-team__strength");
      team__strength.innerHTML = projectCodeDetails.currentTeamStrength || 0;

      const totalCandidatesRequired = document.querySelector(
        ".projectCodeDetails__totalCandidatesRequired",
      );
      totalCandidatesRequired.innerHTML =
        projectCodeDetails.totalCandidatesRequired || 0;

      const totalFreshersDeployed = document.querySelector(
        ".projectCodeDetails__totalFreshersDeployed",
      );
      totalFreshersDeployed.innerHTML =
        projectCodeDetails.totalFreshersDeployed || 0;

      selectedProject = item;
    });

    dropDownList.appendChild(list);
  });
};

const generateEmployeeTable = (availableCandidatesDetails) => {
  availableCandidatesDetails.length &&
    availableCandidatesDetails.forEach((item) => {
      const row = document.createElement("tr");

      const sapId = createTableCell(item.sapId);
      const employeeName = createTableCell(item.employeeName);
      const employeeEmail = createTableCell(item.email);
      const employeeContactNumber = createTableCell(item.contactNo);
      const employeeLocation = createTableCell(item.location);
      const employeeBand = createTableCell(item.band);
      const employeeSkill = createTableCell(item.skill);
      const employeeGrad = createTableCell(item.gradSpecialisation);
      const employeeCollegeTier = createTableCell(item.collegeTier);
      const employeeStatus = createTableCell(item.status);

      const endDateCell = createTableCell(
        item.endDate ? item.endDate : "data not available",
      );

      // const actionCell = createTableCell(createDeleteButton(item.uid));
      const actionCell = createTableCell().appendChild(
        createDeleteButton(item.sapId),
      );

      const checkboxCell = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("form-check-input");
      const assignButton = document.querySelector(
        "button[data-bs-target='#assignProject']",
      );

      checkbox.addEventListener("change", () => {
        const isChecked = checkbox.checked;
        const row = checkbox.closest("tr");
        if (isChecked) {
          selectedCandidate.push(item);
          row.classList.add("highlight");
        } else {
          const indexItem = selectedCandidate.indexOf(item);
          selectedCandidate.splice(indexItem, 1);
          row.classList.remove("highlight");
          console.log('220----------',indexItem);
        }
        console.log('selectedCandidate --->', selectedCandidate);
        
        assignButton.disabled = !isAnyCheckboxChecked();
      });

      checkboxCell.appendChild(checkbox);

      row.appendChild(checkboxCell);
      row.appendChild(sapId);
      row.appendChild(employeeStatus);
      row.appendChild(employeeName);
      row.appendChild(employeeEmail);
      row.appendChild(employeeContactNumber);
      row.appendChild(employeeLocation);
      row.appendChild(employeeBand);
      row.appendChild(employeeSkill);
      row.appendChild(employeeGrad);
      row.appendChild(employeeCollegeTier);
      
      row.appendChild(endDateCell);
      row.appendChild(actionCell);

      dataTable.appendChild(row);
    });
};

// Function to render data in the table
const renderData = async () => {
  
  const {
    projectCode,
    availableCandidatesDetails,
    leadershipDashboardDetails,
    skill,
    hrl4,
    rm,
    job,
  } = await configData();

  const availableCandidatesDetailsCount = availableCandidatesDetails.length;
  const candidates = document.querySelector(".candidates__count");
  candidates.innerHTML = availableCandidatesDetailsCount || 0;

  const candidatesDeployed = document.querySelector(".candidates__deployed");
  candidatesDeployed.innerHTML =
    leadershipDashboardDetails.totalCandidatesDeployed || 0;

  const candidatesAvailable = document.querySelector(".candidates__available");
  candidatesAvailable.innerHTML =
    leadershipDashboardDetails.totalCandidatesAvailable || 0;

  const projectsAvailable = document.querySelector(".projects__available");
  projectsAvailable.innerHTML =
    leadershipDashboardDetails.noOfProjectsAvailable || 0;

  generateProjectListDropdown(projectCode);
  dataTable.innerHTML = "";
  generateEmployeeTable(availableCandidatesDetails);
  generateFormList({
    data: skill,
    className: "skillDrop",
    label: "skill",
    value: "skill",
  });
  generateFormList({
    data: hrl4,
    className: "hrl4idDrop",
    label: "hrL4Name",
    value: "hrL4Code",
  });
  generateFormList({
    data: rm,
    className: "reportingMgrsapidDrop",
    label: "rmName",
    value: "sapId",
  });
  generateFormList({
    data: job,
    className: "jobDrop",
    label: "job",
    value: "job",
  });
  const params = new URLSearchParams(window.location.search);
  const filter = params.get("filter");
  const column = params.get("column");
  filterTable({}, filter, column);
};

// Function to delete data
const deleteData = (uid) => {
  // Create a request configuration object
  const requestOptions = {
    method: "DELETE", // HTTP DELETE method
    headers: {
      "Content-Type": "application/json", // Specify the content type if needed
      // You might also include authentication headers if required
      // 'Authorization': 'Bearer yourAccessToken'
    },
    // You can include a request body if needed
    // body: JSON.stringify({ key: 'value' }),
  };

  // Use the Fetch API to send the DELETE request
  fetch(`${apiEndPoints.BASE_URL}/unassign/${uid}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // The request was successful
      console.log("Resource deleted successfully.");
    })
    .catch((error) => {
      // Handle errors here
      console.error("There was a problem deleting the resource:", error);
    });
};

// Function to create delete button
const createDeleteButton = (uid) => {
  const buttonDelete = document.createElement("div");
  buttonDelete.textContent = "Unassign Candidate";
  buttonDelete.classList.add("btn", "btn-sm", "btn-outline-primary", "candiadte_unassign");
  buttonDelete.onclick = function () {
    deleteData(uid);
  };
  // selectedCandidate
  return buttonDelete;
};

// Function to filter the table based on input values
function filterTable(event, value, number) {
  const params = new URLSearchParams(window.location.search);
  const filter = params.get("filter");
  const column = params.get("column");

  const eventValue = event ?  event?.target?.value?.trim().toLowerCase() : null;
  const columnvalue = event ? event?.target?.parentElement?.cellIndex: null;
  const filterValue = eventValue ?? (value || filter);
  const columnNumber = columnvalue ?? (number || column);
  console.log({filterValue, value, filter, eventValue});
  console.log({columnNumber, number, column, columnvalue});

  const rows = dataTable.getElementsByTagName("tr");
 
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cellValue = row?.children[columnNumber]?.textContent?.toLowerCase();
      
      if(filterValue) {
        row.style.display = cellValue.includes(filterValue) ? "" : "none";
      }else{
        row.style.display = "table-row";
      }
    }
    console.log('eventValue',eventValue);
  if(eventValue !== undefined){
    let currentURL = window.location.protocol + "//" + window.location.host + window.location.pathname  + '';
    // Define the query parameters as an object
    const queryParams = {
      filter: eventValue ?? '',
      column: columnvalue ?? ''
    };
  
    // Create a URLSearchParams object from the query parameters
    const searchParams = new URLSearchParams(queryParams);
    
    // Get the current URL
    // let currentURL = window.location.href;
    
    // Append the query parameters to the current URL
    currentURL += '?' + searchParams.toString();
    
    // Update the browser's URL with the modified URL
    window.history.replaceState({}, document.title, currentURL);
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
}

// const loadButton = document.querySelector('.load-table-data');
const filterInput = document.querySelectorAll(".filter-table-input");
const sendSelectedRowsButton = document.querySelector(".sendSelectedRows");

if (loadButton) {
  loadButton.addEventListener("click", () => {
    getAPIData(apiEndPoints.PROJECT_CODE);
  });
}

if (sendSelectedRowsButton) {
  sendSelectedRowsButton.addEventListener("click", () => {
    sendSelectedRows();
  });
}

if (filterInput.length) {
  filterInput.forEach((input) => {
    input.addEventListener("change", (event) => {
      event.preventDefault();
      filterTable(event);
      return;
    })
  });
}

const assignSelectedProject = document.querySelector(
  ".assign__selected-project",
);

const handleFormSubmit = (event) => {
  // Stop the form from submitting since we’re handling that with AJAX.
  event.preventDefault();
  const formData = new FormData(formDetails, event.target);
  for (const [key, value] of formData) {
    selectedSkills[key] = value;
  }
};

if (assignSelectedProject) {
  assignSelectedProject.addEventListener("click", handleFormSubmit);
}

assignSelectedProject.addEventListener("click", () => {
  let setPayload,
    sapId = [];

    console.log('selectedCandidate',selectedCandidate);
  if (selectedCandidate) {
    selectedCandidate.map((project) => {
      sapId.push(project?.sapId);
    });

    const todayDate = new Date();
    const yyyy = todayDate.getFullYear();
    let mm = todayDate.getMonth() + 1; // Months start at 0!
    let dd = todayDate.getDate();

    setPayload = {
      empSAPID: sapId,
      skill: selectedSkills.skillDrop,
      projUid: String(selectedProject.uid),
      job: selectedSkills.jobDrop,
      hrL4Id: Number(selectedSkills.hrl4idDrop),
      onOff: selectedSkills.shoreDrop,
      assignmentStartDate: selectedSkills.assignmentStartDate,
      assignmentEndDate: selectedSkills.assignmentEndDate,
      createdBy: apiEndPoints.CREATED_BY,
      // createdDate: `${yyyy}-${mm}-${dd}`,
      reportingMgrSAPID: Number(selectedSkills.reportingMgrsapidDrop),
      location: selectedSkills.locationDrop,
      country: selectedSkills.countryDrop,
      // transactionId: 84984984,
    };

    postDataToAPI(apiEndPoints.SAVE_DATA, setPayload);
  }
});

const modal = document.querySelector("#reportingMgr_modal");
if (reportingMgrsapidDropList) {
  reportingMgrsapidDropList.addEventListener("change", (event) => {
    modal.classList.add("show");
    modal.style.display = "block";
  });
}

const reportingMgrModalButton = document.querySelector(
  "#reportingMgr_modal .btn-close",
);
const reportingMgrModalCloseButton = document.querySelector(
  "#reportingMgr_modal .btn-outline-secondary",
);

const modalCloseProps = () => {
  modal.classList.remove("show");
  modal.style.display = "";
};

if (reportingMgrModalButton) {
  reportingMgrModalButton.addEventListener("click", (event) =>
    modalCloseProps(),
  );
}

if (reportingMgrModalCloseButton) {
  reportingMgrModalCloseButton.addEventListener("click", (event) =>
    modalCloseProps(),
  );
}

window.addEventListener("load", async (event) => {
  await configData();
  renderData();
});
