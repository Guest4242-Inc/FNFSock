const net = require('net');
const colors = require('colors');

// HTML response for browsers
const badRequestHTML = `
HTTP/1.1 400 Bad Request
Content-Type: text/html
Connection: close

<h1>ayo, bro!</h1>
<p>you cant visit fnf guest4242 engine multiplayer server via browser, you can only connect to it through the game!</p>
<p>if u are selfhoster, sorry there is no admin panel rn :(</p>
`;

const gradientText = (text) => {
    const gradientColors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
    let coloredText = '';
    for (let i = 0; i < text.length; i++) {
        const colorIndex = Math.floor((i / text.length) * gradientColors.length);
        coloredText += text[i][gradientColors[colorIndex]];
    }
    return coloredText;
};
const purpleText = (text) => {
    let coloredPurpleText = '';
    for (let i = 0; i < text.length; i++) {
        coloredPurpleText += text[i]['magenta'];
    }
    return coloredPurpleText;
};

console.log(gradientText("███████████████████████████████████████████████"));
console.log(gradientText("█") + "                                             " + purpleText("█"));
console.log(gradientText("█") + "            FNFSock v0.0.1 Beta              " + purpleText("█"));
console.log(gradientText("█") + "        Made for FNF Guest4242 Engine        " + purpleText("█"));
console.log(gradientText("█") + "           0.0.3 Multiplayer Update          " + purpleText("█"));
console.log(gradientText("█") + "                                             " + purpleText("█"));
console.log(gradientText("███████████████████████████████████████████████"));
console.log("Starting server...");

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const message = data.toString();
        console.log('Received data:\n', message);

        // Detect a browser connection (HTTP request)
        if (message.startsWith('GET') || message.startsWith('POST')) {
            console.log('Browser connection detected, sending 400 Bad Request');
            socket.write(badRequestHTML);
            socket.destroy(); // Close the connection after sending the response
            return;
        }

        // Handle recognized game client messages
        const trimmedMessage = message.trim();
        if (trimmedMessage === 'CNT') {
            console.log("A new connection!");
            // set the host server name to show in game (e.g, if its 'my cool server', when connected it will assign the server name automatically to 'my cool server')
            socket.write('SRVNAME: my first fnf guest4242 engine multiplayer server'); // todo: maybe make this use json?
            // specify other necessary stuff
            socket.write('MINVER: 0.0.3'); // minimum version of the game required to connect
            socket.write('DESC: join!'); // description of the server
            socket.write('MAXPLAYERS: 10'); // maximum number of players allowed to connect. NOTE: you can disable the limit by setting this to 0
            socket.write('SRVTYPE: 0'); // server type (0 = public, 1 = private)
            socket.write('GHOSTTAPPING: 0'); // ghost tapping (0 = disabled, 1 = enabled)
            socket.write('OK'); // the game will not receive this message if the server is not running
        } else if (trimmedMessage === 'VERIF') {
            // todo: implement connection verification
            socket.write('OK');
        } else if (trimmedMessage === 'GETPLAYERS') {
            // todo: implement this using json
            socket.write('NOT_IMPLEMENTED');
        } else if (trimmedMessage === 'DISCNT') {
            socket.write('WAIT');
            socket.destroy();
            console.log("Player disconnected from the server");
        } else if (trimmedMessage == 'PING') {
            socket.write('PONG');
            console.log("Game pinged the server");
        } else if (trimmedMessage.startsWith('SETUSRNAME')) {
            const username = trimmedMessage.split(' ')[1];
            if (!username) {
                socket.write('ERROR');
                console.log("SETUSRNAME command received without a username, the hell did the game do?");
                return;
            }

            // Assign the username to the socket
            socket.username = username;
            console.log(`Username set for a player: ${username}`);
            socket.write('USERNAME_SET');
        } else if (trimmedMessage.startsWith('CHAT')) {
            const chatMessage = trimmedMessage.split(' ').slice(1).join(' ');
            if (!socket.username) {
                socket.write('ERROR');
                console.log("CHAT command received without a username, the hell did the game do?");
                return;
            }

            // Broadcast the chat message to all connected clients
            server.getConnections((err, count) => {
                if (err) {
                    console.error('Error getting connections:', err);
                    return;
                }
                console.log(`Broadcasting chat message from ${socket.username} to ${count} clients`);
                socket.write(`CHAT ${socket.username}: ${chatMessage}`);
            });
        } else if (trimmedMessage.startsWith("playerNoteMiss")) {
            const noteMissData = trimmedMessage.split(' ').slice(1).join(' ');
            if (!socket.username) {
                socket.write('ERROR');
                console.log("playerNoteMiss command received without a username, the hell did the game do?");
                return;
            }

            // Broadcast the note miss data to all connected clients
            server.getConnections((err, count) => {
                if (err) {
                    console.error('Error getting connections:', err);
                    return;
                }
                console.log(`Broadcasting note miss data from ${socket.username} to ${count} clients`);
                socket.write(`playerNoteMiss ${socket.username}: ${noteMissData}`);
            });
        } else if (trimmedMessage.startsWith("noteHit")) {
            const parts = trimmedMessage.split(' ');
            const noteHitData = parts.slice(1, -1).join(' ');
            const timing = parts[parts.length - 1]; // Assuming the timing is the last part of the message

            if (!socket.username) {
            socket.write('ERROR');
            console.log("noteHit command received without a username, the hell did the game do?");
            return;
            }

            // Broadcast the note hit data along with timing to all connected clients
            server.getConnections((err, count) => {
            if (err) {
                console.error('Error getting connections:', err);
                return;
            }
            console.log(`Broadcasting note hit data from ${socket.username} with timing ${timing} to ${count} clients`);
            socket.write(`noteHit ${socket.username} ${noteHitData}-${timing}`);
            });
        }

        // If data is not recognized, do nothing
    });
});

server.listen(9742, () => console.log('Listening on port 9742'));

process.on('SIGINT', () => {
    console.log("\nReceived Ctrl + C from the keyboard, exiting.");
    process.exit();
});