import { useEffect, useState } from "react"
import { Token } from "../types/types"

export const useTokenPrice = () => {
    const [tokenList, setTokenList] = useState<Token[] | null>(null)

    useEffect(() => {
        async function fetchTokenList() {
            const data: Token[] = await fetch(
                import.meta.env.VITE_TOKEN_PRICE_URL
            ).then((res) => res.json())

            const filteredData = data.reduce((acc: Token[], curr) => {
                const existedTokenIndex = acc.findIndex(
                    (token: Token) => token.currency === curr.currency
                )

                if (existedTokenIndex > -1) {
                    const oldTokenDate = new Date(
                        acc[existedTokenIndex].date
                    ).getTime()
                    const newTokenDate = new Date(curr.date).getTime()

                    if (oldTokenDate > newTokenDate) {
                        return acc
                    } else {
                        acc.splice(existedTokenIndex, 1)
                        return acc.concat([curr])
                    }
                } else {
                    return acc.concat([curr])
                }
            }, [])

            setTokenList(filteredData)
        }

        fetchTokenList()
    }, [])

    return { tokenList }
}
