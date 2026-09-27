let editingDisciplineId = null;

const disciplinesList =
    document.getElementById("disciplinesList");

const modalOverlay =
    document.getElementById("modalOverlay");

const disciplineForm =
    document.getElementById("disciplineForm");

const modalTitle =
    document.getElementById("modalTitle");

const formMessage =
    document.getElementById("formMessage");

async function checkAdmin() {

    try {

        const response =
            await fetch("/api/auth/me");

        if (!response.ok) {

            window.location.href =
                "/login.html";

            return false;
        }

        const user =
            await response.json();

        if (user.role !== "ADMIN") {

            window.location.href =
                "/student.html";

            return false;
        }

        document.getElementById("userEmail")
            .textContent = user.email;

        return true;

    } catch (error) {

        console.error(error);

        window.location.href =
            "/login.html";

        return false;
    }
}

async function loadDisciplines() {

    try {

        const response =
            await fetch("/api/disciplines");

        if (!response.ok) {

            disciplinesList.innerHTML = `
                <div class="empty-state">
                    Не вдалося завантажити дисципліни.
                </div>
            `;

            return;
        }

        const disciplines =
            await response.json();

        renderDisciplines(disciplines);

    } catch (error) {

        console.error(error);

        disciplinesList.innerHTML = `
            <div class="empty-state">
                Не вдалося підключитися до сервера.
            </div>
        `;
    }
}

function renderDisciplines(disciplines) {

    if (disciplines.length === 0) {

        disciplinesList.innerHTML = `
            <div class="empty-state">
                Дисциплін поки немає.
            </div>
        `;

        return;
    }

    disciplinesList.innerHTML =
        disciplines.map(discipline => `

            <div class="discipline-card">

                <div class="discipline-info">

                    <h2>
                        ${escapeHtml(discipline.name)}
                    </h2>

                    <span class="discipline-code">
                        ${escapeHtml(discipline.code)}
                    </span>

                    <p>
                        ${
                            discipline.description
                                ? escapeHtml(
                                    discipline.description
                                )
                                : "Опис відсутній"
                        }
                    </p>

                    <div class="discipline-hours">
                        Годин: ${discipline.hours}
                    </div>

                </div>

                <div class="discipline-actions">

                    <button
                        class="edit-button"
                        onclick="editDiscipline(${discipline.id})"
                    >
                        Редагувати
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteDiscipline(${discipline.id})"
                    >
                        Видалити
                    </button>

                </div>

            </div>

        `).join("");
}

function openCreateModal() {

    editingDisciplineId = null;

    modalTitle.textContent =
        "Створення дисципліни";

    disciplineForm.reset();

    formMessage.textContent = "";

    modalOverlay.style.display = "flex";
}

async function editDiscipline(id) {

    try {

        const response =
            await fetch(`/api/disciplines/${id}`);

        if (!response.ok) {

            alert("Не вдалося отримати дисципліну");

            return;
        }

        const discipline =
            await response.json();

        editingDisciplineId = id;

        modalTitle.textContent =
            "Редагування дисципліни";

        document.getElementById("name").value =
            discipline.name;

        document.getElementById("code").value =
            discipline.code;

        document.getElementById("description").value =
            discipline.description || "";

        document.getElementById("hours").value =
            discipline.hours;

        formMessage.textContent = "";

        modalOverlay.style.display = "flex";

    } catch (error) {

        console.error(error);

        alert(
            "Не вдалося підключитися до сервера"
        );
    }
}

async function saveDiscipline(event) {

    event.preventDefault();

    const discipline = {

        name:
            document.getElementById("name")
                .value
                .trim(),

        code:
            document.getElementById("code")
                .value
                .trim(),

        description:
            document.getElementById("description")
                .value
                .trim(),

        hours:
            Number(
                document.getElementById("hours").value
            )
    };

    try {

        const url =
            editingDisciplineId
                ? `/api/disciplines/${editingDisciplineId}`
                : "/api/disciplines";

        const method =
            editingDisciplineId
                ? "PUT"
                : "POST";

        const response =
            await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(discipline)
            });

        const data =
            await response.text();

        if (!response.ok) {

            formMessage.textContent = data;

            return;
        }

        closeModal();

        await loadDisciplines();

    } catch (error) {

        console.error(error);

        formMessage.textContent =
            "Не вдалося підключитися до сервера";
    }
}

async function deleteDiscipline(id) {

    const confirmed =
        confirm(
            "Ви дійсно хочете видалити цю дисципліну?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `/api/disciplines/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            const message =
                await response.text();

            alert(message);

            return;
        }

        await loadDisciplines();

    } catch (error) {

        console.error(error);

        alert(
            "Не вдалося підключитися до сервера"
        );
    }
}

function closeModal() {

    modalOverlay.style.display = "none";

    editingDisciplineId = null;

    disciplineForm.reset();

    formMessage.textContent = "";
}

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document
    .getElementById("createDisciplineButton")
    .addEventListener(
        "click",
        openCreateModal
    );

document
    .getElementById("cancelButton")
    .addEventListener(
        "click",
        closeModal
    );

disciplineForm.addEventListener(
    "submit",
    saveDiscipline
);

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        async function () {

            try {

                await fetch(
                    "/api/auth/logout",
                    {
                        method: "POST"
                    }
                );

                window.location.href =
                    "/login.html";

            } catch (error) {

                console.error(error);
            }
        }
    );

async function init() {

    const isAdmin =
        await checkAdmin();

    if (!isAdmin) {
        return;
    }

    await loadDisciplines();
}

init();