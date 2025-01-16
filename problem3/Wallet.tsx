// Add Blockchain type to use later.
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo"

interface WalletBalance {
    id: string // Add unique id to use as key for list rendering.
    currency: string
    amount: number
    blockchain: Blockchain // Add missing property.
}

// If this interface has the same properties that WalletBalance has, we can use extends to inherit those properties.
// interface FormattedWalletBalance {
//     currency: string
//     amount: number
//     formatted: string
// }

interface FormattedWalletBalance extends WalletBalance {
    formatted: string
    usdValue: number
}

// In the getPriority below, we're using switch statement.
// In a switch, the engine must go through each case to compare the value in the expression.
// So if we have a larger number of cases, we can create an object to use object lookup to replace switch statements as a more efficient method.
const BLOCKCHAIN_PRIORITY: { [property in Blockchain]?: number } = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20
}

// Define default blockchain priority to avoid using magic numbers.
const DEFAULT_BLOCKCHAIN_PRIORITY = -99

// If this interface extends BoxProps but has no new properties, then we just need to use the BoxProps interface.
// interface Props extends BoxProps {}

const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
    const { children, ...rest } = props
    const balances: WalletBalance[] = useWalletBalances()
    const prices: { [property: string]: number } = usePrices()

    // Since we're going to use the BLOCKCHAIN_PRIORITY object above, so this function is not necessary anymore.
    // But if we still want to use the getPriority function,
    // we could use React's useCallback hook to avoid unnecessary recreations of this function in every render.
    const getPriority = useCallback((blockchain: Blockchain): number => {
        // We can replace the switch statement here with object lookup method.
        // switch (blockchain) {
        //     case "Osmosis":
        //         return 100
        //     case "Ethereum":
        //         return 50
        //     case "Arbitrum":
        //         return 30
        //     case "Zilliqa":
        //         return 20
        //     case "Neo":
        //         return 20
        //     default:
        //         return -99
        // }

        return BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_BLOCKCHAIN_PRIORITY
    }, []) // No dependencies so the function will not be recreated.

    const sortedBalances: WalletBalance[] = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                // We can use the getPriority function here or use the object lookup method.
                const balancePriority =
                    BLOCKCHAIN_PRIORITY[balance.blockchain] ??
                    DEFAULT_BLOCKCHAIN_PRIORITY

                // We can replace these if statements with a simpler return statement.
                // if (lhsPriority > -99) {
                //     if (balance.amount <= 0) {
                //         return true
                //     }
                // }
                // return false
                return (
                    balancePriority > DEFAULT_BLOCKCHAIN_PRIORITY &&
                    balance.amount <= 0
                )
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                // We can use the getPriority function here or use the object lookup method.
                const leftPriority =
                    BLOCKCHAIN_PRIORITY[lhs.blockchain] ??
                    DEFAULT_BLOCKCHAIN_PRIORITY
                const rightPriority =
                    BLOCKCHAIN_PRIORITY[rhs.blockchain] ??
                    DEFAULT_BLOCKCHAIN_PRIORITY

                // We can replace these if statements with a simpler return statement.
                // if (leftPriority > rightPriority) {
                //     return -1
                // } else if (rightPriority > leftPriority) {
                //     return 1
                // }
                return rightPriority - leftPriority
            })
    }, [balances, prices])

    // We can use React's useMemo hook to prevent the creation of formattedBalances every render.
    const formattedBalances: FormattedWalletBalance[] = useMemo(
        () =>
            sortedBalances.map((balance: WalletBalance) => {
                // We can do the calculation for usdValue here.
                const usdValue = prices[balance.currency] * balance.amount
                return {
                    ...balance,
                    usdValue,
                    formatted: balance.amount.toFixed()
                }
            }),
        [sortedBalances] // Add sortedBalances to dependencies list, so the formattedBalances can be recreated only when sortedBalances changes.
    )

    const rows = formattedBalances.map(
        // Since we use the balance's properties multiple time to pass down to <WalletRow> component.
        // We can destructure the balance object to avoid repetition.
        (
            // balance: FormattedWalletBalance,
            { id, amount, usdValue, formatted }: FormattedWalletBalance
        ) => {
            // We can do the usdValue calculation before rendering to avoid doing the computation in every render.
            // const usdValue = prices[balance.currency] * balance.amount
            return (
                <WalletRow
                    className={classes.row}
                    // Using index as key could cause some unexpected behaviors.
                    // key={index}
                    key={id}
                    amount={amount}
                    usdValue={usdValue}
                    formattedAmount={formatted}
                />
            )
        }
    )

    return <div {...rest}>{rows}</div>
}
