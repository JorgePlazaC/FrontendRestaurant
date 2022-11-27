import { createContext, useState, useEffect } from "react"

const RestaurantContext = createContext()

export function RestaurantProvider({children}){
    const [mesa,setMesa] = useState()
    const [carro,setCarro] = useState([])
    const [carroAgregado,setCarroAgregado] = useState(false)
    const [imagenes,setImagenes] = useState()
    const [productosContext, setProductosContext] = useState([])
    const [categoriasActivas, setCategoriasActivas] = useState([])
    const [mesasActivas, setMesasActivas] = useState([])
    const [productosActivas, setProductosActivas] = useState([])

    return(
        <RestaurantContext.Provider value={{mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado,
            imagenes,setImagenes,productosContext, setProductosContext,categoriasActivas, setCategoriasActivas,
            mesasActivas, setMesasActivas,productosActivas, setProductosActivas}}>{children}</RestaurantContext.Provider>
    )
}

export default RestaurantContext