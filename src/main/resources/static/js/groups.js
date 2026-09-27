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


init();