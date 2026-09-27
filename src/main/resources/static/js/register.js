const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const selectedRole =
        document.querySelector('input[name="role"]:checked');

    if (!selectedRole) {

        message.textContent =
            "Оберіть роль";

        return;
    }

    const role = selectedRole.value;

    if (password !== confirmPassword) {

        message.textContent =
            "Паролі не співпадають";

        return;
    }

    try {

        const response = await fetch("/api/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                role: role
            })
        });

        const data = await response.text();

        if (response.ok) {

            message.textContent =
                "Реєстрація успішна! Перенаправлення...";

            setTimeout(() => {
                window.location.href = "/login.html";
            }, 1000);

        } else {

            message.textContent = data;
        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Не вдалося підключитися до сервера";
    }
});