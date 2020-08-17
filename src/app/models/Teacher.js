const {date} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    create(data, callback){
        const query = `INSERT INTO teachers (
            avatar_url,
            name,
            birth_date,
            formation,
            class_type,
            subjects,
            created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.formation,
            data.class_type,
            data.subjects,
            date(Date.now()).iso
        ]

        db.query(query, values, (err, results)=>{
            if(err) throw `Database error ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback){
        db.query(`SELECT * FROM teachers WHERE id = $1`, [id], (err, results)=>{
            if(err) throw `Database error ${err}`

            callback(results.rows[0])
        })
    },
    filter(filter, callback){
        db.query(`SELECT teachers.*, count(students) AS total_students FROM teachers
        LEFT JOIN students ON (teachers.id = students.teacher_id)
        WHERE teachers.name ILIKE '%${filter}%' OR teachers.subjects ILIKE '%${filter}%'
        GROUP BY teachers.id
        `, (err, results)=>{
            if(err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    update(data, callback){
        const query = `UPDATE teachers SET
            avatar_url=($1),
            name=($2),
            birth_date=($3),
            formation=($4),
            class_type=($5),
            subjects=($6)
        WHERE id = $7`
        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.formation,
            data.class_type,
            data.subjects,
            data.id
        ]
        db.query(query, values, (err, results)=>{
            if(err) throw `Database error ${err}`

            callback()
        })
    },
    delete(id, callback){
        db.query(`DELETE FROM teachers WHERE id = $1`, [id], (err, results)=>{
            if(err) throw `Database error ${err}`

           return callback()
        })
    },
    pagination(params){
        let filterQuery = '',
            totalQuery = `(SELECT count(*) FROM teachers) as total`

        if(params.filter){
            filterQuery = `WHERE teachers.name ILIKE '%${params.filter}%' OR teachers.subjects ILIKE '%${params.filter}%'`
            totalQuery = `(SELECT count(*) FROM teachers ${filterQuery}) as total`
        }
        let query = `SELECT teachers.*, ${totalQuery}, count(students) AS total_students FROM teachers
        LEFT JOIN students ON (teachers.id = students.teacher_id) ${filterQuery}
        GROUP BY teachers.id LIMIT $1 OFFSET $2`

        db.query(query, [params.limit, params.offset],(err, results)=>{
            if(err) throw `Database error ${err}`
            params.callback(results.rows)
        })
    }
}