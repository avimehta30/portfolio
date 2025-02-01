console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 1: Automatic navigation menu
const pages = [
  { url: './', title: 'Home' },
  { url: './projects/index.html', title: 'Projects' },
  { url: './contact/index.html', title: 'Contact' },
  { url: './resume/index.html', title: 'Resume' },
  { url: 'https://github.com/avimehta30', title: 'GitHub' },
];

const nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let a = document.createElement('a');
  a.href = p.url;
  a.textContent = p.title;

  // Open external links in a new tab
  if (p.url.startsWith('http')) {
    a.target = '_blank';
  }

  nav.appendChild(a);
}

// Step 2: Fetch JSON data
export async function fetchJSON(url) {
    try {
        console.log(`Fetching JSON from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText} (Status: ${response.status})`);
        }
        const data = await response.json();
        console.log("Fetched JSON:", data);
        return data;
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return null;
    }
}

// Step 3: Fetch GitHub Data
export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}

// Step 4: Rendering Projects Function
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!containerElement) {
        console.error('Error: containerElement is null or undefined.');
        return;
    }
    containerElement.innerHTML = '';
    projects.forEach(project => {
        const article = document.createElement('article');
        const headingTag = document.createElement(headingLevel);
        headingTag.textContent = project.title || 'Untitled Project';

        const image = document.createElement('img');
        image.src = project.image || 'https://via.placeholder.com/150';
        image.alt = project.title || 'Project Image';

        const description = document.createElement('p');
        description.textContent = project.description || 'No description available.';

        article.appendChild(headingTag);
        article.appendChild(image);
        article.appendChild(description);
        containerElement.appendChild(article);
    });
}

// Step 5: Load Projects on the Projects page
async function loadProjects() {
    const projectsContainer = document.querySelector('.projects');
    if (!projectsContainer) return;
    const projects = await fetchJSON('../lib/projects.json');
    if (!projects) {
        projectsContainer.innerHTML = `<p>Failed to load projects.</p>`;
        return;
    }
    renderProjects(projects, projectsContainer);
}

document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
    loadGitHubStats();
});

// Step 6: Load GitHub Stats
async function loadGitHubStats() {
    const profileStats = document.querySelector('#profile-stats');
    if (!profileStats) return;

    const githubData = await fetchGitHubData('avimehta30');
    if (!githubData) {
        profileStats.innerHTML = '<p>Failed to load GitHub Stats.</p>';
        return;
    }
    profileStats.innerHTML = `
        <h2>My GitHub Stats</h2>
        <dl class="github-stats">
          <dt>Followers</dt><dd>${githubData.followers}</dd>
          <dt>Following</dt><dd>${githubData.following}</dd>
          <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
          <dt>Public Gists</dt><dd>${githubData.public_gists}</dd>
        </dl>
    `;
}

// Step 7: Dark Mode Toggle
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
document.body.insertAdjacentHTML('afterbegin', themeSwitcher);

const select = document.querySelector('.color-scheme select');
if ("colorScheme" in localStorage) {
  const savedScheme = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', savedScheme);
  select.value = savedScheme;
}
select.addEventListener('input', (event) => {
  const value = event.target.value;
  document.documentElement.style.setProperty('color-scheme', value);
  localStorage.colorScheme = value;
});