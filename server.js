// server.js
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const multiplayerGame = require('./multiplayerGame.js');
const gameLogic = require('./public/shared/gameLogic.js');
const app = express();
const server = http.createServer(app);
const lobbies = new Map();
const socketLobby = new Map();
lobbies.__tag = Math.random().toString(36).slice(2, 7);
function getGame(socketId) {
    return lobbies.get(socketLobby.get(socketId));
}
const ALPHABET="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function makeCode() {
    let code="";
    while (code=="" || lobbies.has(code)){
        code = "";
        for (let i = 0; i < 6; i++) {
            code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        }
    }
    return code;
}
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log('listening on', PORT));
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            const allowed = [
                "https://graysandwich.github.io",
                /^http:\/\/127\.0\.0\.1:\d+$/,
                /^http:\/\/localhost:\d+$/
            ];
            const ok = !origin || allowed.some((rule) =>
                typeof rule === "string" ? rule === origin : rule.test(origin)
            );
            callback(null, ok);
        }
    }
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);
    socket.on('checkLobby', (code, callback) => {
        code = String(code || "").toUpperCase().trim();
        const gameState = lobbies.get(code);
        callback({
            exists: !!gameState,
            started: gameState ? !!gameState.started : false,
            playerCount: gameState ? Object.keys(gameState.players).length : 0
        });
    });

    socket.on('joinGame', (difficulty, chosenCharacter) => {
        multiplayerGame.addPlayer(game, socket.id, difficulty, chosenCharacter);
        console.log(`Player spawned: ${socket.id}`);
    });
    socket.on('createLobby', (difficulty, character, callback) => {
        console.log('createLobby received', difficulty, character, typeof callback);
        
        const code = makeCode();
        const gameState = multiplayerGame.createGameState();
        gameState.code = code;
        gameState.hostId = socket.id;
        gameState.difficulty=difficulty;
        gameState.started=false;
        lobbies.set(code, gameState);
        socket.join(code);
        socketLobby.set(socket.id, code);
        multiplayerGame.addPlayer(gameState, socket.id, character);
        console.log('SET tag=', lobbies.__tag, 'size=', lobbies.size);
        callback({ ok: true, code });
    });
    socket.on('startLobby', (callback)=>{
        const gameState = lobbies.get(socketLobby.get(socket.id));
        gameState.started=true;
        multiplayerGame.createGame(gameState, gameState.difficulty);
        callback({ ok: true });
        io.to(gameState.code).emit('gameStarted');
    });

    
    socket.on('joinLobby', (code, character, callback) => {
        code = String(code || "").toUpperCase().trim();
        const gameState = lobbies.get(code);
        if (!gameState) return callback({ ok: false, error: "No such lobby" });

        socket.join(code);
        socketLobby.set(socket.id, code);
        multiplayerGame.addPlayer(gameState, socket.id, character);
        io.to(gameState.code).emit('updatePlayerCount', Object.keys(lobbies.get(code).players).length);

        callback({ ok: true, code, playerCount: Object.keys(lobbies.get(code).players).length});
    });
    socket.on('input', (data) => {
        const game = getGame(socket.id);
        if (!game) return;
        const player = game.players[socket.id];
        if (player) {
            player.inputs[data.key] = data.state;
        }
    });

    socket.on('disconnect', () => {
        const code = socketLobby.get(socket.id);
        socketLobby.delete(socket.id);
        const gameState = lobbies.get(code);
        if (!gameState) return;
        delete gameState.players[socket.id];
        if (Object.keys(gameState.players).length === 0) lobbies.delete(code);
    });
    socket.on("resumeGame", () => {
        const game = getGame(socket.id);
        if (!game) return;
        const player = game.players[socket.id];
        if (!player) return;
        game.currentPage = "gamePage";
    });
    socket.on("changeBoughtUpgrades", (data)=>{
        const game = getGame(socket.id);
        if (!game) return;
        const player = game.players[socket.id];
        if (!player) return;
        player.boughtUpgrades[data.index]+=data.amount;
    });
    socket.on("buyUpgrade", (data) => {
        const game = getGame(socket.id);
        if (!game) return;
        const player = game.players[socket.id];
        if (!player) return;

        if (player) {
            if (data.type == "stat") {

                if (typeof player[data.stat] === "number") {
                    player[data.stat] += data.amount;
                }
            }
            else if (data.type == "changeStat") {
                if (data.stat === "frostProjectileMaxCooldown") {
                    player.frostProjectileMaxCooldown = 100 / player.frostProjectiles;
                }
                else if (data.stat === "attackSpeed") {
                    player.attackSpeed /= data.amount;
                    player.attackSpeedMultiplier /= data.amount;
                }
                else if (data.stat === "xpMultiplier") {
                    player.xpMultiplier *= data.amount;
                }
                else if (data.stat === "projectileSizeMultiplier") {
                    player.projectileSizeMultiplier *= data.amount;
                }
                else if(data.stat==="iceBulletsPierce"){
                    player.iceBulletsPierce=true;
                }
                else if(data.stat==="passiveSpawning"){
                    player.passiveSpawning=true;
                }
                else if(data.stat==="bouncingProjectileMaxCooldown"){
                    player.bouncingProjectileMaxCooldown = 240 / player.bouncingProjectiles;
                }
                else if (typeof player[data.stat] === "number") {
                    player[data.stat] = data.amount;
                }
            }
            else if (data.type == "object") {
                if (data.stat === "laser") {
                    game.bullets.push(new gameLogic.PlayerLaser(-Math.PI / 2, player.x, player.y, player));
                }
                else if (data.stat === "bomb") {
                    let temp = new gameLogic.BombIcon(50, player.abilities.length)
                    player.abilities.push(temp)
                    game.abilityIcons.push(temp);
                }
                else if (data.stat === "timeWarp") {
                    let temp = new gameLogic.TimeWarpIcon(50, player.abilities.length)
                    player.abilities.push(temp)
                    game.abilityIcons.push(temp);
                }
                else if (data.stat === "protectorBullet") {
                    game.bullets.push(new gameLogic.ProtectorBullet(1, player, game.protectorBullets));
                    game.bullets.push(new gameLogic.ProtectorBullet(1, player, game.protectorBullets));
                    gameLogic.ProtectorBullet.Spacing(player, game.protectorBullets);
                }
                else if (data.stat === "playerShield") {
                    let temp = new gameLogic.PlayerShield(50, player);
                    game.bullets.push(temp);
                }
                else if (data.stat === "bulletWipe") {
                    let temp = new gameLogic.BulletDeleterIcon(50, player.abilities.length)
                    player.abilities.push(temp);
                    game.abilityIcons.push(temp);
                }
            }
            else if(data.type=="abilityUpgrade"){
                
            }
            
        }
    })
    socket.on("readyUp", (id) => {
        const game = getGame(socket.id);
        if (!game) return;
        let players = game.players;
        if (players[id]) {
            players[id].isReady = true;
        }

        let allReady = true;
        let playerCount = 0;

        for (let id in players) {
            playerCount++;
            //console.log(players[id].isReady)
            if (players[id].isReady === false) {
                allReady = false;
            }
        }
        if (allReady && playerCount > 0) {
            for (let id in players) {
                players[id].isReady = false;
            }
            game.currentPage = "gamePage";
        }
        // console.log(playerCount+" "+players[id].isReady+" "+players[id]+" "+id)
    });
});
let count=0;
setInterval(() => {
    
    for(let [code, game] of lobbies){
        if(game.started){
            let result = multiplayerGame.MultiplayerGameLogic(game);
        
            if(result){
                let deadPlayers=result[0];
                let won=result[1];
                
                if (deadPlayers && deadPlayers.length > 0) {
                    for (let id of deadPlayers) {
                        if(won){
                            io.to(id).emit("gameWin");
                        }
                        else{
                            io.to(id).emit("gameOver");
                        }
                    }
                }
            }
            if (Object.keys(game.players).length === 0) {
                for (const sid of io.sockets.adapter.rooms.get(code) ?? []) {
                    socketLobby.delete(sid);
                }
                lobbies.delete(code);
                continue;
            }
            io.emit('stateUpdate', game);
        }

        
    }
    
    
}, 1000 / 67);

server.listen(3000, () => console.log("TESTING TESTING 123"));