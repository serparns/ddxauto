export function getRandomPhoneNumber(): string {
    return `+7901${new Date().getTime().toString().substring(6)}`
}

export function getRandomEmail(): string {
    return `qa${new Date().getTime().toString()}@gmail.com`
}

export function getRandomName(): string {
    return `qa${new Date().getTime().toString()}test`
}

export function getRandomCardNumber(): string {
    return `qa${new Date().getTime().toString()}test`
}

export function getDate(): string {
    const now = new Date();
    const year = now.getFullYear().toString()
    const month = (now.getMonth() + 1) > 9 ? (now.getMonth() + 1).toString() : `0${now.getMonth() + 1}`
    const day = (now.getDate() + 1) > 9 ? (now.getDate() + 1).toString() : `0${now.getDate() + 1}`
    return (`${year}-${month}-${day}`);
}

export function randomSport_experience(): string {
    const sport_experience = ['Нет опыта', '0-6 месяцев', 'Больше 5 лет', '2-3 года', '1-2 года', '3-5 лет'];
    const randomSport_experience = sport_experience[(Math.floor(Math.random() * (sport_experience.length)))];
    return randomSport_experience
}


