const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const messageBtn = document.getElementById('messageBtn');

const socket = io();

let user = document.getElementById('user_email').value;

socket.emit('new_user', user);

// Eventos
messageInput.addEventListener('keypress', evt=>{
    if(evt.key === 'Enter'){
        if(evt.target.value.trim().length >0){
            socket.emit('new_message', {user, message:evt.target.value});
            evt.target.value = '';
        }
    }
})
messageBtn.addEventListener('click', evt=>{
    if(e.target.value.trim().length >0){
        socket.emit('new_message', {user, message:evt.target.value});
        evt.target.value = '';
    }
})

// Eventos de WebSocket
socket.on('auth_user', auth_user=>{
    if(auth_user.validation){
        user = auth_user.user;
        loadMessages(auth_user.messages);
    }else{
        validationSwal(`<br><small>El usuario ${auth_user.user} ya existe, por favor ingrese un nombre diferente.</small>`);
    }
})

socket.on('new_user_connected', user=>{
    if(!!!valSwalOpen){
        Swal.fire({
            text: `${user} se a conectado al chat, denle la bienvenida!`,
            toast: true,
            position: 'top-right'
        })
    }
})

socket.on('messages_log', messages=>loadMessages(messages));

// Funciones
function validationSwal(error){
    Swal.fire({
        title: 'Identificación',
        input: 'text',
        html: `Ingrese el mail con el que desea logearse.${error || ''}`,
        inputValidator: value=>{
            if(!value)
                return 'Por favor ingrese un email.';
            if(!value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
                return 'El dato ingresado no es un email valido.';
        },
        allowOutsideClick: false,
        didOpen:()=>{
            valSwalOpen = true;
        },
        didClose:()=>{
            valSwalOpen = false;
        }
    }).then(result=>{
        socket.emit('new_user', result.value);
    });
}

function loadMessages(messages){
    let messageContainer = document.createElement('div');

    messages.forEach(message => {
        let pTag = document.createElement('p');
        pTag.innerHTML = `<b>${message.user}:</b> ${message.message}`;
        messageContainer.appendChild(pTag);

        if(message.user === user) pTag.classList.add('text-start');
        else pTag.classList.add('text-end');
    });


    chatBox.innerHTML = messageContainer.innerHTML;
}