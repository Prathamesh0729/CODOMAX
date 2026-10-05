/* =========================================
   BLOGSPACE - MAIN JAVASCRIPT
========================================= */


/* =========================================
   HELPER FUNCTIONS
========================================= */

/**
 * Get JSON data from localStorage.
 */
function getStorageData(key, defaultValue = null) {
    const data = localStorage.getItem(key);

    if (!data) {
        return defaultValue;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error(
            `Unable to parse localStorage data: ${key}`,
            error
        );

        return defaultValue;
    }
}


/**
 * Save JSON data to localStorage.
 */
function setStorageData(key, data) {
    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}


/**
 * Get all blogs.
 */
function getBlogs() {
    return getStorageData(
        "blogSpaceBlogs",
        []
    );
}


/**
 * Save all blogs.
 */
function saveBlogs(blogs) {
    setStorageData(
        "blogSpaceBlogs",
        blogs
    );
}


/**
 * Get logged-in user.
 */
function getUser() {
    return getStorageData(
        "blogSpaceUser",
        null
    );
}


/**
 * Check whether user is logged in.
 */
function isLoggedIn() {
    return localStorage.getItem(
        "isLoggedIn"
    ) === "true";
}


/**
 * Escape HTML to prevent unwanted HTML injection.
 */
function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;
}


/**
 * Format date for display.
 */
function formatDate(dateValue, style = "short") {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    if (style === "long") {
        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================
   AUTHENTICATION PROTECTION
========================================= */

const currentPage =
    window.location.pathname
        .split("/")
        .pop();


const protectedPages = [
    "dashboard.html",
    "create-blog.html"
];


if (
    protectedPages.includes(currentPage) &&
    !isLoggedIn()
) {
    window.location.href = "login.html";
}


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");


if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                navLinks.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }
    );


    navLinks
        .querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    navLinks.classList.remove(
                        "active"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );
        });
}


/* =========================================
   NAVIGATION AUTH STATE
========================================= */

const loginNavLink =
    document.getElementById("loginNavLink");

const signupNavLink =
    document.getElementById("signupNavLink");

const dashboardNavLink =
    document.getElementById("dashboardNavLink");

const logoutButton =
    document.getElementById("logoutButton");


if (isLoggedIn()) {

    if (loginNavLink) {
        loginNavLink.style.display = "none";
    }

    if (signupNavLink) {
        signupNavLink.style.display = "none";
    }

    if (dashboardNavLink) {
        dashboardNavLink.style.display = "inline-block";
    }

    if (logoutButton) {
        logoutButton.style.display = "inline-block";
    }

} else {

    if (loginNavLink) {
        loginNavLink.style.display = "";
    }

    if (signupNavLink) {
        signupNavLink.style.display = "";
    }

    if (dashboardNavLink) {
        dashboardNavLink.style.display = "none";
    }

    if (logoutButton) {
        logoutButton.style.display = "none";
    }
}


/* =========================================
   REGISTER
========================================= */

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const terms =
                document
                    .getElementById("terms")
                    .checked;


            /* Name validation */

            if (name.length < 3) {

                alert(
                    "Please enter a valid name."
                );

                return;
            }


            /* Email validation */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            /* Password validation */

            if (password.length < 6) {

                alert(
                    "Password must contain at least 6 characters."
                );

                return;
            }


            /* Confirm password */

            if (
                password !==
                confirmPassword
            ) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            /* Terms */

            if (!terms) {

                alert(
                    "Please accept the terms and conditions."
                );

                return;
            }


            /* Create user */

            const user = {
                name: name,
                email: email,
                password: password
            };


            setStorageData(
                "blogSpaceUser",
                user
            );


            alert(
                "Account created successfully!"
            );


            window.location.href =
                "login.html";
        }
    );
}


/* =========================================
   LOGIN
========================================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("password")
                    .value;


            const storedUser =
                getUser();


            if (!storedUser) {

                alert(
                    "No account found. Please register first."
                );

                return;
            }


            if (
                email === storedUser.email &&
                password === storedUser.password
            ) {

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );


                alert(
                    "Login successful!"
                );


                window.location.href =
                    "dashboard.html";

            } else {

                alert(
                    "Invalid email or password."
                );
            }
        }
    );
}


/* =========================================
   LOGOUT
========================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            localStorage.removeItem(
                "isLoggedIn"
            );


            window.location.href =
                "index.html";
        }
    );
}


/* =========================================
   DASHBOARD
========================================= */

