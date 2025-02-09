import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
    // Fetch project data from projects.json
    const projects = await fetchJSON('../lib/projects.json');

    const projectsContainer = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title');
    const searchInput = document.querySelector('.searchBar');

    if (!projectsContainer) {
        console.error("Error: No '.projects' container found in the DOM.");
        return;
    }

    if (!projects || projects.length === 0) {
        projectsContainer.innerHTML = "<p>No projects found. Check back later!</p>";
        if (projectsTitle) {
            projectsTitle.textContent = "No Projects Available";
        }
        return;
    }

    if (projectsTitle) {
        projectsTitle.textContent = `${projects.length} Projects`;
    }

    // Render initial project list and pie chart
    renderProjects(projects, projectsContainer, 'h2');
    renderPieChart(projects); 

    // ✅ Search Functionality (Case-Insensitive & Searches Across Metadata)
    searchInput.addEventListener('input', (event) => {
        let query = event.target.value.toLowerCase();
        let filteredProjects = projects.filter((project) => {
            let values = Object.values(project).join('\n').toLowerCase();
            return values.includes(query);
        });

        renderProjects(filteredProjects, projectsContainer, 'h2');
        renderPieChart(filteredProjects); // ✅ Update pie chart dynamically
    });
}

// ✅ Function to Render Pie Chart
function renderPieChart(projectsGiven) {
    // ✅ Clear previous chart before redrawing
    let svg = d3.select("#projects-plot");
    svg.selectAll('*').remove(); // ✅ Removes all existing elements

    let legend = d3.select('.legend');
    legend.html(""); // ✅ Clears legend

    // ✅ Aggregate projects by year and count them
    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    if (data.length === 0) return; // ✅ Prevents empty pie chart

    let width = 300, height = 300, radius = Math.min(width, height) / 2;
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    // ✅ Create New SVG Container
    let g = svg.attr("viewBox", `-150 -150 300 300`)
        .append("g")
        .attr("transform", `translate(0,0)`); 

    // ✅ Append Paths for Pie Chart & Hover Effect
    let paths = g.selectAll("path")
        .data(arcData)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d, i) => colors(i))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("transition", "opacity 300ms") // ✅ Smooth transition
        .on("mouseover", function () {
            d3.selectAll("#projects-plot path").attr("opacity", 0.5);
            d3.select(this).attr("opacity", 1);
        })
        .on("mouseout", function () {
            d3.selectAll("#projects-plot path").attr("opacity", 1);
        });

    // ✅ Generate Legend
    legend.selectAll("li")
        .data(data)
        .enter()
        .append("li")
        .attr("class", "legend-item")
        .attr("style", (d, i) => `--color: ${colors(i)}`)
        .html((d) => `<span class="swatch"></span> ${d.label} (${d.value})`);
}

// Run function when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
});
