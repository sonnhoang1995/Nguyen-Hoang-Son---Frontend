import { useState } from "react"
import { CurrencySwapFormType, FormType } from "../types/types"
import CurrencyListDialog from "./currency-list-dialog"
import { Card } from "./ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog"
import { Input } from "./ui/input"

interface Props {
    currency: string
    type: CurrencySwapFormType
    amount: string
    onFormChange: (field: string, value: string | number) => void
}

const CurrencyContainer = ({ currency, type, amount, onFormChange }: Props) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false)

    const handleSelect = (currency: string) => {
        onFormChange("currency", currency)
    }

    const handleClose = () => {
        setOpenDialog(false)
    }

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value

        if (inputValue !== "0" && inputValue.startsWith("0")) {
            inputValue = inputValue.replace(/^0+(?=\d)/, "")
        }

        if (inputValue === "") {
            inputValue = "0"
        }
        onFormChange("amount", inputValue)
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <Card className="flex items-end justify-between h-auto p-4 w-96">
                <div className="flex flex-col items-start text-sm text-gray-400">
                    {type === FormType.From ? "From" : "To"}
                    <DialogTrigger className="flex gap-2 px-0 bg-white border-none !outline-none text-black text-base hover:font-bold font-normal">
                        {currency ? (
                            <img
                                src={`${
                                    import.meta.env.VITE_TOKEN_ICON_URL
                                }/${currency}.svg`}
                            />
                        ) : (
                            <></>
                        )}
                        {currency ? currency : "Click to select"}
                    </DialogTrigger>
                </div>
                <DialogContent>
                    <DialogTitle>Currency List</DialogTitle>
                    <DialogDescription>
                        Select one of the currency below
                    </DialogDescription>
                    <CurrencyListDialog
                        handleSelect={handleSelect}
                        handleClose={handleClose}
                    />
                </DialogContent>
                <Input
                    type="number"
                    value={amount}
                    className="bg-white w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    onChange={handleChangeAmount}
                    disabled={!currency}
                    min="0"
                />
            </Card>
        </Dialog>
    )
}

export default CurrencyContainer