const dashboardUserName =
    document.getElementById(
        "dashboardUserName"
    );


if (dashboardUserName) {

    const user =
        getUser();


    /* User name */

    if (user) {

        dashboardUserName.textContent =
            user.name;
    }


    /* Get blogs */

    const blogs =
        getBlogs();


    /* Statistics */

    const totalBlogs =
        document.getElementById(
            "totalBlogs"
        );


    const publishedBlogs =
        document.getElementById(
            "publishedBlogs"
        );


    const draftBlogs =
        document.getElementById(
            "draftBlogs"
        );


    const publishedCount =
        blogs.filter(
            blog =>
                blog.status === "published"
        ).length;


    const draftCount =
        blogs.filter(
            blog =>
                blog.status === "draft"
        ).length;


    if (totalBlogs) {
        totalBlogs.textContent =
            blogs.length;
    }


    if (publishedBlogs) {
        publishedBlogs.textContent =
            publishedCount;
    }


    if (draftBlogs) {
        draftBlogs.textContent =
            draftCount;
    }


    /* Blog list */

    const dashboardEmpty =
        document.getElementById(
            "dashboardEmpty"
        );


    const blogManagementList =
        document.getElementById(
            "blogManagementList"
        );


    if (
        !dashboardEmpty ||
        !blogManagementList
    ) {
        return;
    }


    if (blogs.length === 0) {

        dashboardEmpty.style.display =
            "block";

        blogManagementList.innerHTML =
            "";

    } else {

        dashboardEmpty.style.display =
            "none";


        blogManagementList.innerHTML =
            "";


        /*
         * Show newest blogs first.
         */

        const sortedBlogs =
            blogs
                .slice()
                .sort(
                    function (a, b) {
                        return b.id - a.id;
                    }
                );


        sortedBlogs.forEach(
            function (blog) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "management-card";


                const statusClass =
                    blog.status === "published"
                        ? "published"
                        : "draft";


                card.innerHTML = `

                    <div class="management-info">

                        <h3>
                            ${escapeHTML(blog.title)}
                        </h3>

                        <p>
                            ${escapeHTML(blog.category)}
                            ·
                            <span class="${statusClass}">
                                ${escapeHTML(blog.status)}
                            </span>
                        </p>

                        <small>
                            ${formatDate(
                                blog.updatedAt ||
                                blog.createdAt
                            )}
                        </small>

                    </div>

                    <div class="management-actions">

                        ${
                            blog.status === "published"
                                ? `
                                    <button
                                        class="view-button"
                                        data-id="${blog.id}"
                                        type="button"
                                    >
                                        View
                                    </button>
                                  `
                                : ""
                        }

                        <button
                            class="edit-button"
                            data-id="${blog.id}"
                            type="button"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-button"
                            data-id="${blog.id}"
                            type="button"
                        >
                            Delete
                        </button>

                    </div>
                `;


                blogManagementList.appendChild(
                    card
                );
            }
        );


        /* View buttons */

        const viewButtons =
            document.querySelectorAll(
                ".view-button"
            );


        viewButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const blogId =
                            Number(
                                button.dataset.id
                            );


                        window.location.href =
                            `blog.html?id=${blogId}`;
                    }
                );
            }
        );


        /* Delete buttons */

        const deleteButtons =
            document.querySelectorAll(
                ".delete-button"
            );


        deleteButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const blogId =
                            Number(
                                button.dataset.id
                            );


                        const confirmed =
                            confirm(
                                "Delete this blog?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        const updatedBlogs =
                            getBlogs().filter(
                                blog =>
                                    blog.id !== blogId
                            );


                        saveBlogs(
                            updatedBlogs
                        );


                        window.location.reload();
                    }
                );
            }
        );


        /* Edit buttons */

        const editButtons =
            document.querySelectorAll(
                ".edit-button"
            );


        editButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const blogId =
                            Number(
                                button.dataset.id
                            );


                        localStorage.setItem(
                            "editingBlogId",
                            blogId
                        );


                        window.location.href =
                            "create-blog.html";
                    }
                );
            }
        );
    }
}


/* =========================================
   CREATE / EDIT BLOG
========================================= */

