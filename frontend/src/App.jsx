import { useState } from 'react'
import './App.css'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CompressSharpIcon from '@mui/icons-material/CompressSharp';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Stack direction="row" spacing={2}>
      <Box sx={{ width: 500, maxWidth: '100%'}}>
        <TextField fullWidth label="URL" id="fullWidth" />
      </Box>
 
      <Button variant="contained" endIcon={<CompressSharpIcon />}>
        Shorten
      </Button>
    </Stack>
    </>
  )
}

export default App
