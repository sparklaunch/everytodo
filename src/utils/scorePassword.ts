export default function scorePassword(password: string) {
    let score = 0;
    if (!password) {
        return score;
    }
    interface Letter {
        [key: string]: number;
    }
    let letters: Letter = {};
    for (let i = 0; i < password.length; i++) {
        letters[password[i]] = (letters[password[i]] || 0) + 1;
        score += 5.0 / letters[password[i]];
    }
    interface Variation {
        [key: string]: boolean;
    }
    const variations: Variation = {
        digits: /\d/.test(password),
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        nonWords: /\W/.test(password)
    };
    let variationCount = 0;
    for (const check in variations) {
        variationCount += variations[check] ? 1 : 0;
    }
    score += (variationCount - 1) * 10;
    return score;
}