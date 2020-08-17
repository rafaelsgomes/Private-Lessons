const path = location.pathname
const menuItems = document.querySelectorAll('header .links a')

for(item of menuItems){
    if(path.includes(item.getAttribute('href'))){
        item.classList.add('active')
    }
}

function paginate(selectedPage, totalPages){
    let pages = [], oldpage

    for(let currentPage = 1; currentPage <= totalPages; currentPage++){ 
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pageAfterSelectedPage = currentPage <= selectedPage + 2
        const pageBeforeSelectedPage = currentPage >= selectedPage - 2

        if(firstAndLastPage || pageBeforeSelectedPage && pageAfterSelectedPage){
            if(oldpage && currentPage - oldpage > 2){
                pages.push('...')
            }
            if(oldpage && currentPage - oldpage == 2){
                pages.push(oldpage + 1)
            }
            pages.push(currentPage)
            oldpage = currentPage
    }
    }
    return pages
}

function createPagination(pagination){
    
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const totalPages = +pagination.dataset.total
    const pages = paginate(page, totalPages)
    let paginationElements = ''

    for (let page of pages){
        if(String(page).includes("...")){
            paginationElements += `<span>${page}</span>`
        }else{
            if(filter){
                paginationElements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            }else{
                paginationElements += `<a href="?page=${page}">${page}</a>`
            } 
        }
    }

    pagination.innerHTML = paginationElements
}

const pagination = document.querySelector('.pagination')

if(pagination){
    createPagination(pagination)
}