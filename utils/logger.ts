export function log(title: string, body: any = ""): void {
    console.log(`\n\t-- ${title.toUpperCase()}--`);
    console.log(body);
}