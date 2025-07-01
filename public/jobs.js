import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  enableInput,
  token,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let jobsDiv = null;
let jobsTable = null;
let jobsTableHeader = null;

export const handleJobs = () => {
  jobsDiv = document.getElementById("jobs");
  const logoff = document.getElementById("logoff");
  const addJob = document.getElementById("add-job");
  jobsTable = document.getElementById("jobs-table");
  jobsTableHeader = document.getElementById("jobs-table-header");

  jobsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addJob) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        jobsTable.replaceChildren(jobsTableHeader);
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        const jobId = e.target.dataset.id;
        showAddEdit(jobId);
      } else if (e.target.classList.contains("deleteButton")) {
        const jobId = e.target.dataset.id;

        try {
          enableInput(false);

          const response = await fetch(`/api/v1/jobs/${jobId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          let data = {};
          try {
            data = await response.json();
          } catch {
            data.msg = "Deleted successfully.";
          }

          if (response.status === 200) {
            message.textContent = data.msg;
            showJobs();
          } else {
            message.textContent = data.msg || "Delete failed.";
          }
        } catch (err) {
          console.error(err);
          message.textContent = "A communication error occurred.";
        } finally {
          enableInput(true);
        }
      }
    }
  });
};

export const showJobs = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/jobs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [jobsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        jobsTable.replaceChildren(...children);
      } else {
        for (let i = 0; i < data.jobs.length; i++) {
          const job = data.jobs[i];
          const rowEntry = document.createElement("tr");

          const editButton = `
            <td>
              <button type="button" class="editButton" data-id="${job._id}">
                edit
              </button>
            </td>
          `;

          const deleteButton = `
            <td>
              <button type="button" class="deleteButton" data-id="${job._id}">
                delete
              </button>
            </td>
          `;

          rowEntry.innerHTML = `
            <td>${job.company}</td>
            <td>${job.position}</td>
            <td>${job.status}</td>
            ${editButton}
            ${deleteButton}
          `;

          children.push(rowEntry);
        }

        jobsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.error(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
  setDiv(jobsDiv);
};
