const keys = require("./keys")
const redis = require("redis")

// Create Redis client
const subscriber = redis.createClient({
    url: `redis://${keys.redisHost}:${keys.redisPort}`,
    socket: {
        reconnectStrategy: (retries) => {
            console.log(`Retrying Redis connection attempt #${retries}`)
            return 1000 // retry in 1 sec
        },
    },
})
// Create publisher (duplicate of client)
const publisher = subscriber.duplicate()
const fib = (index) => {
    if (index < 2) return 1
    return fib(index - 1) + fib(index - 2)
}

// Anonymous async function that runs immediately
async function connectRedis() {
    let connected = false
    while (!connected) {
        try {
            await subscriber.connect()
            await publisher.connect()
            console.log("✅ Connected to Redis")

            await subscriber.subscribe("insert", async (message) => {
                const index = parseInt(message)
                const result = fib(index)
                await publisher.hSet("values", message, result)
                console.log(`📬 Stored fib(${index}) = ${result}`)
            })

            connected = true
        } catch (err) {
            console.error("❌ Redis connection error:", err)
            console.log("Retrying in 2 seconds...")
            await new Promise((res) => setTimeout(res, 2000))
        }
    }
}

;(async () => {
    await connectRedis()
})()
