export function getRandomPhoneNumber(): string{
    return `+7901${new Date().getTime().toString().substring(6)}`
}

export function getRandomEmail(): string{
    return `qa${timestamp}@gmail.com`
}