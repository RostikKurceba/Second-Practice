const registerForm =
    document.getElementById("registerForm");

const message =
    document.getElementById("message");

const studentFields =
    document.getElementById("studentFields");

const roleInputs =
    document.querySelectorAll(
        'input[name="role"]'
    );


function updateStudentFields() {

    const selectedRole =
        document.querySelector(
            'input[name="role"]:checked'
        );

    if (!selectedRole) {
        studentFields.style.display = "none";
        return;
    }

    if (selectedRole.value === "STUDENT") {

        studentFields.style.display = "block";

    } else {

        studentFields.style.display = "none";

    }
}


roleInputs.forEach(input => {

    input.addEventListener(
        "change",
        updateStudentFields
    );

});


registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        message.textContent = "";

        const selectedRole =
            document.querySelector(
                'input[name="role"]:checked'
            );

        if (!selectedRole) {

            message.textContent =
                "Оберіть роль";

            return;
        }


        const role =
            selectedRole.value;


        const data = {

            email:
                document.getElementById(
                    "email"
                ).value,

            password:
                document.getElementById(
                    "password"
                ).value,

            confirmPassword:
                document.getElementById(
                    "confirmPassword"
                ).value,

            role: role

        };


        if (role === "STUDENT") {

            data.firstName =
                document.getElementById(
                    "firstName"
                ).value;

            data.lastName =
                document.getElementById(
                    "lastName"
                ).value;

            data.patronymic =
                document.getElementById(
                    "patronymic"
                ).value;

            data.phone =
                document.getElementById(
                    "phone"
                ).value;

            data.faculty =
                document.getElementById(
                    "faculty"
                ).value;

            data.course =
                Number(
                    document.getElementById(
                        "course"
                    ).value
                );

        }


        try {

            const response =
                await fetch(
                    "/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    result.message ||
                    "Помилка реєстрації";

                return;
            }


            message.textContent =
                result.message ||
                "Реєстрація успішна";


            setTimeout(
                () => {
                    window.location.href =
                        "/login.html";
                },
                1000
            );


        } catch (error) {

            console.error(error);

            message.textContent =
                "Не вдалося підключитися до сервера";

        }

    }
);


updateStudentFields();