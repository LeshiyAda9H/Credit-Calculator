//Файл для настройки глобальной темы Material-UI
import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', //Основной синий цвет
            contrastText: '#fff',
        },
        secondary: {
            main: '#f50057', //Акцентный розовый
        },
        background: {
            default: '#f6f6f6', //Светлый фон
            paper: '#fff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Halvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 550,
        },
        subtitle1:{
            fontWeight: 500,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '24px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root:{
                    paddingTop: '32px',
                    paddingBottom: '32px',
                },
            },
        },
    },
});

export default theme;