const elementos =
document.querySelectorAll(
".fade, .fade-left, .fade-right"
);

function revelar(){

    elementos.forEach(item => {

        const topo =
        item.getBoundingClientRect().top;

        if(topo < window.innerHeight - 100){

            item.classList.add("show");

        }

    });

}

window.addEventListener(
    "scroll",
    revelar
);

revelar();