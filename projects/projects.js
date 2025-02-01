// projects.js

import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
    // Fetch project data from projects.json
    const projects = await fetchJSON('../lib/projects.json');

    // Select the container where projects will be displayed
    const projectsContainer = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title'); // Select the h1 element

    if (!projectsContainer) {
        console.error("Error: No '.projects' container found in the DOM.");
        return;
    }

    // Handle case where the JSON file is missing, empty, or incorrectly formatted
    if (!projects || projects.length === 0) {
        projectsContainer.innerHTML = "<p>No projects found. Check back later!</p>";

        // Update the title with a fallback text
        if (projectsTitle) {
            projectsTitle.textContent = "No Projects Available";
        }

        return;
    }

    // Update the project count in the h1 tag
    if (projectsTitle) {
        projectsTitle.textContent = `${projects.length} Projects`;
    }

    // Render the projects dynamically using h2 as the heading level
    renderProjects(projects, projectsContainer, 'h2');
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
});
