var courseApi = 'http://localhost:3000/course';

function start() {
    getCourses(renderCourses);

    handleCreateForm();
}
start();
//functions
function getCourses(callback) {
    fetch(courseApi)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}
function renderCourses(courses) {
    var listCourseBlock = document.querySelector('#list-courses');
    var htmls = courses.map(function (course) {
        return `
            <li class="course-item-${course.id}">
                <h4>${course.name}</h4>
                <p>${course.description}</p>
                <button class="btn-delete" data-id=${course.id}>Xóa</button>
                <button class="btn-update" data-id=${course.id}>Cập nhật</button>
            </li>
        `;
    })
    listCourseBlock.innerHTML = htmls.join('');
    document.querySelectorAll('.btn-delete').forEach(function (btn) {
        btn.onclick = function () {
            var id = btn.dataset.id;
            handleDeleteCourse(id);
        }
    });
    document.querySelectorAll('.btn-update').forEach(function (btn) {
        btn.onclick = function () {
            var id = btn.dataset.id;
            var name = prompt('Nhập tên mới:');
            var description = prompt('Nhập mô tả mới:');
            if (name && description) {
                handleUpdateCourse(id, { name: name, description: description }, function () {
                    getCourses(renderCourses);
                });
            }
        }
    });
    
}
function createCourse(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }
    fetch(courseApi, options)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

function handleDeleteCourse(id){
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    }
    fetch(courseApi + '/' + id, options)
        .then(function (response) {
            return response.json();
        })
        .then(function(){
            var courseItem=document.querySelector('.course-item-'+id);
            if(courseItem){
                courseItem.remove();
            }
        });
}
function handleUpdateCourse(id, data, callback) {
    var options = {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }
    fetch(courseApi + '/' + id, options)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}
function handleCreateForm() {
    var createBtn = document.querySelector('#create');
    createBtn.onclick = function (e) {
        e.preventDefault();
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;
        var formData = {
            name: name,
            description: description
        };
        createCourse(formData, function () {
            getCourses(renderCourses);
        });
    }
}