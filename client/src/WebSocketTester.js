import React, { useEffect, useRef, useState } from "react"

const WebSocketTester = () => {
    const wsRef = useRef(null)
    const [messages, setMessages] = useState([])
    const [status, setStatus] = useState("Disconnected")

    useEffect(() => {
        // Dynamically use ws or wss based on current location
        const protocol = window.location.protocol === "https:" ? "wss" : "ws"
        const wsUrl = `${protocol}://${window.location.host}/ws`

        const ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
            setStatus("Connected")
            console.log("✅ WebSocket connected")
            ws.send("Hello from client")
        }

        ws.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data])
        }

        ws.onerror = (error) => {
            console.error("❌ WebSocket error:", error)
            setStatus("Error")
        }

        ws.onclose = () => {
            setStatus("Disconnected")
            console.log("🔌 WebSocket closed")
        }

        return () => {
            ws.close()
        }
    }, [])

    return (
        <div style={{ padding: "1rem" }}>
            <h2>WebSocket Tester</h2>
            <p>
                Status: <strong>{status}</strong>
            </p>
            <div>
                <h4>Messages:</h4>
                <ul>
                    {messages.map((msg, i) => (
                        <li key={i}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default WebSocketTester
