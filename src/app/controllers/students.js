const {date, grade} = require('../../lib/utils')
const Student = require("../models/Student")

module.exports = {
    // Displays the students on the home page
    index(req, res){
        Student.index((allstudents)=>{

            const students =  allstudents.map((student)=>{
                const index = {
                    ...student,
                    schoolyear: grade(student.schoolyear)
                }
                return index
            })
            return res.render('students/index', {students})
        })
    },
    // Route to the page to create a new student
    create(req, res){
        Student.teacherOptions((options)=>{
            return res.render('students/create', {teachers: options})
        })
        
    },
    // Creates a new student with the data in the form in the page
    post(req, res){
        const keys = Object.keys(req.body)
    
        for (key of keys){
            if(req.body[key] == '') return res.send('Porfavor preencha todos os campos!')
        }
        Student.create(req.body,(student)=>{
           return res.redirect(`students/${student.id}`)
        })
    },
    // Shows more details of the selected student
    show(req, res){
        Student.find(req.params.id, (student)=>{

            student.birth = date(student.birth_date).birthDay
            student.schoolyear = grade(student.schoolyear)
            return res.render(`students/show`, {student})
        })    
    },
    // Route to the page to edit the selected student
    edit(req, res){
        Student.find(req.params.id, (student)=>{

            student.birth = date(student.birth_date).iso
            Student.teacherOptions((options)=>{
                return res.render('students/edit', {student, teachers: options})
            })
        })
    },
    // Makes the changes on the student with the updated data in the form
    update(req, res){
        Student.update(req.body, ()=>{
            return res.redirect(`students/${req.body.id}`)
        })
    
    },
    // Delete the selected student displayed on the edit page
    delete(req, res){
        Student.delete(req.body.id, ()=>{
            return res.redirect('students')
        })
    }
}