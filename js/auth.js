
const API_URL = "https://codomax-blog-api-kyyo.onrender.com/api";

/* =========================================
   USER REGISTRATION
========================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("registerEmail")?.value.trim();
        const password = document.getElementById("registerPassword")?.value;
        const confirmPassword = document.getElementById("confirmPassword")?.value;
        const terms = document.getElementById("terms")?.checked;

        if (!name || !email || !password || !confirmPassword) {
            alert("Please complete all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!terms) {
            alert("Please accept the terms and conditions.");
            return;
        }

        const submitButton = registerForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Creating Account...";
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            alert("Account created successfully! Please login.");

            window.location.href = "login.html";

        } catch (error) {
            console.error("Registration error:", error);

            alert(
                error.message ||
                "Unable to connect to the server. Please try again."
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Create Account";
            }
        }
    });
}


/* =========================================
   USER LOGIN
========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;
        const remember = document.getElementById("remember")?.checked;

        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        const submitButton = loginForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Logging in...";
        }

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            }

            if (!data.token || !data.user) {
                throw new Error("Invalid login response from server.");
            }

            // Clear previous authentication data.
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            // Store authentication based on Remember Me.
            const storage = remember ? localStorage : sessionStorage;

            storage.setItem("token", data.token);
            storage.setItem("user", JSON.stringify(data.user));

            alert("Login successful!");

            window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Login error:", error);

            alert(
                error.message ||
                "Unable to connect to the server. Please try again."
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Login";
            }
        }
    });
}
