const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const path = require("path");
require("dotenv").config();

/* Servicios subastas */
const AuctionService = require('./src/servises/auctionService')
const MessageService = require('./src/servises/messageService')
const CountdownService = require('./src/servises/countdownService')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 5050;

/* INICIAMO EL CONTADOR */
const countdownService = new CountdownService(io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routers
const cliente = require("./src/router/cliente");
const admin = require("./src/router/admin");

app.use("/", cliente);
app.use("/admin", admin);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "public")));

/* CONFIGURACION SOCKET */
io.on('connection', (socket) => {
  console.log('Nuevo ciente conectado');

  socket.on('joinroom', async (room, userName) => {
    try {
      socket.join(room);
      const auctionState = await AuctionService.getAuctionState(room);

      if (auctionState) {
        socket.emit('auctionState', {
          ...auctionState,
          timeLeft: countdownService.getTimeLeft(room),
          countdownRunning: countdownService.isRunning(room)
        });
      }
    } catch (error) {
      console.error('Error al unirse a la sela: ', error);
      
    }
  })

  socket.on('bid', async (data) => {
    try {
      const userId = await AuctionService.getUserId(data.user);
      if (!userId) {
        console.error('usuario no encontrado: ', data.user);
        return;
      }

      const result = await AuctionService.saveBid(data.room, userId, data.user);
      if (result.success) {
        //Iniciar o reinicia el contador con el envio de la puja del cliente
        if (!countdownService.isRunning(data.room)) {
          countdownService.startCountdown(data.room);
        }else{
          countdownService.resetCountDown(data.room);
        }

        const update = await AuctionService.getAuctionState(data.room);
        io.to(data.room).emit('auctionState', {
          ...updateState,
          timeLeft: countdownService.getTimeLeft(data.room),
          countdownRunning: true
        });
      }
    } catch (error) {
     console.error('error al procesar puja: ', error);
    }
  })

  socket.on('sendMessage', (data) => {
    const {remateId, userid, message, monto} = data;

    MessageService.seveMessage(remateId, userid, message, monto, (error, messageId) =>{
      if (error) {
        console.error('Error al guardar el mensaje: ', error);
        return;
      }

      /* Emitir el mensaje guardado a todos los clientes */
      io.to(remateId).emit('newMessage', { remateId, userid, message, monto });
    });
  });

  socket.on('endAuction', async (room) => {
    try {
      await AuctionService.endAuction(room);
      countdownService.stopCountDown(room);
      
      const finalState = await AuctionService.getAuctionState(room);
      io.to(room).emit('auctionState', finalState);
    } catch (error) {
      console.error('Error al finalizar subasta: ', error);  /* 219*12 29.9   1410  bcp 1566 */
    }
  })

  socket.on('desconectado', () => {
    console.log('Cliente desconectado');
    
  })
})

app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});