/* =========================================
   BLOGSPACE - MAIN JAVASCRIPT
   API-integrated frontend
========================================= */

const API_URL = "http://localhost:5000/api";

/* =========================================
   STORAGE AND AUTHENTICATION HELPERS
========================================= */

function readStoredJSON(storage, key, fallback = null) {
    const value = storage.getItem(key);

    if (!value) return fallback;

    try {
        return JSON.parse(value);
    } catch (error) {
        console.error(`Unable to parse ${key}:`, error);
        return fallback;
    }
}

function getAuthToken() {
    return (
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
    );
}

function getUser() {
    return (
        readStoredJSON(localStorage, "user") ||
        readStoredJSON(sessionStorage, "user") ||
        readStoredJSON(localStorage, "blogSpaceUser")
    );
}

function isLoggedIn() {
    return Boolean(getAuthToken());
}

function clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("blogSpaceUser");
}

async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
    } catch (error) {
        throw new Error(
            "Cannot connect to the BlogSpace server. Make sure the backend is running on port 5000."
        );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401) {
            clearAuthData();

            const page = window.location.pathname.split("/").pop();

            if (page === "dashboard.html" || page === "create-blog.html") {
                window.location.href = "login.html";
            }
        }

        throw new Error(data.message || "Something went wrong.");
    }

    return data;
}

/* =========================================
   GENERAL HELPERS
========================================= */

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
}

function formatDate(dateValue, style = "short") {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: style === "long" ? "long" : "short",
        year: "numeric"
    });
}

function getBlogAuthorName(blog) {
    if (blog.author && typeof blog.author === "object") {
        return blog.author.name || "BlogSpace Author";
    }

    return "BlogSpace Author";
}

function showPageMessage(container, message, className = "blog-not-found") {
    if (!container) return;

    container.innerHTML = `
        <div class="${className}">
            <p>${escapeHTML(message)}</p>
        </div>
    `;
}

/* =========================================
   PAGE AND AUTHENTICATION PROTECTION
========================================= */

const currentPage = window.location.pathname.split("/").pop();

const protectedPages = [
    "dashboard.html",
    "create-blog.html"
];

if (protectedPages.includes(currentPage) && !isLoggedIn()) {
    window.location.href = "login.html";
}

/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}


/* =========================================
   NAVIGATION AUTHENTICATION STATE
========================================= */

const loginNavLink = document.getElementById("loginNavLink");
const signupNavLink = document.getElementById("signupNavLink");
const dashboardNavLink = document.getElementById("dashboardNavLink");
const logoutButton = document.getElementById("logoutButton");

if (isLoggedIn()) {

    if (loginNavLink) {
        loginNavLink.style.display = "none";
    }

    if (signupNavLink) {
        signupNavLink.style.display = "none";
    }

    if (dashboardNavLink) {
        dashboardNavLink.classList.remove("hidden-nav-link");
    }

    if (logoutButton) {
        logoutButton.classList.remove("hidden-nav-link");
    }

} else {

    if (loginNavLink) {
        loginNavLink.style.display = "";
    }

    if (signupNavLink) {
        signupNavLink.style.display = "";
    }

    if (dashboardNavLink) {
        dashboardNavLink.classList.add("hidden-nav-link");
    }

    if (logoutButton) {
        logoutButton.classList.add("hidden-nav-link");
    }

}


/* =========================================
   LOGOUT
========================================= */

if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
        event.preventDefault();

        const confirmed = confirm("Are you sure you want to logout?");
        if (!confirmed) return;

        clearAuthData();
        window.location.href = "index.html";
    });
}

/* =========================================
   DASHBOARD
========================================= */

