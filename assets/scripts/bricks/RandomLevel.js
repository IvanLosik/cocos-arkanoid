let RandomLevel = {
    rows: 5,
    cols: 8,
    minValue: 0,
    maxValue: 3,

    generate: function () {
        let level = [];

        for (let row = 0; row < this.rows; row++) {
            let line = [];

            for (let col = 0; col < this.cols; col++) {
                line.push(this.getRandomValue());
            }

            level.push(line);
        }

        return level;
    },

    getRandomValue: function () {
        return Math.floor(Math.random() * (this.maxValue + 1));
    }
};

module.exports = RandomLevel;