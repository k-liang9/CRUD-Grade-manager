const weighting = document.querySelector(".weighting");
const numerator = document.querySelector(".numerator");
const denominator = document.querySelector(".denominator");
const name = document.querySelector(".name");
const operation = document.querySelector(".operation");
const gradeSubmit = document.querySelector(".gradeSubmit");
const resPara = document.querySelector(".result");
const average = document.querySelector(".average");
gradeSubmit.addEventListener('click', update);

let curMark;

const baseUrl = 'http://localhost:3000/'

async function get(e) {
    e.preventDefault();
    const res = await fetch(baseUrl, {
        method: 'GET'
    })
    console.log(res);
}

async function update() {
    if (operation.value === "create") {
        await insertGrade();
    } else if (operation.value === "read") {
        await readGrade();
    } else if (operation.value === "update") {
        await updateGrade();
    } else {
        await deleteGrade();
    }
    await calcAvg();
}

async function insertGrade() {
    if (!isProperGrade()) return;
    curMark = getMark();

    await fetch(baseUrl + 'insert', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(curMark)
    });
    resPara.textContent = "inserted grade";
}

async function readGrade() {
    curMark = getMark();

    const res = await fetch(baseUrl + 'read', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(curMark)
    });

    let data = await res.json();
    data = data.info;
    let para = '';
    for (const doc of data) {
        para += `${JSON.stringify(doc)}\n`;
    }
    if (para === '') {
        para = "none found";
    }
    resPara.textContent = para;
}

let replace = false;
async function updateGrade() {
    if (!replace) {
        replace = true;
        curMark = getMark();
        resPara.textContent = "enter new grade";
    } else {
        if (!isProperGrade()) {
            return;
        }
        replace = false;
        let newMark = getMark();
        await fetch(baseUrl + 'update', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                init: curMark,
                replace: newMark
            })
        });
        resPara.textContent = "replaced grade";
    }
}

async function deleteGrade() {
    let curMark = {};
    if (name.value !== '') {
        curMark.name = String(name.value);
    }
    if (weighting.value !== '') {
        curMark.weighting = Number(weighting.value);
    }
    if (numerator.value !== '') {
        curMark.numerator = Number(numerator.value);
    }
    if (denominator.value !== '') {
        curMark.denominator = Number(denominator.value);
    }

    await fetch(baseUrl + 'delete', {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(curMark)
    })
    resPara.textContent = "mark deleted";
}

function getMark() {
    let mark = {};
    if (name.value !== '') {
        mark.name = String(name.value);
    }
    if (weighting.value !== '') {
        mark.weighting = Number(weighting.value);
    }
    if (numerator.value !== '') {
        mark.numerator = Number(numerator.value);
    }
    if (denominator.value !== '') {
        mark.denominator = Number(denominator.value);
    }
    return mark;
}

function isProperGrade() {
    if (name.value === '' || weighting.value === '' || numerator.value === '' || denominator.value === '') {
        resPara.textContent="error: fill out all fields";
        return false;
    }
    return true;
}

async function calcAvg() {
    const res = await fetch(baseUrl + 'average', {
        method: 'GET',
    });
    let data = await res.json();
    data = data.info;
    let weightSum = 0;
    let avg = 0;
    for (const doc of data) {
        if (doc.denominator === 0) continue;
        avg += 100*(doc.numerator/doc.denominator)*doc.weighting;
        weightSum += doc.weighting;
    }
    if (weightSum === 0) {
        average.textContent = "no mark";
    } else {
        avg /= weightSum;
        average.textContent = `average: ${avg}`;
    }
}