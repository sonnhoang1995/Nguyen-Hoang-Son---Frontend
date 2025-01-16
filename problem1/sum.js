// Using loops like for, while...
var sum_to_n_a = function (n) {
    let sum = 0

    for (let i = 1; i <= n; i++) {
        sum += i
    }

    return sum
}

// Using Javascript's Array methods like reduce, forEach...
var sum_to_n_b = function (n) {
    // Input validation
    if (n < 0) return 0

    const arr = Array(n).fill()

    const sum = arr.reduce((prev, curr, i) => (prev += i + 1), 0)

    return sum
}

// Using recursion
var sum_to_n_c = function (n) {
    if (n < 1) return 0

    return n + sum_to_n_c(n - 1)
}
