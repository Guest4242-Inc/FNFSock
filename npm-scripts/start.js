const net = require('net');
const colors = require('colors');

const gradientText = (text) => {
    const gradientColors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
    let coloredText = '';
    for (let i = 0; i < text.length; i++) {
        const colorIndex = Math.floor((i / text.length) * gradientColors.length);
        coloredText += text[i][gradientColors[colorIndex]];
    }
    return coloredText;
};

console.log(gradientText("███████████████████████████████████████████████"));
console.log(gradientText("█") + "                                             " + gradientText("█"));
console.log(gradientText("█") + "            FNFSock v0.0.1 Beta              " + gradientText("█"));
console.log(gradientText("█") + "        Made for FNF Guest4242 Engine        " + gradientText("█"));
console.log(gradientText("█") + "           0.0.3 Multiplayer Update          " + gradientText("█"));
console.log(gradientText("█") + "                                             " + gradientText("█"));
console.log(gradientText("███████████████████████████████████████████████"));
console.log("Starting server...");
const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', (data) => {
        const message = data.toString().trim();
        console.log('Received data being sended:\n', message);

        if (message === 'CNT') {
            socket.write('OK'); // the game will not receive this message if the server is not running
        } else if (message === 'VERIF') {
            // todo: implement connection verification
            socket.write('OK');
        } else if (message === 'GETPLAYERS') {
            // todo: implement this using json
            socket.write('NOT_IMPLEMENTED');
        }
        
        // if data is not recognized, return nothing
    });

    socket.on('end', () => console.log('Client disconnected'));
});

server.listen(9742, () => console.log('Listening on port 9742'));