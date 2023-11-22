import { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CompressSharpIcon from '@mui/icons-material/CompressSharp';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Link from '@mui/material/Link';
import './App.css'

function App() {
  const [url, setUrl] = useState("");
  const [sUrl, setsUrl] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("");

  const handleUrlChange = (event) => {
    event.preventDefault();
    setUrl(event.target.value);
  }

  const handleUrlSubmit = (event) => {
    fetch(`http://localhost:3000/shorten/${url}`, {
      method: "POST",
    })
    .then((response) =>{
      return response.json()
    })
    .then(({url}) => {
      setsUrl(url);
    })
  }

  const handleCopy = (event) => {
    navigator.clipboard.writeText(sUrl);
    setCopyButtonText("Copied!");
  }

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Box sx={{ width: 500, maxWidth: '100%'}}>
          <TextField fullWidth label="URL" id="fullWidth" value={url} onChange={handleUrlChange}/>
        </Box>
        <Button onClick={handleUrlSubmit} variant="contained" endIcon={<CompressSharpIcon />}>Shorten url</Button>
      </Stack>
      <br></br>
      <Divider style = {sUrl === "" ? {visibility: "hidden"} : {color: "#1976d2"}} textAlign="left">Your hashed url:</Divider>
      <br></br>
      <Stack direction="row" spacing={2}>
        <Link href={sUrl} underline="hover"> {sUrl} </Link>
        <Button size="small" onClick={handleCopy} style = {sUrl === "" ? {visibility: "hidden"} : {color: "#1976d2"}} variant="outlined" endIcon={copyButtonText !== "" ? "" : <ContentCopyIcon />}>
          {copyButtonText}
        </Button>
      </Stack>
    </>
  )
}

export default App
