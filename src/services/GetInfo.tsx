const getInfo = async (ID:number, selectedMap:String) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/getPictures?id=${ID}&selected=${selectedMap}`;
    console.log(`Requesting pictures from: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: "cors"
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        // Returns the data from the server
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch pictures:', error);
        throw error;
    }
};

export { getInfo };
