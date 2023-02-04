let counter = 0;

export const getCounter = () => {
    return counter;
};

export const setCounter = (count) => {
    counter = count;
};

export const incrementCounter = () => {
    counter+=1;
};