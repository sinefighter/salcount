
let data = []

// async function getData() {
//     let response = await fetch('https://igor.utr.co.ua/api.php');
//     console.log(response);
// }

// getData()

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

function createTable(data) {
    table.innerHTML = ''
    for(row of data) {
        createRow(row)
    }
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

    const dateArray = row.date.split('-')

    const momentDay = moment().format(row.date)
    // console.log(momentDay);
    // console.log(moment().month(row.date));

    const time = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).toISOString().substring(0, 10)

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

function initApp() {
    createTable(data)
    countTotal(data)
    // createFilter()
}



// function createFilter() {
//     const select = document.createElement('select')
//     const selectDiv = document.querySelector('#filter-date')
//     selectDiv.appendChild(select)

//     const arrayOptions = sameDates()

//     const option = document.createElement('option')
//     option.value = 'all'
//     option.text = 'Show All'
//     select.appendChild(option)

//     arrayOptions.forEach((item) => {
//         const option = document.createElement('option')
//         option.value = item
//         option.text = item
//         select.appendChild(option)
//     })
// }

// function sameDates() {

//     const newArray = JSON.parse(JSON.stringify(data))

//     const sameDate = newArray.map((item) => {
//         const dateArray = item.date.split('-')
//         return dateArray[0] + '-' + dateArray[1]
//     })

//     // console.log(sameDate);

//     const datesForFilter = sameDate.filter((item, i) => {
//         return i === sameDate.indexOf(item)
//     })

//     return datesForFilter
// }

// const select = document.querySelector('#filter-date select')
// select.addEventListener('change', function(el){
//     const optionValue = el.target.value

//     if(optionValue !== 'all') {
//         const filtredDate = data.filter((item) => {
//             if(optionValue === item.date.slice(0, item.date.length - 3)) return item
//         })

//         createTable(filtredDate)
//         countTotal(filtredDate)
//     }else{
//         createTable(data)
//         countTotal(data)
//     }
    
// })

const filterBtn = document.querySelector('#filter-date button')
const clearFilterBtn = document.querySelector('#filter-date .clear-filter')

filterBtn.addEventListener('click', function(){
    const filterForm = this.closest('#filter-date')
    const from = filterForm.querySelector('input[name=from]').value
    const to = filterForm.querySelector('input[name=to]').value

    console.log(from, to);

    const filtredData = data.filter((item) => {
        return moment(item.date).isBetween(from, to, undefined, '[]')
    })

    console.log(filtredData);

    createTable(filtredData)
    countTotal(filtredData)

    // moment('2010-10-20').isBetween('2010-10-19', '2010-10-25'); // true
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

    console.log(data);
    createTable(data)
})