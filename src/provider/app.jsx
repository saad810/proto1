import React from 'react'
import RootLayout from '../layout/root'
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import theme from '../lib/theme';


const AppProvider = ({ children }) => {
    return (
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
            <RootLayout>
                <BrowserRouter>{children}</BrowserRouter>
                <Toaster
                    toastOptions={{
                        duration: 10 * 1000,
                    }}
                />
            </RootLayout>
        </MantineProvider>
    )
}


export default AppProvider
