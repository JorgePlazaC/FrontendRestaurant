import { createContext, useState, useEffect } from "react"

const RestaurantContext = createContext()

export function RestaurantProvider({children}){
    const [mesa,setMesa] = useState()
    const [carro,setCarro] = useState([])
    const [carroAgregado,setCarroAgregado] = useState(false)

    return(
        <RestaurantContext.Provider value={{mesa, setMesa, carro, setCarro,carroAgregado,setCarroAgregado}}>{children}</RestaurantContext.Provider>
    )
}

export default RestaurantContext