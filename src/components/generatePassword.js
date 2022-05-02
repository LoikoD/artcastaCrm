const generatePassword = (len = 12) => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    const charset = letters + numbers;

    let password = [];
    for (let i = 0; i < len; ++i) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password.push(charset[randomIndex]);
    }

    return password.join("");
}

export default generatePassword;