import "./App.css"
import CurrencySwapForm from "./components/currency-swap-form"
import { Card } from "./components/ui/card"

function App() {
    return (
        <Card className="p-4">
            <h1 className="mb-8 text-4xl font-bold">Currency Swap</h1>
            <CurrencySwapForm />
        </Card>
    )
}

export default App
