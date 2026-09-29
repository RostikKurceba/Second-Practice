let selectedGroupId = null;

const groupsList =
    document.getElementById("groupsList");

const modal =
    document.getElementById("groupModal");

const groupForm =
    document.getElementById("groupForm");

const modalTitle =
    document.getElementById("modalTitle");

const formMessage =
    document.getElementById("formMessage");

async function openDisciplinesModal(groupId) {

    selectedGroupId = groupId;

    const modal =
        document.getElementById(
            "disciplinesModalOverlay"
        );

    const selection =
        document.getElementById(
            "disciplinesSelection"
        );

    const groupName =
        document.getElementById(
            "disciplinesGroupName"
        );

    const message =
        document.getElementById(
            "disciplinesMessage"
        );

    selection.innerHTML = `
        <div class="empty-state">
            Завантаження...
        </div>
    `;

    message.textContent = "";

    modal.style.display = "flex";

    try {

        const groupsResponse =
            await fetch("/api/groups");

        if (!groupsResponse.ok) {
            throw new Error(
                "Не вдалося завантажити групи"
            );
        }

        const groups =
            await groupsResponse.json();

        const group =
            groups.find(
                item => item.id === groupId
            );

        if (group) {

            groupName.textContent =
                `${group.name} • ${group.specialty}`;
        }

        const disciplinesResponse =
            await fetch("/api/disciplines");

        if (!disciplinesResponse.ok) {
            throw new Error(
                "Не вдалося завантажити дисципліни"
            );
        }

        const disciplines =
            await disciplinesResponse.json();

        const groupDisciplinesResponse =
            await fetch(
                `/api/groups/${groupId}/disciplines`
            );

        if (!groupDisciplinesResponse.ok) {
            throw new Error(
                "Не вдалося отримати дисципліни групи"
            );
        }

        const groupDisciplines =
            await groupDisciplinesResponse.json();

        const selectedIds =
            groupDisciplines.map(
                discipline => discipline.id
            );

        renderDisciplineSelection(
            disciplines,
            selectedIds
        );

    } catch (error) {

        console.error(error);

        selection.innerHTML = `
            <div class="empty-state">
                Не вдалося завантажити дисципліни.
            </div>
        `;
    }
}

async function openStudentsModal(groupId) {

    const modal =
        document.getElementById(
            "studentsModalOverlay"
        );

    const studentsSelection =
        document.getElementById(
            "studentsSelection"
        );

    const groupName =
        document.getElementById(
            "studentsGroupName"
        );

    studentsSelection.innerHTML = `
        <div class="empty-state">
            Завантаження...
        </div>
    `;

    modal.style.display = "flex";

    try {

        const groupResponse =
            await fetch(`/api/groups/${groupId}`);

        if (!groupResponse.ok) {
            throw new Error(
                "Не вдалося завантажити групу"
            );
        }

        const group =
            await groupResponse.json();

        groupName.textContent =
            `${group.name} • ${group.specialty}`;


        const response =
            await fetch(
                `/api/groups/${groupId}/students`
            );

        if (!response.ok) {
            throw new Error(
                "Не вдалося завантажити студентів"
            );
        }

        const students =
            await response.json();

        renderGroupStudents(students);

    } catch (error) {

        console.error(error);

        studentsSelection.innerHTML = `
            <div class="empty-state">
                Не вдалося завантажити студентів.
            </div>
        `;
    }
}

function renderGroupStudents(students) {

    const studentsSelection =
        document.getElementById(
            "studentsSelection"
        );

    if (students.length === 0) {

        studentsSelection.innerHTML = `
            <div class="empty-state">
                У цій групі поки немає студентів.
            </div>
        `;

        return;
    }

    studentsSelection.innerHTML = students
        .map(student => {

            const fullName = [
                student.lastName,
                student.firstName,
                student.patronymic
            ]
                .filter(Boolean)
                .join(" ");

            return `
                <div class="student-group-item">

                    <div class="student-group-info">

                        <strong>
                            ${escapeHtml(fullName)}
                        </strong>

                        <span>
                            ${escapeHtml(
                                student.email
                            )}
                        </span>

                    </div>

                    <div class="student-group-course">
                        ${student.course} курс
                    </div>

                </div>
            `;

        })
        .join("");
}

function closeStudentsModal() {

    document.getElementById(
        "studentsModalOverlay"
    ).style.display = "none";
}

async function checkAdmin() {

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
}

function renderDisciplineSelection(
    disciplines,
    selectedIds
) {

    const selection =
        document.getElementById(
            "disciplinesSelection"
        );

    if (disciplines.length === 0) {

        selection.innerHTML = `
            <div class="empty-state">
                Дисциплін поки немає.
                Спочатку створіть дисципліни.
            </div>
        `;

        return;
    }

    selection.innerHTML =
        disciplines.map(discipline => {

            const checked =
                selectedIds.includes(
                    discipline.id
                )
                    ? "checked"
                    : "";

            return `
                <label class="discipline-option">

                    <input
                        type="checkbox"
                        value="${discipline.id}"
                        ${checked}
                    >

                    <span>
                        <strong>
                            ${escapeHtml(
                                discipline.name
                            )}
                        </strong>

                        <small>
                            ${escapeHtml(
                                discipline.code
                            )}
                            •
                            ${discipline.hours} год.
                        </small>
                    </span>

                </label>
            `;

        }).join("");
}

