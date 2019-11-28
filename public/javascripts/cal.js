// ================================
// START YOUR APP HERE
// ================================
const info = {
    monList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dayList: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    today: new Date(),
    monForChange: new Date().getMonth(),
    activeDate: new Date(),
    getFirstDay: (yy, mm) => new Date(yy, mm, 1),
    getLastDay: (yy, mm) => new Date(yy, mm + 1, 0),
    nextMonth: function () {
        let d = new Date();
        d.setDate(1);
        d.setMonth(++this.monForChange);
        this.activeDate = d;
        return d;
    },
    prevMonth: function () {
        let d = new Date();
        d.setDate(1);
        d.setMonth(--this.monForChange);
        this.activeDate = d;
        return d;
    },
    addZero: (num) => (num < 10) ? '0' + num : num,
    activeDTag: null,
    getIndex: function (node) {
        let index = 0;
        while (node = node.previousElementSibling) {
            index++;
        }
        return index;
    }
};

const $calBody = document.querySelector('.cal-body');
const $btnNext = document.querySelector('.btn-cal.next');
const $btnPrev = document.querySelector('.btn-cal.prev');

/**
 * @param {number} date
 * @param {number} dayIn
 */
function loadDate(date, dayIn) {
    document.querySelector('.cal-date').textContent = date;
    document.querySelector('.cal-day').textContent = info.dayList[dayIn];
}

/**
 * @param {date} fullDate
 */
function loadYYMM(fullDate) {
    let yy = fullDate.getFullYear();
    let mm = fullDate.getMonth();
    let firstDay = info.getFirstDay(yy, mm);
    let lastDay = info.getLastDay(yy, mm);
    let markToday; // for marking today date

    if (mm === info.today.getMonth() && yy === info.today.getFullYear()) {
        markToday = info.today.getDate();
    }

    document.querySelector('.cal-month').textContent = info.monList[mm];
    document.querySelector('.cal-year').textContent = yy;

    let trtd = '';
    let startCount;
    let countDay = 0;
    for (let i = 0; i < 6; i++) {
        trtd += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && !startCount && j === firstDay.getDay()) {
                startCount = 1;
            }
            if (!startCount) {
                trtd += '<td>'
            } else {
                let fullDate = yy + '.' + info.addZero(mm + 1) + '.' + info.addZero(countDay + 1);
                trtd += '<td class="day';
                trtd += (markToday && markToday === countDay + 1) ? ' today" ' : '"';
                trtd += ` data-date="${countDay + 1}" data-fdate="${fullDate}">`;
            }
            trtd += (startCount) ? ++countDay : '';
            if (countDay === lastDay.getDate()) {
                startCount = 0;
            }
            trtd += '</td>';
        }
        trtd += '</tr>';
    }
    $calBody.innerHTML = trtd;
}

/**
 * @param {string} val
 */
function createNewList(val) {
    let id = new Date().getTime() + '';
    let yy = info.activeDate.getFullYear();
    let mm = info.activeDate.getMonth() + 1;
    let dd = info.activeDate.getDate();
    const $target = $calBody.querySelector(`.day[data-date="${dd}"]`);

    let date = yy + '.' + info.addZero(mm) + '.' + info.addZero(dd);

    let eventData = {};
    eventData['date'] = date;
    eventData['memo'] = val;
    eventData['complete'] = false;
    eventData['id'] = id;
    info.event.push(eventData);
    $todoList.appendChild(createLi(id, val, date));
}

loadYYMM(info.today);
loadDate(info.today.getDate(), info.today.getDay());

$btnNext.addEventListener('click', () => loadYYMM(info.nextMonth()));
$btnPrev.addEventListener('click', () => loadYYMM(info.prevMonth()));

$calBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('day')) {
        if (info.activeDTag) {
            info.activeDTag.classList.remove('day-active');
        }
        let day = Number(e.target.textContent);
        loadDate(day, e.target.cellIndex);
        e.target.classList.add('day-active');
        info.activeDTag = e.target;
        info.activeDate.setDate(day);
        reloadTodo();
    }
});