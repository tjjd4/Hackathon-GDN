import React, { useState, useEffect } from 'react'

export default function useIsClient() {

 const [isClient, setIsClient] = useState<boolean>(false)

 useEffect(() => {
    setIsClient(true)
 }, [])

  return isClient
}
