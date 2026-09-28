let students = [];
let groups = [];
let selectedStudentId = null;


const studentsList =
    document.getElementById("studentsList");

const facultyFilter =
    document.getElementById("facultyFilter");

const courseFilter =
    document.getElementById("courseFilter");

const groupModalOverlay =
    document.getElementById("groupModalOverlay");

const groupStudentName =
    document.getElementById("groupStudentName");

const groupSelect =
    document.getElementById("groupSelect");

const groupMessage =
    document.getElementById("groupMessage");

const saveGroupButton =
    document.getElementById("saveGroupButton");

const cancelGroupButton =
    document.getElementById("cancelGroupButton");


async function loadStudents() {

    try {

        const response =
            await fetch("/api/students");

        if (!response.ok) {

            if (response.status === 403) {

                studentsList.innerHTML =
                    `<div class="empty-state">
                        Доступ заборонено
                    </div>`;

                return;
            }

            throw new Error(
                "Помилка завантаження студентів"
            );
        }

        students =
            await response.json();

        loadFacultyFilter();

        renderStudents();

    } catch (error) {

        console.error(error);

        studentsList.innerHTML =
            `<div class="empty-state">
                Не вдалося завантажити студентів
            </div>`;
    }
}


async function loadGroups() {

    try {

        const response =
            await fetch("/api/groups");

        if (!response.ok) {

            throw new Error(
                "Не вдалося завантажити групи"
            );
        }

        groups =
            await response.json();

    } catch (error) {

        console.error(error);

        groups = [];
    }
}


function loadFacultyFilter() {

    const faculties =
        [...new Set(
            students.map(
                student => student.faculty
            )
        )];

    faculties.sort();

    facultyFilter.innerHTML =
        `<option value="">
            Усі факультети
        </option>`;

    faculties.forEach(faculty => {

        const option =
            document.createElement("option");

        option.value = faculty;
        option.textContent = faculty;

        facultyFilter.appendChild(option);
    });
}


function renderStudents() {

    const selectedFaculty =
        facultyFilter.value;

    const selectedCourse =
        courseFilter.value;

    const filteredStudents =
        students.filter(student => {

            const facultyMatches =
                !selectedFaculty ||
                student.faculty === selectedFaculty;

            const courseMatches =
                !selectedCourse ||
                student.course.toString() === selectedCourse;

            return facultyMatches &&
                   courseMatches;
        });


    if (filteredStudents.length === 0) {

        studentsList.innerHTML =
            `<div class="empty-state">
                Студентів не знайдено
            </div>`;

        return;
    }


    studentsList.innerHTML =
        filteredStudents
            .map(student => createStudentCard(student))
            .join("");
}


function createStudentCard(student) {

    const fullName =
        [
            student.lastName,
            student.firstName,
            student.patronymic
        ]
        .filter(Boolean)
        .join(" ");


    const groupText =
        student.groupName
            ? student.groupName
            : "Групу не призначено";


    return `
        <div class="student-card">

            <h3>${fullName}</h3>

            <div class="student-info">

                <p>
                    <strong>Факультет:</strong>
                    ${student.faculty}
                </p>

                <p>
                    <strong>Курс:</strong>
                    ${student.course}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${student.email}
                </p>

                <p>
                    <strong>Телефон:</strong>
                    ${student.phone || "Не вказано"}
                </p>

            </div>

            <div class="student-group">

                <strong>Група:</strong>

                <span class="${
                    student.groupName
                        ? ""
                        : "no-group"
                }">
                    ${groupText}
                </span>

                <button
                    class="assign-group-button"
                    onclick="openGroupModal(${student.id})"
                >
                    ${
                        student.groupName
                            ? "Змінити групу"
                            : "Призначити групу"
                    }
                </button>

            </div>

        </div>
    `;
}


async function openGroupModal(studentId) {

    selectedStudentId = studentId;

    const student =
        students.find(
            student => student.id === studentId
        );

    if (!student) {
        return;
    }

    const fullName =
        [
            student.lastName,
            student.firstName,
            student.patronymic
        ]
        .filter(Boolean)
        .join(" ");

    groupStudentName.textContent =
        `Студент: ${fullName}`;

    groupMessage.textContent = "";

    await loadGroups();

    groupSelect.innerHTML =
        `<option value="">
            Оберіть групу
        </option>`;

    groups.forEach(group => {

        const option =
            document.createElement("option");

        option.value = group.id;

        option.textContent =
            `${group.name} | ${group.specialty} | ${group.course} курс`;

        groupSelect.appendChild(option);
    });


    if (student.groupId) {

        groupSelect.value =
            student.groupId;
    }


    groupModalOverlay.style.display =
        "flex";
}


function closeGroupModal() {

    selectedStudentId = null;

    groupModalOverlay.style.display =
        "none";

    groupMessage.textContent = "";
}


async function saveGroup() {

    if (!selectedStudentId) {
        return;
    }

    const groupId =
        groupSelect.value;

    if (!groupId) {

        groupMessage.textContent =
            "Оберіть групу";

        return;
    }


    saveGroupButton.disabled = true;

    groupMessage.textContent =
        "Збереження...";


    try {

        const response =
            await fetch(
                `/api/students/${selectedStudentId}/group/${groupId}`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const message =
                await response.text();

            groupMessage.textContent =
                message ||
                "Не вдалося призначити групу";

            return;
        }


        const updatedStudent =
            await response.json();


        const index =
            students.findIndex(
                student =>
                    student.id === selectedStudentId
            );


        if (index !== -1) {

            students[index] =
                updatedStudent;
        }


        renderStudents();

        closeGroupModal();

    } catch (error) {

        console.error(error);

        groupMessage.textContent =
            "Не вдалося підключитися до сервера";

    } finally {

        saveGroupButton.disabled = false;
    }
}


facultyFilter.addEventListener(
    "change",
    renderStudents
);

courseFilter.addEventListener(
    "change",
    renderStudents
);

saveGroupButton.addEventListener(
    "click",
    saveGroup
);

cancelGroupButton.addEventListener(
    "click",
    closeGroupModal
);


groupModalOverlay.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            groupModalOverlay
        ) {
            closeGroupModal();
        }

    }
);


loadStudents();