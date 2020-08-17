const {date} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    index(callback){
        db.query(`SELECT * FROM students`, (err, results)=>{
            if(err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    create(data, callback){
        const query = `INSERT INTO students (
            avatar_url,
            name,
            email,
            birth_date,
            schoolyear,
            workload,
            teacher_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth).iso,
            data.schoolyear,
            data.workload,
            data.teacher
        ]

        db.query(query, values, (err, results)=>{
            if(err) throw `Database error ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback){
        db.query(`SELECT * FROM students WHERE id = $1`, [id], (err, results)=>{
            if(err) throw `Database error ${err}`

            callback(results.rows[0])
        })
    },
    update(data, callback){
        const query = `UPDATE students SET
            avatar_url=($1),
            name=($2),
            email=($3),
            birth_date=($4),
            schoolyear=($5),
            workload=($6),
            teacher_id=($7)
        WHERE id = $8`
        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth).iso,
            data.schoolyear,
            data.workload,
            data.teacher,
            data.id
        ]
        db.query(query, values, (err, results)=>{
            if(err) throw `Database error ${err}`

            callback()
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM students WHERE id = $1`, [id], (err, results)=>{
            if(err) throw `Database error ${err}`

           return callback()
        })
    },
    teacherOptions(callback){
        db.query(`SELECT name, id FROM teachers`, (err, results)=>{
            if(err) throw `Database error ${err}`

            callback(results.rows)
        })
    }, 
    pagination(params){
        let filterQuery = '',
            totalQuery = `(SELECT count(*) FROM students) as total`

        if(params.filter){
            filterQuery = `WHERE students.name ILIKE '%${params.filter}%' OR students.email ILIKE '%${params.filter}%'`
            totalQuery = `(SELECT count(*) FROM students ${filterQuery}) as total`
        }
        let query = `SELECT students.*, ${totalQuery} FROM students 
        ${filterQuery} 
        LIMIT $1 OFFSET $2`

        db.query(query, [params.limit, params.offset],(err, results)=>{
            if(err) throw `Database error ${err}`
            params.callback(results.rows)
        })
    }
}