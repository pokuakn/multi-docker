const keys = require("./keys")

// Express server setup
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(bodyParser.json())

// Postgres client setup
const { Pool } = require("pg")
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
})

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.log(err))
})

pgClient.on("error", (err) => {
    console.log("Postgres error: lost PG connection", err)
})

// Redis client setup
const redis = require("redis")

// Create Redis client
const redisClient = redis.createClient({
    url: `redis://${keys.redisHost}:${keys.redisPort}`,
    socket: {
        reconnectStrategy: (retries) => {
            console.log(`Retrying Redis connection attempt #${retries}`)
            return 1000 // retry in 1 sec
        },
    },
})

// Create publisher (duplicate of client)
const redisPublisher = redisClient.duplicate()

async function connectRedis() {
    try {
        await redisClient.connect()
        await redisPublisher.connect()
        console.log("Connected to Redis")
    } catch (err) {
        console.error("Redis connection error:", err)
    }
}

connectRedis()

// Express route handlers
app.get("/values/all", async (req, res) => {
    const values = await pgClient.query("SELECT * FROM values")
    res.send(values.rows)
})

app.get("/values/current", async (req, res) => {
    const values = await redisClient.hGetAll("values")
    res.send(values)
})

app.post("/values", async (req, res) => {
    const index = req.body.index

    if (parseInt(index) > 40) {
        return res.status(422).send("Index too high")
    }

    await redisClient.hSet("values", index, "Nothing yet!")
    await redisPublisher.publish("insert", index)
    pgClient.query("INSERT INTO values(number) VALUES($1)", [index])

    res.send({ working: true })
})



// WebSocket server setup
const PORT = 5000
const server = require("http").createServer(app)
const WebSocket = require("ws")
const wss = new WebSocket.Server({ server, path: "/ws" })

wss.on("connection", (ws) => {
    console.log("🔌 WebSocket connected")
})

server.listen(PORT, () => {
    console.log(`Server (with WebSocket) listening on port ${PORT}`)
})