async function loadDashboard() {
    const dashboardUserName = document.getElementById("dashboardUserName");

    if (!dashboardUserName) return;

    const user = getUser();

    if (user && dashboardUserName) {
        dashboardUserName.textContent = user.name || "Writer";
    }

    const totalBlogsElement = document.getElementById("totalBlogs");
    const publishedBlogsElement = document.getElementById("publishedBlogs");
    const draftBlogsElement = document.getElementById("draftBlogs");
    const dashboardEmpty = document.getElementById("dashboardEmpty");
    const blogManagementList = document.getElementById("blogManagementList");

    if (blogManagementList) {
        blogManagementList.innerHTML = "<p>Loading your blogs...</p>";
    }

    try {
        const response = await apiRequest("/blogs");

        const allBlogs = Array.isArray(response.blogs)
            ? response.blogs
            : [];

        const currentUserId = user && (user._id || user.id);

        const myBlogs = allBlogs.filter((blog) => {
            const authorId =
                blog.author && typeof blog.author === "object"
                    ? blog.author._id
                    : blog.author;

            return currentUserId && authorId
                ? String(authorId) === String(currentUserId)
                : false;
        });

        if (totalBlogsElement) {
            totalBlogsElement.textContent = myBlogs.length;
        }

        // The current backend does not implement draft/published status.
        if (publishedBlogsElement) {
            publishedBlogsElement.textContent = myBlogs.length;
        }

        if (draftBlogsElement) {
            draftBlogsElement.textContent = "0";
        }

        if (!dashboardEmpty || !blogManagementList) {
            return;
        }

        blogManagementList.innerHTML = "";

        if (myBlogs.length === 0) {
            dashboardEmpty.style.display = "block";
            return;
        }

        dashboardEmpty.style.display = "none";

        myBlogs
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .forEach((blog) => {
                const card = document.createElement("div");
                card.className = "management-card";

                card.innerHTML = `
                    <div class="management-info">
                        <h3>${escapeHTML(blog.title)}</h3>
                        <p>
                            ${escapeHTML(blog.category || "General")}
                            ·
                            <span class="published">Published</span>
                        </p>
                        <small>${formatDate(blog.updatedAt || blog.createdAt)}</small>
                    </div>

                    <div class="management-actions">
                        <button
                            class="view-button"
                            data-id="${escapeHTML(blog._id)}"
                            type="button"
                        >View</button>

                        <button
                            class="edit-button"
                            data-id="${escapeHTML(blog._id)}"
                            type="button"
                        >Edit</button>

                        <button
                            class="delete-button"
                            data-id="${escapeHTML(blog._id)}"
                            type="button"
                        >Delete</button>
                    </div>
                `;

                blogManagementList.appendChild(card);
            });

        blogManagementList.querySelectorAll(".view-button").forEach((button) => {
            button.addEventListener("click", () => {
                window.location.href =
                    `blog.html?id=${encodeURIComponent(button.dataset.id)}`;
            });
        });

        blogManagementList.querySelectorAll(".edit-button").forEach((button) => {
            button.addEventListener("click", () => {
                localStorage.setItem("editingBlogId", button.dataset.id);
                window.location.href = "create-blog.html";
            });
        });

        blogManagementList.querySelectorAll(".delete-button").forEach((button) => {
            button.addEventListener("click", async () => {
                const confirmed = confirm("Delete this blog permanently?");
                if (!confirmed) return;

                button.disabled = true;

                try {
                    await apiRequest(
                        `/blogs/${encodeURIComponent(button.dataset.id)}`,
                        { method: "DELETE" }
                    );

                    alert("Blog deleted successfully.");
                    await loadDashboard();
                } catch (error) {
                    alert(error.message);
                    button.disabled = false;
                }
            });
        });
    } catch (error) {
        console.error("Dashboard loading error:", error);

        if (blogManagementList) {
            showPageMessage(blogManagementList, error.message);
        } else {
            alert(error.message);
        }
    }
}

loadDashboard();

/* =========================================
   CREATE / EDIT BLOG
========================================= */

const blogForm = document.getElementById("blogForm");

