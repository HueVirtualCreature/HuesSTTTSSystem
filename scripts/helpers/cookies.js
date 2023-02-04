export const writeCookies = (key, value) => {
    document.cookie = `${key}=${value}`;
    console.log(document.cookie);
}

export const getCookie = (cookieName) =>{
    const name = cookieName + "=";
    const matchingCookie = document.cookie.split(';').find(cookie => {
        return cookie.trim().startsWith(name);
    });
    if(!matchingCookie){
        return '';
    }
    return matchingCookie.replace(name, '').trim();
}