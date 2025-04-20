import React, { Component } from "react"
import axios from "axios"

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: "",
    }

    componentDidMount() {
        this.fetchValues()
        this.fetchIndexes()
    }

    async fetchValues() {
        const values = await axios.get("/api/values/current")
        this.setState({ values: values.data })
    }

    async fetchIndexes() {
        const seenIndexes = await axios.get("/api/values/all")
        this.setState({ seenIndexes: seenIndexes.data })
    }

    handleSubmit = async (event) => {
        event.preventDefault()

        await axios.post("/api/values", {
            index: this.state.index,
        })
        this.setState({ index: "" })
    }


    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input
                        value={this.state.index}
                        onChange={(event) => this.setState({ index: event.target.value })}
                    />
                    <button>Submit</button>
                </form>
                <h2>Indexes I have seen:</h2>
                <ul>
                    {this.state.seenIndexes.map(({ number }) => number).join(", ")}
                </ul>
                <h2>Calculated Values:</h2>
                <ul>
                    {Object.keys(this.state.values).map((key) => (
                        <li key={key}>
                            For index {key} I calculated {this.state.values[key]}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default Fib