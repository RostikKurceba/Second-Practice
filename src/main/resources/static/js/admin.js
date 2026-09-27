async function loadAdminPage() {

    try {

        const response = await fetch("/api/auth/me");

        if (!response.ok) {

            window.location.href = "/login.html";

            return;
        }

        const user = await response.json();

        if (user.role !== "ADMIN") {

            window.location.href = "/student.html";

            return;
        }

        document.getElementById("userEmail").textContent =
            user.email;

    } catch (error) {

        console.error(error);

        window.location.href = "/login.html";
    }
}


document.getElementById("logoutButton")
    .addEventListener("click", async function () {

        try {

            await fetch("/api/auth/logout", {
                method: "POST"
            });

            window.location.href = "/login.html";

        } catch (error) {

            console.error(error);
        }

    });


loadAdminPage();