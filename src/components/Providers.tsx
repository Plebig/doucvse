'use client'
import React, { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

interface Providersprops {
  children: ReactNode
}

const Providers: FC<Providersprops> = ({children}) => {
  return (
    <>
     <Toaster position='top-center' reverseOrder={false}/>
     {children}
    </>
  )
}

export default Providers
