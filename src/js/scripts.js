moment.locale('ru');

let data = []

if(localStorage.getItem('data')) {
    data = JSON.parse(localStorage.getItem('data'))
}else{
    data = [
        {
            date: '2023-01-01',
            project: 'project 1',
            profit: 10000
        },
        {
            date: '2023-01-02',
            project: 'project 2',
            profit: 20000
        },
        {
            date: '2023-01-03',
            project: 'project 3',
            profit: 30000
        },
        {
            date: '2023-01-04',
            project: 'project 4',
            profit: 40000
        },
    ]
}

// console.log(JSON.stringify(data))

const btnAddRow = document.querySelector('#add-row')
const table = document.querySelector('.profit-table table tbody')

initApp()

function initApp() {
    sortByDate()
    createTable(data)
    countTotal(data)
}

function sortByDate(direction = true) {
    if(direction) {
        data.sort(function (left, right) {
            return moment.utc(left.date).diff(moment.utc(right.date))
        });
    }else{
        data.sort(function (left, right) {
            return moment.utc(right.date).diff(moment.utc(left.date))
        });
    }
}

function createTable(data) {
    table.innerHTML = ''

    const monthsBetween = checkMonth(data)
    // console.log(monthsBetween);
    monthsBetween.forEach((item) => {
        let monthCheck = true

        data.forEach((row) => {
            if(moment(row.date).isBetween(item.start, item.end, undefined, '[]')) {
                if(monthCheck) {
                    const newRow = document.createElement("tr")
                    const newRowTdDate = document.createElement("td")
                    newRowTdDate.classList.add('row-month')
                    newRowTdDate.innerHTML = moment(row.date).format('MMMM YYYY')
                    newRowTdDate.setAttribute('colspan', '3')
                    newRow.appendChild(newRowTdDate)
                    table.appendChild(newRow)

                    monthCheck = false
                }
                createRow(row)
            }
        })
    })
}

const cellEdit = document.querySelectorAll('tr:not(.add-new) td input')
cellEdit.forEach((item, i) => {
    item.addEventListener("focusout", function(el) {
        editCell(el, i)
    });
})

function editCell(cell, i) {
    const cellType = cell.target.getAttribute('name')
    const rowNum = Math.ceil((i + 1) / 3) - 1
    cellType === 'profit' ? data[rowNum][cellType] = parseInt(cell.target.value) : data[rowNum][cellType] = cell.target.value
    addToStorage(data)
    countTotal(data)
    // console.log(data);
}

function addToStorage(array) {
    localStorage.setItem('data', JSON.stringify(array))
}

const cellAdd = document.querySelectorAll('tr.add-new input')
const addBtn = document.querySelector('#add-row')
addBtn.addEventListener('click', function(){
    let isComplete = true
    const row = {}
    cellAdd.forEach((item, i) => {
        item.classList.remove('error')
        if(item.value === '') {
            item.classList.add('error')
            isComplete = false
        }else{
            if(item.getAttribute('name') === 'profit') {
                row[item.getAttribute('name')] = parseInt(item.value)
            }else{
                row[item.getAttribute('name')] = item.value
            }
        }
    })
    if(isComplete){
        addRow(row)
    }
})
function addRow(row) {
    data.push(row)
    addToStorage(data)
    createRow(row)
    clearRow()
    countTotal(data)
}

function createRow(row) {
    const newRow = document.createElement("tr")
    const newRowTdDate = document.createElement("td")
    const newRowTdProject = document.createElement("td")
    const newRowTdProfit = document.createElement("td")

    const momentDay = moment().format(row.date)

    newRowTdDate.innerHTML = `<input type="date" name="date" value="${momentDay}" />`
    newRowTdProject.innerHTML = `<input type="text" name="project" value="${row.project}" />`
    newRowTdProfit.innerHTML = `<input type="number" name="profit" value="${parseInt(row.profit)}" />`

    newRow.appendChild(newRowTdDate)
    newRow.appendChild(newRowTdProject)
    newRow.appendChild(newRowTdProfit)

    table.appendChild(newRow)
}

function clearRow() {
    cellAdd.forEach((item) => {
        item.value = ''
    })
}

function countTotal(dataArray) {
    const total = dataArray.reduce((sum, item) => {
        return sum + parseInt(item.profit)
    }, 0)
    // console.log(total);
    document.querySelector('.total b').innerHTML = total
}

const filterBtn = document.querySelector('#filter-date button')
const clearFilterBtn = document.querySelector('#filter-date .clear-filter')

filterBtn.addEventListener('click', function(){
    const filterForm = this.closest('#filter-date')
    const from = filterForm.querySelector('input[name=from]').value
    const to = filterForm.querySelector('input[name=to]').value

    const filtredData = data.filter((item) => {
        return moment(item.date).isBetween(from, to, undefined, '[]')
    })

    createTable(filtredData)
    countTotal(filtredData)
})

clearFilterBtn.addEventListener('click', function(e) {
    e.preventDefault()
    createTable(data)
    countTotal(data)
})

const sortSumTd = document.querySelector('.sort-sum')
let switcher = true
sortSumTd.addEventListener('click', function() {
    if(switcher) {
        this.classList.add('sort')
        data.sort(function(a, b){
            return a.profit - b.profit
        })
    }else{
        this.classList.remove('sort')
        data.sort(function(a, b){
            return  b.profit - a.profit
        })
    }
    switcher = !switcher

    createTable(data)
})


// const ctx = document.querySelector('#myChart');
// const chartData = data.map((item) => {
//     return {
//         x: item.date,
//         y: item.profit,
//     }
// })

// console.log(chartData);

// new Chart(ctx, {
// type: 'line',
// data: {
//     datasets: [
//         { 
//             data: chartData
//         }
//     ]
// },
// // options: {
// //   scales: {
// //     y: {
// //       beginAtZero: true
// //     }
// //   }
// // }
// });

const sortDateTd = document.querySelector('.sort-date')

let sortDateDirection = false
sortDateTd.addEventListener('click', () => {
    sortByDate(sortDateDirection)
    createTable(data)
    sortDateDirection = !sortDateDirection
})



function checkMonth(dataArray) {
    const monthsBetween = []
    const months = dataArray.reduce((accumulator, item) => {
        const monthWord = moment(item.date).format('MMMM')
        if(accumulator.indexOf(monthWord) === -1) {
            accumulator.push(monthWord)

            const startOfMonth = moment(item.date).startOf('month').format('YYYY-MM-DD');
            const endOfMonth   = moment(item.date).endOf('month').format('YYYY-MM-DD');
            monthsBetween.push({start: startOfMonth, end: endOfMonth})
        }
        return accumulator
    }, [])

    return monthsBetween
}