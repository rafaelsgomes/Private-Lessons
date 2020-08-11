module.exports = {
    age(timestamp){
        const today = new Date()
        const birth =  new Date(timestamp)

        let age = today.getFullYear() - birth.getFullYear()
        const month = today.getMonth() - birth.getMonth()
        if(month < 0 || month == 0 && today.getDate() <= birth.getDate()){
            age -= 1
        }

        return age
    },
    formation(event){
        switch(event){
            case 'medio':
                return `Ensino Médio Completo`
            case 'superior':
                return `Ensino Superior Completo`
            case 'mestrado':
                return `Mestrado`
            case 'doutorado':
                return `Doutorado`
        }
    },
    date(timestamp){
        const birth = new Date(timestamp)

        const year = birth.getFullYear()
        const month = `0${birth.getUTCMonth() + 1}`.slice(-2)
        const day = `0${birth.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }

    },
    grade(schoolyear){
        let schoolYear = schoolyear
        if(schoolYear.slice('-1') == 'F'){
            return schoolYear = schoolyear.replace('F', 'º Ano Ensino Fundamental')
        } else{
            return schoolYear = schoolyear.replace('M', 'º Ano Ensino Médio')
        }
    }
}