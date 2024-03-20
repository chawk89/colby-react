function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
var xs = [], ys = [], rs = [], data = [];
for (var i = 0; i < 20; i++) {
    var bubble = {
        x: getRandomNumber(0, 100), // Random X coordinate between 0 and 100
        y: getRandomNumber(0, 100), // Random Y coordinate between 0 and 100
        r: getRandomNumber(5, 20) // Random radius between 5 and 20
    };
    data.push(bubble);
    xs.push(bubble.x)
    ys.push(bubble.y)
    rs.push(bubble.r)
}

console.log(xs)
console.log(ys)
console.log(rs)
console.log(data)