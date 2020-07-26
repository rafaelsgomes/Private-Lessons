const fs = require('fs')
const data = require('../data.json')
const {date, grade} = require('../utils')

// listar os alunos
exports.index = (req, res)=>{
    const students = data.students.map((student)=>{
        const index = {
            ...student,
            schoolyear: grade(student.schoolyear)
        }
        return index
    })

    return res.render('students/index', {students})
}

//students
exports.show = (req, res)=>{
    const {id} = req.params

    const validStudent = data.students.find((student)=>{
        return student.id == id
    })

    const student = {
        ...validStudent,
        birth: date(validStudent.birth).birthDay,
        schoolyear: grade(validStudent.schoolyear)
    }

    return res.render('students/show', {student})
}

//create page
exports.create = (req, res)=>{
    return res.render('students/create')
}
//create
exports.post = (req, res)=>{
    const keys = Object.keys(req.body)
    
    for (key of keys){
        if(req.body[key] == '') return res.send('Porfavor preencha todos os campos!')
    }

    birth = Date.parse(req.body.birth)
    const id = Number(data.students.length + 1)

    data.students.push({
        id,
        ...req.body,
        birth
    })

    fs.writeFile('./src/data.json', JSON.stringify(data, null, 2), (err) =>{
        if(err) return res.send('Write file error')
        
        return res.redirect('students')
    })
}

//edit page
exports.edit = (req, res)=>{
    const {id} = req.params

    const validStudent = data.students.find((student)=>{
        return student.id == id
    })

    const student = {
        ...validStudent,
        birth: date(validStudent.birth).iso
    }

    res.render('students/edit', {student})
}

//edit
exports.update = (req, res)=>{
    const {id} = req.body
    let index = 0
    const validStudent = data.students.find((student, indexstudent)=>{
        if(student.id == id){
            index = indexstudent
            return true
        }
    })

    const student = {
        ...validStudent,
        ...req.body,
        id: Number(req.body.id),
        birth: Date.parse(req.body.birth),
    }

    data.students[index] = student

    fs.writeFile('./src/data.json', JSON.stringify(data, null, 2), (err) =>{
        if(err) return res.send('Write file error')
        
        return res.redirect(`students/${id}`)
    })
}

//delete
exports.delete = (req, res)=>{
    const {id} = req.body

    const filteredStudents = data.students.filter((student)=>{
        return student.id != id
    })

    data.students = filteredStudents

    fs.writeFile('./src/data.json', JSON.stringify(data, null, 2), (err) =>{
        if(err) return res.send('Write file error')
        
        return res.redirect(`students`)
    })
}