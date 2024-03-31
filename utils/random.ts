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
    const day = (now.getDate() + 1) > 9 ? (now.getDate()).toString() : `0${now.getDate() + 1}`
    return (`${year}-${month}-${day}`); //TODO Проследить как работает на разных датах, так как убран вывод +1
}

export function randomSport_experience(): string {
    const sport_experience = ['Нет опыта', '0-6 месяцев', 'Больше 5 лет', '2-3 года', '1-2 года', '3-5 лет'];
    const randomSport_experience = sport_experience[(Math.floor(Math.random() * (sport_experience.length)))];
    return randomSport_experience
}

export function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-0${tomorrow.getMonth() + 1}-0${tomorrow.getDate()}T03:00:00Z`; //TODO Придумать как правильно убрать костыль, и выводить дату нормально
} 


export function getTomorrowEnd() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-0${tomorrow.getMonth() + 1}-0${tomorrow.getDate()}T04:00:00Z`;  //TODO Придумать как правильно убрать костыль, и выводить дату нормально
}