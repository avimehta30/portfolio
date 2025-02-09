import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

let selectedIndex = -1; 
let projects = []; 

async function loadProjects() {
    projects = await fetchJSON('../lib/projects.json');

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

    renderProjects(projects, projectsContainer, 'h2');
    renderPieChart(projects);

    searchInput.addEventListener('input', () => {
        filterProjectsBySearchAndYear();
    });
}

function renderPieChart(projectsGiven) {
    let svg = d3.select("#projects-plot");
    svg.selectAll('*').remove(); 

    let legend = d3.select('.legend');
    legend.html(""); 

    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    if (data.length === 0) return;

    let width = 300, height = 300, radius = Math.min(width, height) / 2;
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    let g = svg.attr("viewBox", `-150 -150 300 300`)
        .append("g")
        .attr("transform", `translate(0,0)`);

    g.selectAll("path")
        .data(arcData)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d, i) => colors(i))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("cursor", "pointer")
        .classed("selected", (d, i) => i === selectedIndex) 
        .on("click", function (event, d) {
            selectedIndex = selectedIndex === d.index ? -1 : d.index; 
            updateSelection();
            filterProjectsBySearchAndYear();
        });

    legend.selectAll("li")
        .data(data)
        .enter()
        .append("li")
        .attr("class", (d, i) => `legend-item ${i === selectedIndex ? "selected" : ""}`)
        .attr("style", (d, i) => `--color: ${colors(i)}`)
        .html((d) => `<span class="swatch"></span> ${d.label} (${d.value})`)
        .on("click", function (event, d, i) {
            selectedIndex = selectedIndex === i ? -1 : i; 
            updateSelection();
            filterProjectsBySearchAndYear();
        });
}

function updateSelection() {
    let svg = d3.select("#projects-plot");
    let legend = d3.select('.legend');

    svg.selectAll("path")
        .classed("selected", (_, i) => i === selectedIndex);

    legend.selectAll("li")
        .classed("selected", (_, i) => i === selectedIndex);
}

function filterProjectsBySearchAndYear() {
    const projectsContainer = document.querySelector('.projects');
    const searchInput = document.querySelector('.searchBar'); 
    let query = searchInput.value.toLowerCase();

    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query); 
    });

    if (selectedIndex !== -1) {
        let selectedYear = d3.selectAll('.legend-item').data()[selectedIndex]?.label;
        filteredProjects = filteredProjects.filter(project => project.year == selectedYear); // ✅ Then filter by year
    }

    renderProjects(filteredProjects, projectsContainer, 'h2');
}

document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
});
