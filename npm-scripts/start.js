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
            socket.write('OK'); // the game will not receive this message if the server is not running
        } else if (trimmedMessage === 'VERIF') {
            // todo: implement connection verification
            socket.write('OK');
        } else if (trimmedMessage === 'GETPLAYERS') {
            // todo: implement this using json
            socket.write('NOT_IMPLEMENTED');
        } else if (trimmedMessage === 'DISCNT') {
            socket.destroy();
            console.log("Player disconnected from the server");
        }

        // If data is not recognized, do nothing
    });
});

server.listen(9742, () => console.log('Listening on port 9742'));

process.on('SIGINT', () => {
    console.log("\nReceived Ctrl + C from the keyboard, exiting.");
    process.exit();
});