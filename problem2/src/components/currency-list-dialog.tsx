import { useTokenPrice } from "@/hooks/use-token-price"
import { Token } from "@/types/types"
import { ScrollArea } from "./ui/scroll-area"

interface Props {
    handleSelect: (currency: string) => void
    handleClose: () => void
}

const CurrencyListDialog = ({ handleSelect, handleClose }: Props) => {
    const { tokenList } = useTokenPrice()
    const onSelect = (currency: string) => {
        handleSelect(currency)
        handleClose()
    }

    return tokenList ? (
        <ScrollArea className="border border-gray-300 rounded-lg h-96">
            {tokenList.map(({ currency }: Token, i: number) => (
                <div
                    key={`${currency}-${i}`}
                    className="flex items-center gap-4 p-4 text-black bg-white border-b border-gray-200 cursor-pointer hover:text-white hover:bg-gray-400"
                    onClick={() => onSelect(currency)}
                >
                    <img
                        src={`${
                            import.meta.env.VITE_TOKEN_ICON_URL
                        }/${currency}.svg`}
                        alt={`${currency} icon`}
                    />
                    {currency}
                </div>
            ))}
        </ScrollArea>
    ) : (
        <></>
    )
}

export default CurrencyListDialog
