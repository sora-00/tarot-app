'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

const theme = extendTheme({
  fonts: {
    body: '"Zen Maru Gothic", sans-serif',
    heading: '"Zen Maru Gothic", sans-serif',
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div suppressHydrationWarning>{children}</div>
    }

    return (
        <ChakraProvider theme={theme}>
            <div suppressHydrationWarning>
                {children}
            </div>
        </ChakraProvider>
    )
}
