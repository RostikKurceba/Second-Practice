document.addEventListener("DOMContentLoaded", async () => {
    const userEmail = document.getElementById("userEmail");
    const logoutButton = document.getElementById("logoutButton");

    // Перевірка авторизації
    try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
            window.location.href = "/login.html";
            return;
        }

        const user = await response.json();

        if (user.role !== "ADMIN") {
            window.location.href = "/login.html";
            return;
        }

        userEmail.textContent = user.email;

    } catch (error) {
        console.error("Помилка перевірки авторизації:", error);
        window.location.href = "/login.html";
        return;
    }

    // Завантаження статистики
    await loadStatistics();

    // Вихід
    logoutButton.addEventListener("click", async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST"
            });
        } finally {
            window.location.href = "/login.html";
        }
    });
});

async function loadStatistics() {
    const studentCount = document.getElementById("studentCount");
    const groupCount = document.getElementById("groupCount");
    const disciplineCount = document.getElementById("disciplineCount");

    try {
        const [
            studentsResponse,
            groupsResponse,
            disciplinesResponse
        ] = await Promise.all([
            fetch("/api/students"),
            fetch("/api/groups"),
            fetch("/api/disciplines")
        ]);

        if (!studentsResponse.ok) {
            throw new Error("Не вдалося завантажити студентів");
        }

        if (!groupsResponse.ok) {
            throw new Error("Не вдалося завантажити групи");
        }

        if (!disciplinesResponse.ok) {
            throw new Error("Не вдалося завантажити дисципліни");
        }

        const students = await studentsResponse.json();
        const groups = await groupsResponse.json();
        const disciplines = await disciplinesResponse.json();

        studentCount.textContent = students.length;
        groupCount.textContent = groups.length;
        disciplineCount.textContent = disciplines.length;

    } catch (error) {
        console.error("Помилка завантаження статистики:", error);

        studentCount.textContent = "-";
        groupCount.textContent = "-";
        disciplineCount.textContent = "-";
    }
}