import { useTokenPrice } from "@/hooks/use-token-price"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CurrencySwapFormType, FormType, Token } from "../types/types"
import CurrencyContainer from "./currency-container"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem } from "./ui/form"

const formSchema = z.object({
    from: z.object({
        currency: z.string().nonempty(),
        amount: z.string()
    }),
    to: z.object({
        currency: z.string().nonempty(),
        amount: z.string()
    })
})

const CurrencySwapForm = () => {
    const { tokenList } = useTokenPrice()
    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            from: { currency: "", amount: "0" },
            to: { currency: "", amount: "0" }
        }
    })

    const [selected, setSelected] = useState<{ from: boolean; to: boolean }>({
        from: false,
        to: false
    })

    const [ratio, setRatio] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleChangeForm = (
        type: CurrencySwapFormType,
        field: string,
        value: string | number
    ) => {
        if (field === "amount") {
            setSelected({
                from: false,
                to: false,
                [type]: true
            })
        }

        if (field === "currency") {
            if (
                (selected.from && type === FormType.From) ||
                (selected.to && type === FormType.To)
            ) {
                form.setValue("from.amount", "0")
                form.setValue("to.amount", "0")
            }
        }

        form.setValue(
            type,
            {
                ...form.getValues(type),
                [field]: value
            },
            { shouldValidate: true }
        )

        if (!tokenList) return

        const fromToken = tokenList.find(
            (token: Token) => token.currency === form.getValues("from.currency")
        )
        const toToken = tokenList.find(
            (token: Token) => token.currency === form.getValues("to.currency")
        )

        if (fromToken && toToken) {
            const ratio = fromToken.price / toToken.price
            setRatio(ratio)
        }
    }

    useEffect(() => {
        setIsLoading(true)
        if (!ratio) {
            setIsLoading(false)
            return
        }
        if (selected.from) {
            form.setValue(
                FormType.To,
                {
                    ...form.getValues(FormType.To),
                    amount: (
                        parseFloat(form.getValues("from.amount")) * ratio
                    ).toFixed(6)
                },
                { shouldValidate: true }
            )
        }

        if (selected.to) {
            form.setValue(
                FormType.From,
                {
                    ...form.getValues(FormType.From),
                    amount: (
                        parseFloat(form.getValues("to.amount")) / ratio
                    ).toFixed(6)
                },
                { shouldValidate: true }
            )
        }

        // Mock backend response
        const timeoutId = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [form, selected, ratio])

    const onSubmit = () => {}

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
                <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="py-4">
                                    <CurrencyContainer
                                        currency={field.value.currency}
                                        type={FormType.From}
                                        amount={field.value.amount}
                                        onFormChange={(
                                            property: string,
                                            value: string | number
                                        ) =>
                                            handleChangeForm(
                                                FormType.From,
                                                property,
                                                value
                                            )
                                        }
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="py-4">
                                    <CurrencyContainer
                                        currency={field.value.currency}
                                        type={FormType.To}
                                        amount={field.value.amount}
                                        onFormChange={(
                                            field: string,
                                            value: string | number
                                        ) =>
                                            handleChangeForm(
                                                FormType.To,
                                                field,
                                                value
                                            )
                                        }
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <p className={`${ratio ? "visible" : "invisible"} mb-4`}>
                    1 {form.getValues("from.currency")} = {ratio.toFixed(6)}{" "}
                    {form.getValues("to.currency")}
                </p>
                <Button
                    className="w-full bg-blue-500 hover:bg-blue-800"
                    type="submit"
                    disabled={
                        !form.formState.isValid ||
                        form.getValues("from.amount") === "0" ||
                        form.getValues("to.amount") === "0" ||
                        isLoading
                    }
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <p className="font-bold">Swap</p>
                    )}
                </Button>
            </form>
        </Form>
    )
}

export default CurrencySwapForm
