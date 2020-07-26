const fs = require('fs')
const Intl = require('intl')
const data = require('../data.json')
const {age, formation, date} = require('../utils')

// listar os professores
exports.index = (req, res)=>{
    return res.render('teachers/index', {teachers: data.teachers})
}

//teachers
exports.show = (req, res)=>{
    const {id} = req.params

    const validTeacher = data.teachers.find((teacher)=>{
        return teacher.id == id
    })

    const teacher = {
        ...validTeacher,
        subjects: validTeacher.subjects.split(','),
        age: age(validTeacher.birth),
        formation: formation(validTeacher.formation),
        created_at: new Intl.DateTimeFormat('pt-BR').format(validTeacher.created_at),
    }

    return res.render('teachers/show', {teacher})
}

//create page
exports.create = (req, res)=>{
    return res.render('teachers/create')
}
//create
exports.post = (req, res)=>{
    const keys = Object.keys(req.body)
    
    for (key of keys){
        if(req.body[key] == '') return res.send('Porfavor preencha todos os campos!')
    }

    let {avatar_url, name, birth, formation, modality, subjects} = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.teachers.length + 1)

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        formation,
        modality,
        subjects,
        created_at
    })

    fs.writeFile('./src/data.json', JSON.stringify(data, null, 2), (err) =>{
        if(err) return res.send('Write file error')
        
        return res.redirect('teachers')
    })
}

//edit page
exports.edit = (req, res)=>{
    const {id} = req.params

    const validTeacher = data.teachers.find((teacher)=>{
        return teacher.id == id
    })

    const teacher = {
        ...validTeacher,
        birth: date(validTeacher.birth).iso
    }

    res.render('teachers/edit', {teacher})
}

//edit
exports.update = (req, res)=>{
    const {id} = req.body
    let index = 0
    const validTeacher = data.teachers.find((teacher, indexteacher)=>{
        if(teacher.id == id){
            index = indexteacher
            return true
        }
    })

    const teacher = {
        ...validTeacher,
        ...req.body,
        id: Number(req.body.id),
        birth: Date.parse(req.body.birth),
    }

    data.teachers[index] = teacher

    fs.writeFile('./src/data.json', JSON.stringify(data, null, 2), (err) =>{
        if(err) return res.send('Write file error')
        
        return res.redirect(`teachers/${id}`)
    })
}

//delete

exports.delete = (req, res)=>{
    const {id} = req.body

    const filteredTeachers = data.teachers.filter((teacher)=>{
        return teacher.id != id
    })

    data.teachers = filteredTeachers

    fs.writeFile('./src/data.json', JSON.stringify(data, null, 2), (err) =>{
        if(err) return res.send('Write file error')
        
        return res.redirect(`teachers`)
    })
}