async function saveGroupDisciplines() {

    if (!selectedGroupId) {
        return;
    }

    const checkboxes =
        document.querySelectorAll(
            "#disciplinesSelection input[type='checkbox']"
        );

    const disciplineIds =
        Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => Number(checkbox.value));

    const message =
        document.getElementById(
            "disciplinesMessage"
        );

    try {

        const response =
            await fetch(
                `/api/groups/${selectedGroupId}/disciplines`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(
                        disciplineIds
                    )
                }
            );

        const data =
            await response.text();

        if (!response.ok) {

            message.textContent = data;

            return;
        }

        closeDisciplinesModal();

        await loadGroups();

    } catch (error) {

        console.error(error);

        message.textContent =
            "Не вдалося зберегти дисципліни";
    }
}

function closeDisciplinesModal() {

    document.getElementById(
        "disciplinesModalOverlay"
    ).style.display = "none";

    selectedGroupId = null;
}

async function loadGroups() {

    try {

        const response =
            await fetch("/api/groups");

        if (!response.ok) {

            groupsList.innerHTML =
                "<p>Не вдалося завантажити групи.</p>";

            return;
        }

        const groups =
            await response.json();

        if (groups.length === 0) {

            groupsList.innerHTML = `
                <div class="empty-state">
                    <h3>Груп ще немає</h3>
                    <p>
                        Створіть першу навчальну групу.
                    </p>
                </div>
            `;

            return;
        }

        groupsList.innerHTML = "";

        groups.forEach(group => {

            const card =
                document.createElement("div");

            card.className = "group-card";

            card.addEventListener(
                "click",
                () => openStudentsModal(group.id)
            );

            card.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target.closest(".group-actions")
                    ) {
                        return;
                    }

                    openStudentsModal(group.id);
                }
            );

            card.innerHTML = `

                <div class="group-info">

                    <h3>${group.name}</h3>

                    <p>
                        ${group.specialty}
                    </p>

                    <span>
                        ${group.course} курс
                    </span>

                    <span>
                        ${group.year} рік
                    </span>

                </div>

                <div class="group-actions">

                    <button
                        class="disciplines-button"
                        onclick="openDisciplinesModal(${group.id})"
                    >
                        Дисципліни
                    </button>

                    <button
                        onclick="editGroup(
                            ${group.id},
                            '${escapeHtml(group.name)}',
                            '${escapeHtml(group.specialty)}',
                            ${group.course},
                            ${group.year}
                        )"
                    >
                        Редагувати
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteGroup(${group.id})"
                    >
                        Видалити
                    </button>

                </div>

            `;

            groupsList.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        groupsList.innerHTML =
            "<p>Помилка підключення до сервера.</p>";
    }
}


function escapeHtml(value) {

    return value
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");
}


function openCreateModal() {

    modalTitle.textContent =
        "Створення групи";

    document.getElementById("groupId")
        .value = "";

    groupForm.reset();

    formMessage.textContent = "";

    modal.classList.add("show");
}


function editGroup(
    id,
    name,
    specialty,
    course,
    year
) {

    modalTitle.textContent =
        "Редагування групи";

    document.getElementById("groupId")
        .value = id;

    document.getElementById("groupName")
        .value = name;

    document.getElementById("specialty")
        .value = specialty;

    document.getElementById("course")
        .value = course;

    document.getElementById("year")
        .value = year;

    formMessage.textContent = "";

    modal.classList.add("show");
}


function closeModal() {

    modal.classList.remove("show");
}


groupForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const id =
            document.getElementById("groupId").value;

        const group = {

            name:
                document.getElementById("groupName").value,

            specialty:
                document.getElementById("specialty").value,

            course:
                Number(
                    document.getElementById("course").value
                ),

            year:
                Number(
                    document.getElementById("year").value
                )
        };


        const method =
            id ? "PUT" : "POST";

        const url =
            id
                ? `/api/groups/${id}`
                : "/api/groups";


        try {

            const response =
                await fetch(url, {

                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(group)

                });


            const data =
                await response.text();


            if (response.ok) {

                closeModal();

                await loadGroups();

            } else {

                formMessage.textContent =
                    data;
            }

        } catch (error) {

            console.error(error);

            formMessage.textContent =
                "Не вдалося підключитися до сервера";
        }

    }
);


async function deleteGroup(id) {

    const confirmed =
        confirm(
            "Ви дійсно хочете видалити цю групу?"
        );

    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/groups/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.text();


        if (response.ok) {

            await loadGroups();

        } else {

            alert(data);
        }

    } catch (error) {

        console.error(error);

        alert(
            "Не вдалося підключитися до сервера"
        );
    }
}


document
    .getElementById("addGroupButton")
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


document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        async function () {

            await fetch(
                "/api/auth/logout",
                {
                    method: "POST"
                }
            );

            window.location.href =
                "/login.html";
        }
    );


async function init() {

    const isAdmin =
        await checkAdmin();

    if (isAdmin) {

        await loadGroups();
    }
}

document
    .getElementById("saveDisciplinesButton")
    .addEventListener(
        "click",
        saveGroupDisciplines
    );

document
    .getElementById("cancelDisciplinesButton")
    .addEventListener(
        "click",
        closeDisciplinesModal
    );

document
    .getElementById("cancelStudentsButton")
    .addEventListener(
        "click",
        closeStudentsModal
    );

init();