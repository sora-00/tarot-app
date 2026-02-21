'use client'

import { Box, ChakraProvider } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <Box>{children}</Box>
    }

    return (
        <ChakraProvider>
            {children}
        </ChakraProvider>
    )
}
