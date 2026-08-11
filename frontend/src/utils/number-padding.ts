export function numberPadding(num: number, length: number): string {
    return num.toString().padStart(length, '0');
}
