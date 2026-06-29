const API_URL = "http://localhost:8000/students";

loadStudents();

async function loadStudents() {

    const response = await fetch(API_URL + "/");
    const students = await response.json();

    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.forEach(student => {

        table.innerHTML += `
        <tr>
            <td>${student.id}</td>
            <td>${student.first_name} ${student.last_name}</td>
            <td>${student.email}</td>
            <td>${student.department}</td>
            <td>${student.year}</td>

            <td>
                <button class="edit-btn"
                    onclick="editStudent(${student.id})">
                    Edit
                </button>

                <button class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}

function getFormData() {

    return {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        age: parseInt(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        department: document.getElementById("department").value,
        year: parseInt(document.getElementById("year").value)
    };
}

async function saveStudent() {

    const studentId =
        document.getElementById("studentId").value;

    const studentData = getFormData();

    if(studentId){

        await fetch(`${API_URL}/${studentId}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(studentData)
        });

        alert("Student updated");

    } else {

        const response = await fetch(API_URL + "/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(studentData)
        });

        if(response.status === 409){
            alert("Email already exists");
            return;
        }

        alert("Student added");
    }

    clearForm();
    loadStudents();
}

async function editStudent(id){

    const response =
        await fetch(`${API_URL}/${id}`);

    const student =
        await response.json();

    document.getElementById("studentId").value =
        student.id;

    document.getElementById("first_name").value =
        student.first_name;

    document.getElementById("last_name").value =
        student.last_name;

    document.getElementById("email").value =
        student.email;

    document.getElementById("phone").value =
        student.phone;

    document.getElementById("age").value =
        student.age;

    document.getElementById("gender").value =
        student.gender;

    document.getElementById("department").value =
        student.department;

    document.getElementById("year").value =
        student.year;
}

async function deleteStudent(id){

    const confirmDelete =
        confirm("Delete this student?");

    if(!confirmDelete)
        return;

    await fetch(`${API_URL}/${id}`,{
        method:"DELETE"
    });

    loadStudents();
}

function clearForm(){

    document.getElementById("studentId").value="";
    document.getElementById("first_name").value="";
    document.getElementById("last_name").value="";
    document.getElementById("email").value="";
    document.getElementById("phone").value="";
    document.getElementById("age").value="";
    document.getElementById("gender").value="";
    document.getElementById("department").value="";
    document.getElementById("year").value="";
}