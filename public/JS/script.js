const path = location.pathname
const menuItems = document.querySelectorAll('header .links a')

for(item of menuItems){
    if(path.includes(item.getAttribute('href'))){
        item.classList.add('active')
    }
}