import { createContext, useState } from "react"

const RestaurantContext = createContext()

export function RestaurantProvider({children}){
    const [mesa,setMesa] = useState()

    const ElegirMesa = (numMesass) =>{
        setMesa(numMesass)
    }

    return(
        <RestaurantContext.Provider value={{mesa, ElegirMesa}}>{children}</RestaurantContext.Provider>
    )
}

export default RestaurantContext