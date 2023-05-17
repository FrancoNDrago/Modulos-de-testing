const login_form = document.getElementById("login_form");
const recuperar_password = document.getElementById("recuperar_password");

login_form.addEventListener("submit", evt=>{
    evt.preventDefault();

    const data = new URLSearchParams();
    for (const pair of new FormData(evt.target)) {
        data.append(pair[0], pair[1]);
    }

    console.log(data);
    fetch("http://localhost:8080/api/sessions/login", {
        method: "POST",
        body: data
    })
        .then(res=>res.json())
        .then(data=>{
            if(data.status === "error"){
                location.href = `/login?validation=${data.message.valCode}`;
            }else{
                location.href = "/";
            }
        })
})

recuperar_password.addEventListener("click", evt=>{
    Swal.fire({
        title: "Recuperacion de contraseña",
        text: "Ingrese su e-mail:",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Recuperar",
        cancelButtonText: "Cancelar",
        preConfirm: (email) => {
            if(!!!email.length) Swal.showValidationMessage(`Debe indicar un email para la recuperación.`);
        },
    }).then((result) => {
        if(result.isConfirmed){
            Swal.fire({
                title: "Recuperacion de contraseña",
                html: "Aguarde unos momentos...",
                didOpen: () => {
                  Swal.showLoading()

                  fetch(`http://localhost:8080/api/sessions/recover?email=${result.value}`)
                    .then(res=>res.json())
                    .then(data=>{
                        console.log("RESPONSE: ", data);

                        if(data.status === "success"){
                            Swal.fire({
                                title: "Recuperacion de contraseña",
                                text: "Se ha enviado un mail a la dirección indicada para que pueda recuperar su contraseña",
                                icon: "success"
                            })
                        }else{
                            Swal.close();
                        }
                    })
                }
            })
        }
    })
})