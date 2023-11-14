// Take a product/item to calculate Similarity
// Generate the similarity score
// compare the similarities
// Sort based on score
// Return the response


const express=require('express')
const app = express();


const items=require('./items.json')

// Similarity Score Generator
/*
Suppose A has [apple,bananas,mangoes,potatoes]
B has [apple,oranges]

In order to generate similarity
Step1 : Get Common Items they have
Step 2 : Common Items length/sqrt(length of A * length of B)

1/sqrt(4*2)
1/sqrt(8)
1/2.85
Hence Similarity Score is 0.35
*/

const similarityCalculator = (item1, item2) => {
    const commonFeatures=item1.features.filter(feature=> item2.features.includes(feature))
    return commonFeatures.length/Math.sqrt(item1.features.length * item2.features.length)
    
}


const recommendor = (itemId)=>{
    const currentItem= items.find(item => item.id === itemId);
    if (!currentItem) {
        console.log("Item isnt Available")
        return [];
    }

    const similarityScore = items.map((item) => ({
        id: item.id,
        similarity: similarityCalculator(currentItem, item)
    }));


    // Sort the generated scores
    const sortedScores=similarityScore.sort((a,b)=> b.similarity - a.similarity)

    // Remove Current item out from the recommendation List
    const filteredList=sortedScores.filter((item)=> item.id !== itemId)

    return filteredList;
}


// API Endpoint
app.get('/recommend/:id', async (req, res) => {
    const  id =  req.params.id;
    const recommendation = recommendor(id);
    console.log(recommendation)
    res.send(recommendation)
})
app.listen(8080, () => {
    console.log("Server started at port 8080");
})