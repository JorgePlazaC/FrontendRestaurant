import { createContext, useState, useEffect } from "react"

const RestaurantContext = createContext()

export function RestaurantProvider({children}){
    const [mesa,setMesa] = useState()

    return(
        <RestaurantContext.Provider value={{mesa, setMesa}}>{children}</RestaurantContext.Provider>
    )
}

export default RestaurantContext