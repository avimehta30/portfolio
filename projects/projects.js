// projects.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

// ✅ Updated Data with Labels
let data = [
    { value: 1, label: 'Apples' },
    { value: 2, label: 'Oranges' },
    { value: 3, label: 'Mangos' },
    { value: 4, label: 'Pears' },
    { value: 5, label: 'Limes' },
    { value: 5, label: 'Cherries' },
];

// ✅ Using d3.pie() to read 'value' property
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);

// Define colors
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Select the SVG container
let svg = d3.select("#projects-plot");

// Define arc generator
let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

// Append paths dynamically based on arcData
arcData.forEach((d, idx) => {
    svg.append("path")
        .attr("d", arcGenerator(d))
        .attr("fill", colors(idx))
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    });

    let legend = d3.select('.legend');
    data.forEach((d, idx) => {
        legend.append('li')
            .attr('class', 'legend-item')
            .attr('style', `--color:${colors(idx)}`) // Assign the same color as the pie chart
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

//     // ✅ Append Labels to Slices
//     let centroid = arcGenerator.centroid(d);
//     svg.append("text")
//         .attr("x", centroid[0])
//         .attr("y", centroid[1])
//         .attr("text-anchor", "middle")
//         .attr("font-size", "10px")
//         .attr("fill", "black")
//         .text(data[idx].label);
// });

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
