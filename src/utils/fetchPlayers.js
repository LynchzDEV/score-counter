export const fetchPlayers = async () => {
    return fetch('https://wxjz77gorj.execute-api.ap-southeast-1.amazonaws.com/list-players')
    .then(reponse => reponse.json())
};
