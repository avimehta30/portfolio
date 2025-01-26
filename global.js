// global.js

console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 3: Automatic navigation menu
const pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/avimehta30', title: 'GitHub' },
];

const nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // Adjust URL for non-home pages
  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

  // Create link element
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  
  // Add 'current' class for the current page
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  // Open external links in a new tab
  a.toggleAttribute('target', a.host !== location.host);
  a.target = a.host !== location.host ? '_blank' : '';

  nav.append(a);
}

// Step 4: Automatic dark mode switch
// Add the dark mode switcher to the page
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

// Set up the dark mode functionality
const select = document.querySelector('.color-scheme select');

// Load saved preference if it exists
if ("colorScheme" in localStorage) {
  const savedScheme = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', savedScheme);
  select.value = savedScheme;
}

// Add event listener to update the color scheme
select.addEventListener('input', (event) => {
  const value = event.target.value;
  document.documentElement.style.setProperty('color-scheme', value);
  localStorage.colorScheme = value;
});
