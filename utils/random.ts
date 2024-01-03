export function getRandomPhoneNumber(): string{
    return `+7901${new Date().getTime().toString().substring(6)}`
}

export function getRandomEmail(): string{
    return `qa${new Date().getTime().toString()}@gmail.com`
}


export function getRandomCardNumber(): string{
    return `qa${new Date().getTime().toString()}test`
}

export function randomSport_experience(): string{
const sport_experience = ['Нет опыта', '0-6 месяцев', 'Больше 5 лет', '2-3 года', '1-2 года', '3-5 лет'];
const randomSport_experience = sport_experience[(Math.floor(Math.random() * (sport_experience.length)))];
    return randomSport_experience
}
