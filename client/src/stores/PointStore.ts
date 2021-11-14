export default Object.freeze({
    PointTypes: [
        {
            name: "Scrum: 0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100 and ?",
            value: 0
        },
        {
            name: "Fibonacci: 0, ½, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 and ?",
            value: 1
        },
        {
            name: "Sequential: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 and ?",
            value: 2
        },
        {
            name: "Hourly: 0, 4, 8, 16, 24, 32, 40, 60, 80, and ?",
            value: 3
        },
        {
            name: "T-Shirt: XXS, XS, S, M, L, XL, XXL and ?",
            value: 4
        }
    ],
    Points: [
        {
            pointType: 'SCRUM',
            values: ["0", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?"]
        },
        {
            pointType: 'FIBONACCI',
            values: ["0", "1/2", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?"]
        },
        {
            pointType: 'SEQUENTIAL',
            values: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "?"]
        },
        {
            pointType: 'HOURLY',
            values: ["0", "4", "8", "16", "24", "32", "40", "60", "80", "?"]
        },
        {
            pointType: 'TSHIRT',
            values: ["XXS", "XS", "S", "M", "L", "L", "XL", "XXL", "?"]
        },
    ]
})