const blogForm =
    document.getElementById(
        "blogForm"
    );


if (blogForm) {

    const titleInput =
        document.getElementById(
            "blogTitle"
        );


    const categoryInput =
        document.getElementById(
            "blogCategory"
        );


    const contentInput =
        document.getElementById(
            "blogContent"
        );


    const saveDraftButton =
        document.getElementById(
            "saveDraftButton"
        );


    const editingBlogId =
        localStorage.getItem(
            "editingBlogId"
        );


    /* Load blog for editing */

    if (editingBlogId) {

        const blogs =
            getBlogs();


        const blog =
            blogs.find(
                item =>
                    item.id ===
                    Number(editingBlogId)
            );


        if (blog) {

            titleInput.value =
                blog.title;


            categoryInput.value =
                blog.category;


            contentInput.value =
                blog.content;


            const heading =
                document.querySelector(
                    ".create-blog-header h1"
                );


            if (heading) {

                heading.textContent =
                    "Edit Your Blog";
            }


            const publishButton =
                blogForm.querySelector(
                    'button[type="submit"]'
                );


            if (publishButton) {

                publishButton.textContent =
                    "Update Blog";
            }
        }
    }


    /**
     * Save or update a blog.
     */
    function saveBlog(status) {

        const title =
            titleInput.value.trim();


        const category =
            categoryInput.value;


        const content =
            contentInput.value.trim();


        /* Validation */

        if (title.length < 5) {

            alert(
                "Blog title must contain at least 5 characters."
            );

            return;
        }


        if (!category) {

            alert(
                "Please select a category."
            );

            return;
        }


        if (content.length < 20) {

            alert(
                "Blog content must contain at least 20 characters."
            );

            return;
        }


        const blogs =
            getBlogs();


        /* Editing existing blog */

        if (editingBlogId) {

            const blogIndex =
                blogs.findIndex(
                    blog =>
                        blog.id ===
                        Number(editingBlogId)
                );


            if (blogIndex !== -1) {

                blogs[blogIndex] = {
                    ...blogs[blogIndex],

                    title: title,

                    category: category,

                    content: content,

                    status: status,

                    updatedAt:
                        new Date().toISOString()
                };


                saveBlogs(
                    blogs
                );


                localStorage.removeItem(
                    "editingBlogId"
                );


                alert(
                    "Blog updated successfully!"
                );


                window.location.href =
                    "dashboard.html";


                return;
            }
        }


        /* Create new blog */

        const newBlog = {

            id: Date.now(),

            title: title,

            category: category,

            content: content,

            status: status,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()
        };


        blogs.push(
            newBlog
        );


        saveBlogs(
            blogs
        );


        if (
            status === "published"
        ) {

            alert(
                "Your blog has been published!"
            );

        } else {

            alert(
                "Your blog has been saved as a draft."
            );
        }


        window.location.href =
            "dashboard.html";
    }


    /* Publish / Update */

    blogForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            saveBlog(
                "published"
            );
        }
    );


    /* Save Draft */

    if (saveDraftButton) {

        saveDraftButton.addEventListener(
            "click",
            function () {

                saveBlog(
                    "draft"
                );
            }
        );
    }
}


/* =========================================
   HOME PAGE - PUBLISHED BLOGS
========================================= */

const homeBlogGrid =
    document.getElementById(
        "homeBlogGrid"
    );


