// global.js

console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 3: Automatic navigation menu
const pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "resume/", title: "Resume" },
  { url: "https://github.com/avimehta30", title: "GitHub" },
];

const nav = document.createElement("nav");
document.body.prepend(nav);

const ARE_WE_HOME = location.pathname.endsWith("index.html") || location.pathname === "/";

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // Adjust URL for non-home pages
  url = !ARE_WE_HOME && !url.startsWith("http") ? "../" + url : url;

  // Create link element
  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  // Add 'current' class for the current page
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  // Open external links in a new tab
  if (a.host !== location.host) {
    a.setAttribute("target", "_blank");
  }

  nav.append(a);
}

// Step 4: Automatic dark mode switch
const themeSwitcher = `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
`;
document.body.insertAdjacentHTML("afterbegin", themeSwitcher);

const select = document.querySelector(".color-scheme select");

// Load saved preference if it exists
if ("colorScheme" in localStorage) {
  const savedScheme = localStorage.colorScheme;
  document.documentElement.style.setProperty("color-scheme", savedScheme);
  select.value = savedScheme;
}

// Add event listener to update the color scheme
select.addEventListener("input", (event) => {
  const value = event.target.value;
  document.documentElement.style.setProperty("color-scheme", value);
  localStorage.colorScheme = value;
});

// Step 1.2: Importing Project Data into the Projects Page
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching JSON data:", error);
    return []; // Return an empty array to prevent further issues
  }
}

// Step 1.3: Creating the renderProjects Function
export function renderProjects(project, containerElement, headingLevel = "h2") {
  // Validate containerElement
  if (!(containerElement instanceof HTMLElement)) {
    console.error("Invalid container element provided.");
    return;
  }

  // Validate headingLevel
  const validHeadings = ["h1", "h2", "h3", "h4", "h5", "h6"];
  if (!validHeadings.includes(headingLevel)) {
    console.warn(`Invalid heading level: ${headingLevel}, defaulting to h2.`);
    headingLevel = "h2";
  }

  // Clear existing content to avoid duplicates
  containerElement.innerHTML = "";

  // Create the article element
  const article = document.createElement("article");

  // Define the content dynamically
  article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image || 'https://via.placeholder.com/300'}" alt="${project.title || 'No title available'}">
      <p>${project.description || "No description available."}</p>
  `;

  // Append the article to the container
  containerElement.appendChild(article);
}

// Step 5: Dynamically Load Projects
async function loadProjects() {
  const projectsContainer = document.getElementById("projects-container");
  if (!projectsContainer) return; // Only run on the projects page

  try {
    const projects = await fetchJSON("projects.json");

    if (projects.length === 0) {
      projectsContainer.innerHTML = "<p>No projects available.</p>";
      return;
    }

    projects.forEach((project) => {
      renderProjects(project, projectsContainer, "h3");
    });
  } catch (error) {
    console.error("Error loading projects:", error);
    projectsContainer.innerHTML = "<p>Failed to load projects.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);
