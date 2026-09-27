const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {

            message.textContent =
                "Вхід успішний! Перенаправлення...";

            setTimeout(() => {

                if (data.role === "ADMIN") {

                    window.location.href = "/admin.html";

                } else {

                    window.location.href = "/student.html";
                }

            }, 500);

        } else {

            message.textContent =
                data.message || "Неправильний email або пароль";
        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Не вдалося підключитися до сервера";
    }
});