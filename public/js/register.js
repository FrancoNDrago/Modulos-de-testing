const register_form = document.getElementById('register_form');

register_form.addEventListener('submit', evt=>{
    evt.preventDefault();

    const data = new URLSearchParams();
    for (const pair of new FormData(evt.target)) {
        data.append(pair[0], pair[1]);
    }

    fetch('http://localhost:8080/api/sessions/register', {
        method: 'POST',
        body: data
    })
        .then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.status === 'error'){
                location.href = `/register?validation=${data.message.valCode}`;
            }else{
                location.href = '/login?register=1';
            }
        })
})