export default async function getData(url, options) {
    try{
        const fetchResponse = await fetch(url, options)
    
        const data = await fetchResponse.json()
        return data
    } catch(err) {
        console.error(err);
    }
}