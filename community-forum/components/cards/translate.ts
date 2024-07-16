interface Props {
    selectedLanguage: string;
    typedText: string;
}

export async function translateText({selectedLanguage, typedText}:Props): Promise<string> {
    const requestBody = {
        text: typedText,
        toLang: selectedLanguage,
    };
    try {
        const response = await fetch(`https://server-gdsc-session.onrender.com/translate`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json' // Specify the content type as JSON
            },
            body: JSON.stringify(requestBody),
        });
        console.log(response.body)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        console.log(responseData)
        return responseData;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return "try again later"
    }
}