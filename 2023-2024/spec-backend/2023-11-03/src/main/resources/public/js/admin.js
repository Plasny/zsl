/**
 * @param {string} redirect 
 */
async function generateRandomCars(redirect) {
    const n = 10;
    const promises = [];

    for (let i = 0; i < n; i++) {
        const model = Math.random().toString(35).slice(-3);
        const color = '#' + Math.random().toString(16).slice(-6);
        const year = new Date().getFullYear() - Math.round(Math.random() * 100);
        const airbags = new Array(4);

        for (let j = 0; j < airbags.length; j++) {
            airbags[j] = Boolean(Math.round(Math.random()));
        }

        promises.push(fetch("/api/cars", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                color: color,
                year: year,
                airbags: airbags
            })
        }))
    }

    if (redirect) {
        Promise.all(promises).then(() => {
            window.location.replace(redirect);
        })
    } else {
        await Promise.all(promises);
    }
}

