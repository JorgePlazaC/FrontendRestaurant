import { createContext, useState, useEffect } from "react"

const RestaurantContext = createContext()

export function RestaurantProvider({children}){
    const [mesa,setMesa] = useState()
    const [carro,setCarro] = useState([])

    return(
        <RestaurantContext.Provider value={{mesa, setMesa, carro, setCarro}}>{children}</RestaurantContext.Provider>
    )
}

export default RestaurantContext