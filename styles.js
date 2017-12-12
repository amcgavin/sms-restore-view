module.exports = `
body {
    font-family: Verdana, sans-serif;
    font-size: 10pt;
}

.container {
    width: 500px;
    margin: 0 auto;
}
.time, .date {
    text-align: center;
}

.to, .from {
    display: flex;
}

.to span, .from span {
    max-width: 200px;
    border-radius: 5px;
    background: beige;
    padding: 5px;
    margin: 1px 0;
    word-break: break-word;
}

.from span {
    background: lavender;
}

.to {
    flex-direction: row-reverse;
    text-align: right;
}


`;