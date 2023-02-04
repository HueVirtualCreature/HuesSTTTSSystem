export const updateURL = (param, force = false) => {
    const urlParams = new URLSearchParams(window.location.search);
    let para = param.split('=');
    if (!(urlParams.has(para[0].toLowerCase()))) {
        if (history.pushState) {
            let arr = window.location.href.split('?');
            let newurl;
            if (arr.length > 1 && arr[1] !== '') {
                newurl = window.location.href + '&' + param;
            } else {
                newurl = window.location.href + '?' + param;
            }
            window.history.pushState({ path: newurl }, '', newurl);
        }
        return;
    }
    if (!force || !history.pushState) {
        return;
    }
    let href = new URL(window.location.href);
    if (para.length === 1) {
        href.searchParams.set(para[0].toLowerCase(), "");
    } else {
        href.searchParams.set(para[0].toLowerCase(), para[1]);
    }
    console.log(href.toString());
    window.history.pushState({ path: href.toString() }, '', href.toString());
};