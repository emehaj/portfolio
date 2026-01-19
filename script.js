const container = document.getElementById("projects");
const buttons = document.querySelectorAll(".allButton, .hcButton, .jsButton");
let currentFilter = "all";

let projects = [];

const sb = window.supabase.createClient(
    "https://ihwaxmhsanxznaopnvtz.supabase.co",
    "sb_publishable_cAAIiJW63lR-7NG99-RnkQ__mnu4EVJ",
);

async function loadProjects() {
    const { data, error } = await sb.from("projects").select("*");

    if (error) {
        console.error(error);
        return;
    }

    projects = data;

    renderProjects();
}

function renderProjects() {
    container.innerHTML = "";

    let filteredProjects = [...projects];

    if (currentFilter === "htmlcss") {
        filteredProjects = projects.filter((px) => px.tag === "HTML / CSS");
    } else if (currentFilter === "javascript") {
        filteredProjects = projects.filter((px) => px.tag === "JavaScript");
    }

    filteredProjects
        .sort((a, b) => a.id_column - b.id_column)
        .forEach((p) => {
            createProjectCard(p);
        });
}

function createProjectCard(p) {
    const div = document.createElement("div");
    div.className = "project";

    const dbDate = p.created_at;

    const date = new Date(dbDate);

    const formatted = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const img = document.createElement("img");
    img.src = `${p.image_url}`;
    img.alt = `${p.name}`;

    const textWrapper = document.createElement("div");
    textWrapper.classList.add("textWrapper");

    const label = document.createElement("div");
    label.classList.add("label");

    const tag = document.createElement("p");
    tag.classList.add("tag");
    p.tag === "HTML / CSS"
        ? (tag.innerHTML = `<span class="tech">HTML</span> <span class="tech">CSS</span>`)
        : (tag.innerHTML = `<span class="tech">${p.tag}</span>`);

    const formattedDate = document.createElement("p");
    formattedDate.classList.add("date");
    formattedDate.innerHTML = `<img src="./images/calendar-dots.svg" /> ${formatted}`;

    label.append(tag, formattedDate);

    const projectName = document.createElement("p");
    projectName.classList.add("name");
    projectName.textContent = `${p.name}`;

    const links = document.createElement("div");
    links.classList.add("url");
    links.append(
        createLink(p.url, "./images/globe.svg", "globe icon"),
        createLink(p.github, "./images/github_black.svg", "github icon"),
        createLink(
            p.sourceurl,
            "./images/FrontEndMentor.png",
            "fem logo",
            "Frontend Mentor",
        ),
    );
    textWrapper.append(label, projectName, links);

    div.append(img, textWrapper);

    container.appendChild(div);
}

function createLink(href, imgSrc, alt, title) {
    const a = document.createElement("a");
    const img = document.createElement("img");

    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferred";

    img.src = imgSrc;
    img.alt = alt;
    if (title) {
        img.title = title;
    }

    a.appendChild(img);

    return a;
}

function setActiveButton(clickedBtn, filter) {
    buttons.forEach((btn) => btn.classList.remove("active"));

    clickedBtn.classList.add("active");

    currentFilter = filter;

    renderProjects();
}

buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        setActiveButton(btn, btn.dataset.filter);
    });
});

loadProjects();
