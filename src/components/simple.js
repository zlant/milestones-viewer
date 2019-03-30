export function simple(arr, size) {
    if (arr.length == 0)
        return []

    var res = [arr[0]]
    var current = null

    for (var val of arr) {
        if (val.distance - res[res.length - 1].distance >= size * 2) {
            if (current) {
                res.push(current)
                current = null
            } else
                res.push(val)
        }
        else if (val.distance - res[res.length - 1].distance >= size) {
            if (val.distance % size === 0)
                res.push(val)
            else
                current = val
        }
    }

    if (res[res.length - 1].distance != arr[arr.length - 1].distance)
        res.push(arr[arr.length - 1])

    return res
}