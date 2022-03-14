document.addEventListener("DOMContentLoaded",()=>{
    fetchData()
})

const fetchData = async () =>{
    try {
        const res= await fetch ('api.json')
        const data = await res.json()
        //console.log(data)
        imprimirProductos(data)
        detectarCompra(data)
    } catch(error){
        console.log(error)
    }
}
//de aca dedberia imprimir mis productos
const contenedorProductos= document.querySelector('#contenedor-productos')
const imprimirProductos=(data)=>{
    const template = document.querySelector('#template-productos').content
    const fragment= document.createDocumentFragment()
    //console.log(template)
    data.forEach(producto=>{
        //console.log(producto)
        template.querySelector('img').setAttribute('src', producto.imagen  )//url
        template.querySelector('h5').textContent=producto.producto
        template.querySelector('p').textContent=producto.precio
        template.querySelector('button').dataset.id=producto.id

        const clone= template.cloneNode(true)
        fragment.appendChild(clone)

    })
    contenedorProductos.appendChild(fragment)

}
let carrito = {}

//detecto click en el boton de compra
const detectarCompra=(data) =>{
    const botones = document.querySelectorAll('.card-body button')

    botones.forEach(btn=>{
        btn.addEventListener('click',()=>{
            //console.log(btn.dataset.id)
            const producto=data.find(item=>item.id=== parseInt(btn.dataset.id))
            producto.cantidad=1
            //LEER SPREAD OPERATOR
            //abajo hago una copia del producto para agregar mas de una unidad del mismo modelo
            if(carrito.hasOwnProperty(producto.id)){
               producto.cantidad= carrito[producto.id].cantidad +1

            }
            carrito[producto.id]= {...producto}
            console.log(carrito)
            productosenCarrito()

            //SWEET ALERT para cuando compras
            Swal.fire({
             position: 'top-end',
             icon: 'success',
             title: 'Agregado al carrito',
             showConfirmButton: false,
             timer: 1000
            })

        })
    })
}
const items = document.querySelector('#items')//pinto en consola lo seleccionado
const productosenCarrito =() =>{
    //pendiente innerHTML
    items.innerHTML= ''
    const template= document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()
    Object.values(carrito).forEach(producto=>{
        //console.log('producto')
        template.querySelector('th').textContent= producto.id
        template.querySelectorAll('td')[0].textContent= producto.producto
        template.querySelectorAll('td')[1].textContent= producto.cantidad
        template.querySelector('span').textContent= producto.precio * producto.cantidad

        //botones de + y -
        template.querySelector('.btn-info').dataset.id= producto.id
        template.querySelector('.btn-danger').dataset.id=producto.id


        const clone= template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter() //del carrito

    accionBotones()
}
//footer con el total de las compras
const footer = document.querySelector('#footer-carrito')

const pintarFooter=()=>{

    footer.innerHTML=''

    //INNER para cuando limpio el carrito
    if(Object.keys(carrito).length===0){
        footer.innerHTML=`
        <th scope="row" colspan="5"> Carrito vacío</th>`
        return
    }


    const template=document.querySelector('#template-footer').content
    const fragment= document.createDocumentFragment()

    //sumar cantidad y sumar los totales

    const nCantidad= Object.values(carrito).reduce((acc,{cantidad})=> acc + cantidad, 0)
    const nPrecio= Object.values(carrito).reduce((acc,{cantidad,precio})=>acc + cantidad * precio,0)
    console.log(nPrecio)

    template.querySelectorAll('td')[0].textContent= nCantidad
    template.querySelector('span').textContent=nPrecio

    const clone= template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton= document.querySelector('#vaciar-carrito')
    boton.addEventListener('click',()=>{
        carrito={}
        productosenCarrito()
    } )


}
const accionBotones=()=>{
    const botonesAgregar=document.querySelectorAll('#items .btn-info')
    const botonesEliminar=document.querySelectorAll('#items .btn-danger')
//boton agregar del carrito
    botonesAgregar.forEach(btn=>{
        btn.addEventListener('click',()=>{
            console.log(btn.dataset.id)
            const producto= carrito[btn.dataset.id]
            producto.cantidad ++
            carrito[btn.dataset.id]={...producto}
            productosenCarrito()
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Agregado al carrito',
                showConfirmButton: false,
                timer: 1000
              })
    })
})
//boton eliminar del carrito
    botonesEliminar.forEach(btn=>{
        btn.addEventListener('click',()=>{
            const producto = carrito [btn.dataset.id]
            producto.cantidad --
            if (producto.cantidad ===0){
                delete carrito[btn.dataset.id]
            }else{
                carrito[btn.dataset.id]={...producto}

            }
            productosenCarrito()
        })
    })


}
