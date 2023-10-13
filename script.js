var today = new Date();
var countDay = 0;
var currentDay = new Date(today);
var show = false;

const backBtn = document.getElementById('back');
const nextBtn = document.getElementById('next');
const scheduleContainer = document.getElementById('schedule-container');

backBtn.addEventListener('click', gotoPreviousWeek);
nextBtn.addEventListener('click', gotoNextWeek);

const demoTask = {
    id: 0,
    title: "Test Event",
    description: "Test Event Description",
    date: formatDate(today),
    time: 4,
    isAlert: false
};

var tasks = [demoTask];
var taskId = 1;

function gotoNextWeek() {
    countDay += 7;
    currentDay = new Date(today);

    let day = currentDay.getDate();
    currentDay.setDate(day + countDay);
    renderUI();
}

function gotoPreviousWeek() {
    countDay -= 7;
    currentDay = new Date(today);

    let day = currentDay.getDate();
    currentDay.setDate(day + countDay);
    renderUI();
}

const cancel_modal = document.getElementById('cancel');
const save_modal = document.getElementById('save');

function clearModal() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('hour-task').value = '';
    document.getElementById('date-task').value = '';
    document.getElementById('task-id').value = '';
}

function setDataModal(date, hour, title = '', description = '', $id = '-1') {
    document.getElementById('date-task').value = formatDate(date);
    document.getElementById('hour-task').value = hour;
    document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    document.getElementById('task-id').value = $id;
}
cancel_modal.addEventListener('click', function () {
    document.querySelector('.register').style = 'margin-left: -100%;';
    show = false;
});

save_modal.addEventListener('click', function () {
    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;
    var hour = document.getElementById('hour-task').value;
    var date = document.getElementById('date-task').value;

    var task = {
        id: taskId,
        title: title,
        description: description,
        date: date,
        time: parseInt(hour),
        isAlert: false
    };

    tasks.push(task);
    taskId++;

    document.querySelector('.register').style = 'margin-left: -100%;';

    show = false;
    clearModal();
    renderUI();
});

var alertModal = document.getElementById("alert-task");
var closeAlert = alertModal.getElementsByClassName("close")[0];
closeAlert.onclick = function () {
    alertModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == alertModal) {
        alertModal.style.display = "none";
    }
}

function showAlert(task) {
    document.getElementById('alert-title').innerText = "Task " + task.title + " is coming !!!!";
    document.getElementById('alert-date').innerHTML = "Task Date: " + task.date;
    document.getElementById('alert-time').innerText = "Task time: " + task.time;
    document.getElementById('alert-description').innerText = "Task description: " + task.description;
    alertModal.style.display = "block";
}

function compareDate(dateOne, dateTwo) {
    var day1 = dateOne.getDate();
    var month1 = dateOne.getMonth();
    var year1 = dateOne.getFullYear();

    var day2 = dateTwo.getDate();
    var month2 = dateTwo.getMonth();
    var year2 = dateTwo.getFullYear();

    if (day1 == day2 && month1 == month2 && year1 == year2) {
        return true;
    }
    return false;
}

function formatDate(date) {
    var d = new Date(date),

        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function detectTimeChange() {
    setInterval(function () {
        if (!compareDate(today, new Date())) {
            today = new Date();
            currentDay = new Date(today);
            countDay = 0;
            renderUI();
        }

    }, 1000);
}

function checkTaskAlert() {
    let currentTime = today.toLocaleString('en-US', {
        hour: '2-digit',
        hour12: false,
    });
    let time = parseInt(currentTime);
    setInterval(function () {
        tasks.forEach(task => {
            if (task.time == time) {
                if ((formatDate(today) == task.date)) {
                    if (!task.isAlert) {
                        showAlert(task);
                        task.isAlert = true;
                    }
                }
            }
        });
    }, 1000);
}

function setMonthYear() {
    let currentMonth = currentDay.getMonth();
    let currentYear = currentDay.getFullYear();

    let monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let monthName = monthsArray[currentMonth];

    const month = document.getElementById('month');
    const year = document.getElementById('year');

    month.innerText = monthName;
    year.innerText = currentYear;
}

function createDayofWeek() {
    let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayofweek = document.getElementById('dayofweek');
    dayofweek.innerHTML = "";

    var corner = document.createElement('div');
    corner.className = 'corner';
    corner.innerHTML = "Toronto Time";
    dayofweek.appendChild(corner);

    const createDay = new Date(currentDay);
    let _dayofweek = createDay.getDay();
    let day = createDay.getDate();

    for (let i = 0; i < 7; i++) {
        const div = document.createElement('div');
        div.className = 'day';
        var getDay = new Date(currentDay);
        getDay.setDate(day + (i - _dayofweek));
        div.innerHTML = `${weekDays[i]}<br>${getDay.getDate()}`;

        if (compareDate(getDay, today)) {
            div.className = 'day-active';
        }
        dayofweek.appendChild(div);
    }
    return dayofweek;
}

function setTask(e, task) {
    e.style.backgroundColor = "#f7f779";
    e.innerHTML = `<span><b>Title: </b>${task.title} <br/> <b>Description: </b>${task.description}</span>`;
    e.id = task.id;
};

function createPartDay(time) {
    var partDay = document.createElement('div');
    partDay.className = 'part__day';

    const span = document.createElement('span');
    span.className = 'time';
    span.innerHTML = time + "h";
    partDay.appendChild(span);

    const createDay = new Date(currentDay);
    let _dayofweek = createDay.getDay();
    let day = createDay.getDate();

    for (let i = 0; i < 7; i++) {
        const div = document.createElement('div');
        div.className = 'task';

        const hidden = document.createElement('div');
        hidden.hidden = true;
        hidden.className = 'data';
        var getDay = new Date(currentDay);
        getDay.setDate(day + (i - _dayofweek));
        hidden.innerText = getDay + ";" + time;
        div.appendChild(hidden);

        tasks.forEach(task => {
            if (task.time == time) {
                if ((formatDate(getDay) == task.date)) {
                    setTask(div, task);
                }
            }
        });
        partDay.appendChild(div);
    }
    return partDay;
}

function createTime() {
    const timeOfDays = document.getElementById('time');
    timeOfDays.innerHTML = "";

    for (let i = 0; i < 24; i++) {
        partDay = createPartDay(i);
        timeOfDays.appendChild(partDay);
    }
}

function renderUI() {
    setMonthYear();
    createDayofWeek();
    createTime();
}

document.onclick = function (e) {
    if (e.target.classList.contains('task') && !show) {
        clearModal();
        document.getElementById('register-title').innerHTML = 'Create event/reminder';
        document.querySelector('.register').style = 'margin-left: -20px;';
        show = true;

        const data = e.target.getElementsByClassName('data')[0].innerHTML;
        const datas = data.split(";");
        setDataModal(datas[0], datas[1]);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    detectTimeChange();
    checkTaskAlert();
    renderUI();
})
