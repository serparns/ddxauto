export function getRandomPhoneNumber(): string {
    return `+7901${new Date().getTime().toString().substring(6)}`
}

export function getRandomEmail(): string {
    return `qa${new Date().getTime().toString()}@qatest.qa`
}

export function getRandomName(): string {
    return `qa${new Date().getTime().toString()}test`
}

export function getRandomCardNumber(): string {
    return `qa${new Date().getTime().toString()}test`
}

export function getDate(day: number, time?: string) {
    let t = new Date();
    t.setDate(t.getDate() + day);
    let date = t.toISOString().split("T")[0] + time;
    return date.split('undefined')[0]
};// Переписал польностью получение даты, работает на параметрах которые были перереданы, там где вызывается дата

export function randomSport_experience(): string {
    const sport_experience = ['Нет опыта', '0-6 месяцев', 'Больше 5 лет', '2-3 года', '1-2 года', '3-5 лет'];
    const randomSport_experience = sport_experience[(Math.floor(Math.random() * (sport_experience.length)))];
    return randomSport_experience
}