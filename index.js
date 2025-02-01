import { fetchJSON, renderProjects } from './global.js';

// Fetch and filter projects
async function loadLatestProjects() {
    const projects = await fetchJSON('./lib/projects.json');
    
    if (!projects || projects.length === 0) {
        console.error('No projects found or failed to fetch projects.');
        return;
    }

    const latestProjects = projects.slice(0, 3); // Only take the first 4 projects

    const projectsContainer = document.querySelector('.projects');

    if (projectsContainer) {
        renderProjects(latestProjects, projectsContainer, 'h2');
    }
}

// Load projects when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadLatestProjects();
});