if (blogForm) {
    const titleInput = document.getElementById("blogTitle");
    const categoryInput = document.getElementById("blogCategory");
    const contentInput = document.getElementById("blogContent");
    const saveDraftButton = document.getElementById("saveDraftButton");

    const editingBlogId = localStorage.getItem("editingBlogId");
    const submitButton = blogForm.querySelector('button[type="submit"]');

    async function loadBlogForEditing() {
        if (!editingBlogId) return;

        try {
            const response = await apiRequest(
                `/blogs/${encodeURIComponent(editingBlogId)}`
            );

            const blog = response.blog;

            if (!blog) {
                throw new Error("Blog not found.");
            }

            if (titleInput) titleInput.value = blog.title || "";
            if (categoryInput) categoryInput.value = blog.category || "General";
            if (contentInput) contentInput.value = blog.content || "";

            const heading = document.querySelector(".create-blog-header h1");

            if (heading) heading.textContent = "Edit Your Blog";
            if (submitButton) submitButton.textContent = "Update Blog";
        } catch (error) {
            alert(error.message);
            localStorage.removeItem("editingBlogId");
            window.location.href = "dashboard.html";
        }
    }

    loadBlogForEditing();

    async function saveBlog() {
        const title = titleInput ? titleInput.value.trim() : "";
        const category = categoryInput ? categoryInput.value : "General";
        const content = contentInput ? contentInput.value.trim() : "";

        if (title.length < 5) {
            alert("Blog title must contain at least 5 characters.");
            return;
        }

        if (!content || content.length < 20) {
            alert("Blog content must contain at least 20 characters.");
            return;
        }

        const blogPayload = {
            title,
            category: category || "General",
            content
        };

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = editingBlogId
                ? "Updating..."
                : "Publishing...";
        }

        try {
            if (editingBlogId) {
                await apiRequest(
                    `/blogs/${encodeURIComponent(editingBlogId)}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(blogPayload)
                    }
                );

                localStorage.removeItem("editingBlogId");
                alert("Blog updated successfully.");
            } else {
                await apiRequest("/blogs", {
                    method: "POST",
                    body: JSON.stringify(blogPayload)
                });

                alert("Your blog has been published!");
            }

            window.location.href = "dashboard.html";
        } catch (error) {
            alert(error.message);

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = editingBlogId
                    ? "Update Blog"
                    : "Publish Blog";
            }
        }
    }

    blogForm.addEventListener("submit", (event) => {
        event.preventDefault();
        saveBlog();
    });

    // Drafts are not supported by the current backend Blog model/API.
    if (saveDraftButton) {
        saveDraftButton.disabled = true;
        saveDraftButton.title =
            "Draft saving is not supported by the current backend.";
    }
}

/* =========================================
   HOME PAGE - PUBLISHED BLOGS
========================================= */

const homeBlogGrid = document.getElementById("homeBlogGrid");

async function loadHomeBlogs() {
    if (!homeBlogGrid) return;

    homeBlogGrid.innerHTML = "<p>Loading blogs...</p>";

    try {
        const response = await apiRequest("/blogs");

        const blogs = Array.isArray(response.blogs)
            ? response.blogs
            : [];

        if (blogs.length === 0) {
            homeBlogGrid.innerHTML = `
                <div class="home-empty-state">
                    <h3>No blogs yet</h3>
                    <p>Be the first to share your ideas with the community.</p>
                    <a
                        href="${isLoggedIn() ? "create-blog.html" : "register.html"}"
                        class="primary-button"
                    >
                        ${isLoggedIn() ? "Write a Blog" : "Get Started"}
                    </a>
                </div>
            `;
            return;
        }

        homeBlogGrid.innerHTML = "";

        blogs.forEach((blog) => {
            const preview = (blog.content || "").length > 130
                ? `${blog.content.substring(0, 130)}...`
                : (blog.content || "");

            const card = document.createElement("article");
            card.className = "blog-card";
            card.tabIndex = 0;
            card.setAttribute("role", "button");

            card.innerHTML = `
                <div class="blog-image">
                    <span>${escapeHTML(blog.category || "General")}</span>
                </div>

                <div class="blog-content">
                    <p class="blog-category">
                        ${escapeHTML(blog.category || "General")}
                    </p>

                    <h3>${escapeHTML(blog.title)}</h3>
                    <p>${escapeHTML(preview)}</p>

                    <div class="blog-footer">
                        <span>${formatDate(blog.createdAt)}</span>
                        <span>Read More →</span>
                    </div>
                </div>
            `;

            const openBlog = () => {
                window.location.href =
                    `blog.html?id=${encodeURIComponent(blog._id)}`;
            };

            card.addEventListener("click", openBlog);

            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openBlog();
                }
            });

            homeBlogGrid.appendChild(card);
        });
    } catch (error) {
        console.error("Home blogs loading error:", error);
        showPageMessage(homeBlogGrid, error.message, "home-empty-state");
    }
}

loadHomeBlogs();

/* =========================================
   BLOG DETAILS PAGE
========================================= */

const blogDetails = document.getElementById("blogDetails");

async function loadBlogDetails() {
    if (!blogDetails) return;

    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("id");

    if (!blogId) {
        showPageMessage(blogDetails, "No blog was selected.");
        return;
    }

    showPageMessage(blogDetails, "Loading blog...");

    try {
        const response = await apiRequest(
            `/blogs/${encodeURIComponent(blogId)}`
        );

        const blog = response.blog;

        if (!blog) {
            throw new Error("Blog not found.");
        }

        const formattedContent = escapeHTML(blog.content || "")
            .split("\n")
            .filter((paragraph) => paragraph.trim() !== "")
            .map((paragraph) => `<p>${paragraph}</p>`)
            .join("");

        blogDetails.innerHTML = `
            <a href="index.html#featured" class="blog-back-button">
                ← Back to Blogs
            </a>

            <header class="blog-details-header">
                <span class="blog-details-category">
                    ${escapeHTML(blog.category || "General")}
                </span>

                <h1 class="blog-details-title">
                    ${escapeHTML(blog.title)}
                </h1>

                <div class="blog-details-meta">
                    <span>${escapeHTML(getBlogAuthorName(blog))}</span>
                    <span>${formatDate(blog.createdAt, "long")}</span>
                </div>
            </header>

            <div class="blog-details-content">
                ${formattedContent}
            </div>
        `;
    } catch (error) {
        console.error("Blog details loading error:", error);

        blogDetails.innerHTML = `
            <div class="blog-not-found">
                <h2>Blog Not Found</h2>
                <p>${escapeHTML(error.message)}</p>
                <a href="index.html#featured" class="primary-button">
                    Back to Blogs
                </a>
            </div>
        `;
    }
}

loadBlogDetails();

/* =========================================
   FORGOT PASSWORD - DEMO MESSAGE
========================================= */

const forgotPasswordLink = document.querySelector('a[href="#"]');

if (forgotPasswordLink) {
    const linkText = forgotPasswordLink.textContent.trim().toLowerCase();

    if (linkText.includes("forgot")) {
        forgotPasswordLink.addEventListener("click", (event) => {
            event.preventDefault();
            alert("Password recovery is not available yet.");
        });
    }
}

/* =========================================
   CLEAR STALE EDIT MODE
========================================= */

if (
    currentPage === "create-blog.html" &&
    !document.getElementById("blogForm")
) {
    localStorage.removeItem("editingBlogId");
}