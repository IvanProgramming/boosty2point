import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { useDropzone } from 'react-dropzone';
import { Button, Paper, Snackbar } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import GitHubIcon from '@mui/icons-material/GitHub';



function Copyright() {
  return (
    <>
      <Typography variant="body2" color="text.secondary">
        by <Link color="inherit" href="https://github.com/ivanrpgramming">
          IvanProgramming
        </Link> {' '}
        {new Date().getFullYear()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Hosted on <Link color="inherit" href="https://vercel.com/">Vercel</Link>
      </Typography>
    </>
  );
}


export default function App() {
  const [openLoading, setOpenLoading] = React.useState(false);
  const [openLoaded, setOpenLoaded] = React.useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        console.log(reader.result)
        setOpenLoading(true)
        const binaryStr = reader.result
        let firstLine = binaryStr.split('\n')[0].split(';')
        let lines = binaryStr.split('\n')
        let users = []
        for (let i = 1; i < lines.length; i++) {
          let user = Object.fromEntries(firstLine.map((key, index) => [key, lines[i].split(';')[index]]))
          users.push(user)
        }
        console.log(users)
        let subscribers = []
        for (let i = 0; i < users.length; i++) {
          if (users[i]["type"] === "subscription") {
            let end_date = users[i]["end_date"]
            if (end_date === "-") {
              subscribers.push(users[i])
            } else {
              let date = new Date(end_date)
              let now = new Date()
              if (date > now) {
                subscribers.push(users[i])
              }
            }
          }
        }
        setOpenLoading(false)
        setOpenLoaded(true)
        setTimeout(() => {
          setOpenLoaded(false)
        }, 1000)
        let auction = []
        for (let i = 0; i < subscribers.length; i++) {
          let name = ""
          if (subscribers[i]["name"].startsWith("\"")) {
            name = subscribers[i]["name"].slice(1, subscribers[i]["name"].length - 1)
          } else {
            name = subscribers[i]["name"]
          }
          let info = ""
          if (subscribers[i]["info"].startsWith("\"")) {
            info = subscribers[i]["info"].slice(1, subscribers[i]["info"].length - 1)
          } else {
            info = subscribers[i]["info"]
          }
          auction.push({
            "fastId": i,
            "id": i,
            "name": `${name} (${info})`,
            "amount": 1,
            "extra": null,
          })
        }
        // Storing to file and downloading
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auction));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "subscribers.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    },
    multiple: false,

  })

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <CssBaseline />
        <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
          <Typography variant="h2" component="h1" gutterBottom>
            Boosty2Pointauc
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom style={{ textAlign: "justify" }}>
            Концепция, которая позволяет перенести подписчиков из <Link href="https://boosty.to" color="inherit">Boosty</Link> в рулетку <Link href="https://pointauc.ru/" color="inherit">PointAuc</Link>
          </Typography>
          <Box
            sx={{
              display: 'flex',
              '& > :not(style)': {
                m: 1,
                width: "100%",
                height: 128,
              },
            }}
          >
            <Paper elevation={3} style={{ display: "flex", justifyContent: "center", alignItems: "center", }} {...getRootProps({ className: 'dropzone' })}>
              <Typography component="h1" gutterBottom >
                <input {...getInputProps()} />
                <div style={{ display: "flex", "alignItems": "center" }}>
                  <UploadFileIcon />&nbsp;&nbsp;
                  <b>Перетащи или выбери файл  с подписчиками Boosty</b>
                </div>
              </Typography>
            </Paper>
          </Box>
        </Container>
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Button variant="text" href="https://github.com/ivanprogramming/boosty2point" color='inherit'>
                 <GitHubIcon style={{marginRight: 10}}/><b>Исходный код</b>
            </Button>
            <Copyright />
          </Container>
        </Box>
      </Box>
      <Snackbar
        open={openLoading}
        autoHideDuration={1}
        message="Обрабатываем файл..."
      />
      <Snackbar
        open={openLoaded}
        autoHideDuration={1000}
        message="Файл обработан"
      />
    </>
  );
}