const socket = io();

const productList = document.getElementById('products_list');


socket.on('products_update', products=>{
    let products_container = document.createElement('div');
    products.forEach(product => {
        let product_container = document.createElement('p');
        product_container.innerHTML = `
            <div class="col-3 my-4 d-flex justify-content-center align-items-center">
                <div class="card bg-danger text-white" style="width: 18rem;">
                    <img src="${product.thumbnails[0] || 'https://commercial.bunn.com/img/image-not-available.png'}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">Precio: $${product.price}</p>
                        <a href="/products/${product._id}" class="btn btn-dark">Ver detalle</a>
                    </div>
                </div>
            </div>
        `;
        products_container.appendChild(product_container);
    });
    
    productList.innerHTML = products_container.innerHTML;
});