if (homeBlogGrid) {

    const blogs =
        getBlogs();


    /*
     * Only published blogs are visible
     * on the public Home page.
     */

    const publishedBlogs =
        blogs
            .filter(
                blog =>
                    blog.status === "published"
            )
            .slice()
            .sort(
                function (a, b) {
                    return b.id - a.id;
                }
            );


    if (publishedBlogs.length === 0) {

        homeBlogGrid.innerHTML = `

            <div class="home-empty-state">

                <h3>
                    No published blogs yet
                </h3>

                <p>
                    Be the first to share
                    your ideas with the community.
                </p>

                ${
                    isLoggedIn()
                        ? `
                            <a
                                href="create-blog.html"
                                class="primary-button"
                            >
                                Write a Blog
                            </a>
                          `
                        : `
                            <a
                                href="register.html"
                                class="primary-button"
                            >
                                Get Started
                            </a>
                          `
                }

            </div>
        `;

    } else {

        publishedBlogs.forEach(
            function (blog) {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "blog-card";


                const preview =
                    blog.content.length > 130
                        ? blog.content.substring(
                            0,
                            130
                        ) + "..."
                        : blog.content;


                const formattedDate =
                    formatDate(
                        blog.createdAt
                    );


                card.innerHTML = `

                    <div class="blog-image">

                        <span>
                            ${escapeHTML(
                                blog.category
                            )}
                        </span>

                    </div>


                    <div class="blog-content">

                        <p class="blog-category">
                            ${escapeHTML(
                                blog.category
                            )}
                        </p>


                        <h3>
                            ${escapeHTML(
                                blog.title
                            )}
                        </h3>


                        <p>
                            ${escapeHTML(
                                preview
                            )}
                        </p>


                        <div class="blog-footer">

                            <span>
                                ${formattedDate}
                            </span>

                            <span>
                                Read More →
                            </span>

                        </div>

                    </div>
                `;


                card.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            `blog.html?id=${blog.id}`;
                    }
                );


                homeBlogGrid.appendChild(
                    card
                );
            }
        );
    }
}


/* =========================================
   BLOG DETAILS PAGE
========================================= */

const blogDetails =
    document.getElementById(
        "blogDetails"
    );


if (blogDetails) {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const blogId =
        Number(
            urlParams.get("id")
        );


    const blogs =
        getBlogs();


    const blog =
        blogs.find(
            item =>
                item.id === blogId
        );


    /*
     * Show an error if:
     * - blog does not exist
     * - blog is still a draft
     */

    if (
        !blog ||
        blog.status !== "published"
    ) {

        blogDetails.innerHTML = `

            <div class="blog-not-found">

                <h2>
                    Blog Not Found
                </h2>

                <p>
                    This blog does not exist
                    or is not currently published.
                </p>

                <a
                    href="index.html#featured"
                    class="primary-button"
                >
                    Back to Blogs
                </a>

            </div>
        `;

    } else {

        const formattedDate =
            formatDate(
                blog.createdAt,
                "long"
            );


        /*
         * Convert line breaks in the blog
         * content into separate paragraphs.
         */

        const formattedContent =
            escapeHTML(
                blog.content
            )
                .split("\n")
                .filter(
                    paragraph =>
                        paragraph.trim() !== ""
                )
                .map(
                    paragraph =>
                        `<p>${paragraph}</p>`
                )
                .join("");


        blogDetails.innerHTML = `

            <a
                href="index.html#featured"
                class="blog-back-button"
            >
                ← Back to Blogs
            </a>


            <header class="blog-details-header">

                <span class="blog-details-category">
                    ${escapeHTML(
                        blog.category
                    )}
                </span>


                <h1 class="blog-details-title">
                    ${escapeHTML(
                        blog.title
                    )}
                </h1>


                <div class="blog-details-meta">

                    <span>
                        BlogSpace
                    </span>

                    <span>
                        ${formattedDate}
                    </span>

                </div>

            </header>


            <div class="blog-details-content">

                ${formattedContent}

            </div>
        `;
    }
}


/* =========================================
   FORGOT PASSWORD
========================================= */

const forgotPasswordLink =
    document.querySelector(
        'a[href="#"]'
    );


/*
 * This is intentionally a demo-only
 * frontend project.
 *
 * No real password recovery system
 * is implemented.
 */

if (forgotPasswordLink) {

    const linkText =
        forgotPasswordLink.textContent
            .trim()
            .toLowerCase();


    if (
        linkText.includes("forgot")
    ) {

        forgotPasswordLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                alert(
                    "Password recovery is not available in this frontend demo."
                );
            }
        );
    }
}


/* =========================================
   BLOG CARD KEYBOARD ACCESSIBILITY
========================================= */

if (homeBlogGrid) {

    const blogCards =
        homeBlogGrid.querySelectorAll(
            ".blog-card"
        );


    blogCards.forEach(
        function (card) {

            card.setAttribute(
                "tabindex",
                "0"
            );


            card.setAttribute(
                "role",
                "button"
            );


            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        card.click();
                    }
                }
            );
        }
    );
}


/* =========================================
   CREATE BLOG - CLEAR EDIT MODE
========================================= */

if (
    currentPage === "create-blog.html" &&
    !document.getElementById("blogForm")
) {

    localStorage.removeItem(
        "editingBlogId"
    );
}