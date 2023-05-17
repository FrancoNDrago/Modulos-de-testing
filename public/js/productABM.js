const operation = document.getElementById("operation").value;
const submitBtn = document.getElementById("sbt_btn");
const prod_form = document.getElementById("prod_form");
const product_id = document.getElementById("product_id").value;

switch (operation) {
    case "add":
        submitBtn.innerText = "Cargar";
        break;
    case "mod":
        submitBtn.innerText = "Modificar";
        break;
    case "del":
        submitBtn.innerText = "Eliminar";
        break;
}

prod_form.addEventListener("submit", evt=>{
    evt.preventDefault();

    let endpoint;
    let method;
    let data = new URLSearchParams();

    switch (operation) {
        case "add":
            endpoint = "/api/products";
            method = "POST";
            break;
        case "mod":
            endpoint = `/api/products/${product_id}`;
            method = "PUT";
            break;
        case "del":
            endpoint = `/api/products/${product_id}`;
            method = "DELETE";
            break;
    }

    for(const pair of new FormData(evt.target)) {
        data.append(pair[0], pair[1]);
    }

    console.log("Body: ", data);

    fetch(`http://localhost:8080${endpoint}`, {
        method: method,
        body: new FormData(evt.target)
    })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.status === "success"){
                Swal.fire({
                    title:data.message,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                }).then(()=>{
                    window.location = "../abm";
                })
            }else if(data.status === "error") {
                Swal.fire({
                    text: data.message,
                    icon: "error"
                });
            }
        })
})