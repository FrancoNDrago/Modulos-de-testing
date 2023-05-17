export const cartNotFound = (id)=>`No se pudo encontrar carrito con el ID ${id}`;

export const cartAlreadyExist = (id)=>`El carrito con ID ${id} ya existe.`;

export const productNotInCart = (pid, cid)=>`El producto ${pid} no existe${cid}`;

export const isProductOwner = (uid, pid)=>`El usuario ${uid} es propietario del producto ${pid}.`;