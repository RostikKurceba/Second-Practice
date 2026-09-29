document.addEventListener("DOMContentLoaded", async () => {

    const studentEmail =
        document.getElementById("studentEmail");

    const logoutButton =
        document.getElementById("logoutButton");

    const studentFirstName =
        document.getElementById("studentFirstName");

    const studentLastName =
        document.getElementById("studentLastName");

    const studentPatronymic =
        document.getElementById("studentPatronymic");

    const studentPhone =
        document.getElementById("studentPhone");

    const studentFaculty =
        document.getElementById("studentFaculty");

    const studentCourse =
        document.getElementById("studentCourse");

    const groupInfo =
        document.getElementById("groupInfo");

    const disciplinesList =
        document.getElementById("disciplinesList");


    // Перевіряємо авторизацію
    try {

        const authResponse =
            await fetch("/api/auth/me");

        if (!authResponse.ok) {
            window.location.href = "/login.html";
            return;
        }

        const user =
            await authResponse.json();

        if (user.role !== "STUDENT") {
            window.location.href = "/login.html";
            return;
        }

    } catch (error) {

        console.error(
            "Помилка перевірки авторизації:",
            error
        );

        window.location.href = "/login.html";

        return;
    }


    // Завантажуємо дані студента
    try {

        const response =
            await fetch("/api/students/me");

        if (!response.ok) {

            throw new Error(
                "Не вдалося отримати дані студента"
            );
        }

        const student =
            await response.json();


        // Email
        studentEmail.textContent =
            student.email || "-";


        // Особисті дані
        studentFirstName.textContent =
            student.firstName || "-";

        studentLastName.textContent =
            student.lastName || "-";

        studentPatronymic.textContent =
            student.patronymic || "-";

        studentPhone.textContent =
            student.phone || "-";

        studentFaculty.textContent =
            student.faculty || "-";

        studentCourse.textContent =
            student.course || "-";


        // Група
        renderGroup(student);


        // Дисципліни
        renderDisciplines(student);


    } catch (error) {

        console.error(
            "Помилка завантаження студента:",
            error
        );

        studentEmail.textContent =
            "Не вдалося завантажити дані";

        groupInfo.innerHTML = `
            <div class="no-group">
                Не вдалося завантажити інформацію про групу
            </div>
        `;

        disciplinesList.innerHTML = `
            <div class="no-disciplines">
                Не вдалося завантажити дисципліни
            </div>
        `;
    }


    // Вихід
    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                await fetch(
                    "/api/auth/logout",
                    {
                        method: "POST"
                    }
                );

            } finally {

                window.location.href =
                    "/login.html";
            }
        }
    );

});


function renderGroup(student) {

    const groupInfo =
        document.getElementById("groupInfo");


    if (!student.groupId) {

        groupInfo.innerHTML = `
            <div class="no-group">
                Групу ще не призначено
            </div>
        `;

        return;
    }


    groupInfo.innerHTML = `
        <div class="group-card">

            <h3 class="group-name">
                ${escapeHtml(student.groupName)}
            </h3>

            <div class="group-details">

                <div class="group-detail">
                    <span class="group-detail-label">
                        Спеціальність
                    </span>

                    ${escapeHtml(
                        student.groupSpecialty || "-"
                    )}
                </div>

                <div class="group-detail">
                    <span class="group-detail-label">
                        Курс
                    </span>

                    ${student.groupCourse || "-"}
                </div>

                <div class="group-detail">
                    <span class="group-detail-label">
                        Навчальний рік
                    </span>

                    ${student.groupYear || "-"}
                </div>

            </div>

        </div>
    `;
}


function renderDisciplines(student) {

    const disciplinesList =
        document.getElementById(
            "disciplinesList"
        );


    const disciplines =
        student.disciplines || [];


    if (disciplines.length === 0) {

        disciplinesList.innerHTML = `
            <div class="no-disciplines">
                Дисципліни ще не призначені
            </div>
        `;

        return;
    }


    disciplinesList.innerHTML = `
        <div class="disciplines-grid">

            ${disciplines.map(discipline => `

                <div class="discipline-card">

                    <h3>
                        ${escapeHtml(
                            discipline.name
                        )}
                    </h3>

                    <div class="discipline-code">
                        Код:
                        ${escapeHtml(
                            discipline.code
                        )}
                    </div>

                    <div class="discipline-description">
                        ${escapeHtml(
                            discipline.description ||
                            "Опис відсутній"
                        )}
                    </div>

                    <div class="discipline-hours">
                        Години:
                        ${discipline.hours || 0}
                    </div>

                </div>

            `).join("")}

        </div>
    `;
}


function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}