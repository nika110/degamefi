
export const randomizecryptoData = (Cryptos) => {
    return Object.entries(Cryptos).reduce((acc, [category, cryptoList]) => {
        acc[category] = cryptoList.map(crypto => ({
            ...crypto,
            performance: `${(Math.random() * 40 - 20).toFixed(2)}%` // Random performance between -20% and 20%
        }));
        return acc;
    }, {});
};