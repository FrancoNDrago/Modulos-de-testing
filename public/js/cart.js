const btnDelete = document.querySelectorAll('#deleteProduct');
const btnEndCompra = document.getElementById('finalizar_compra');

const cart_id = document.getElementById('cart_id');

btnDelete.forEach(btn=>{
    btn.addEventListener('click', evt=>{
        evt.stopPropagation();
        const product_id = btn.value;
        fetch(`/api/carts/${cart_id.value}/product/${product_id}`, {method: 'DELETE'})
            .then(res=>res.json())
            .then(data=>{
                console.log(data);
                if(data.status === 'success'){
                    Swal.fire({
                        text: `Producto eliminado del carrito.`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(()=>{
                        location.reload();
                    })
                }
            })
    })
})

btnEndCompra.addEventListener('click', evt=>{
    Swal.fire({
        title: '¿Desea recibir su ticket por SMS?',
        text: 'Solo debe ingresar el numero con codigo de area, pero no de pais.',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        preConfirm: (phone) => {
            if(!!!phone.length) Swal.showValidationMessage(`Debe indicar un numero telefonico.`);
        },
    }).then((result) => {
        let url;
        if (result.isConfirmed) {
            url = `/api/carts/${cart_id.value}/purchase?phone=${result.value}`;
        }else if(result.isDismissed){
            url = `/api/carts/${cart_id.value}/purchase`;
        }

        console.log(url);
        fetch(url)
            .then(res=>res.json())
            .then(data=>{
                if(data.status == 'success'){
                    let html = `Compra finalizada! Su numero de ticket es: ${data.payload.ticket}.`;
                    if(data.payload.products_out_of_stock.length > 0){
                        html += `<br>Los siguientes articulos no se compraron por falta de stock<br><ul>`;
                        data.payload.products_out_of_stock.forEach(prod=>{
                            html += `<li>${prod.title} - cant: ${prod.quantity} - stock: ${prod.stock}</li>`;
                        })
                        html += `</ul>`;
                    }

                    Swal.fire({
                        html,
                        icon: 'success',
                    }).then(()=>{
                        location.reload();
                    })
                }
            })
    })
})