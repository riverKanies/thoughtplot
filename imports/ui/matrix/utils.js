export default {
    toDec: (num) => {
        const int = parseInt(num)
        if (num - int > .05) return num.toFixed(1)
        return int
    },
    findPos: (obj) => {
        var curtop = 0;
        if (obj.offsetParent) {
            do {
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        return [curtop];
        }
      }
}