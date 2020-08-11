const {age, formation, date} = require('../../lib/utils')
const Teacher = require("../models/Teacher")

module.exports = {
    // Displays the teachers on the home page
    index(req, res){
        Teacher.index((teachers)=>{
            return res.render('teachers/index', {teachers})
        })
    },
    // Route to the page to create a new teacher
    create(req, res){
        return res.render('teachers/create')
    },
    // Creates a new teacher with the data in the form in the page
    post(req, res){
        const keys = Object.keys(req.body)
    
        for (key of keys){
            if(req.body[key] == '') return res.send('Porfavor preencha todos os campos!')
        }
        Teacher.create(req.body,(teacher)=>{
           return res.redirect(`teachers/${teacher.id}`)
        })
    },
    // Shows more details of the selected teacher
    show(req, res){
        Teacher.find(req.params.id, (teacher)=>{

            teacher.age = age(teacher.birth_date)
            teacher.created_at = date(teacher.created_at).format
            teacher.formation = formation(teacher.formation)
            teacher.subjects = teacher.subjects.split(',')
            return res.render(`teachers/show`, {teacher})
        })    
    },
    // Route to the page to edit the selected teacher
    edit(req, res){
        Teacher.find(req.params.id, (teacher)=>{

            teacher.birth = date(teacher.birth_date).iso
            return res.render(`teachers/edit`, {teacher})
        })
    },
    // Makes the changes on the teacher with the updated data in the form
    update(req, res){
        Teacher.update(req.body, ()=>{
            return res.redirect(`teachers/${req.body.id}`)
        })
    
    },
    // Delete the selected teacher displayed on the edit page
    delete(req, res){
        Teacher.delete(req.body.id, ()=>{
            return res.redirect('teachers')
        })
    }
}