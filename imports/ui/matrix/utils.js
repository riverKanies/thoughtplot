export default {
    toDec: (num) => {
        const int = parseInt(num)
        if (num - int > .05) return num.toFixed(1)
        return int
    }
}