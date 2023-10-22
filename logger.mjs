function log(message) {
    console.log(`node-app ${JSON.stringify({ message })}`);
}

function error(err) {
    console.error(`node-app ${JSON.stringify({ error: err.toString() })}`);
}

export default {
    log,
    error
}