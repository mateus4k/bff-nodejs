module.exports = async (req, res, next) => {
    const delay = Math.floor(Math.random() * 2000);

    setTimeout(() => next(), delay);
}