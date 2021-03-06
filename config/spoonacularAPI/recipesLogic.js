const fetch = require("node-fetch");
// Import object that contains the Spoonacular config data.
const { spoonacularConfig } = require("./spoonacularAPI");

// Function to retrieve specified number of recipe IDs from Spoonacular API
async function getRecipeIds(diet) {
  try {
    const apiUrl =
      spoonacularConfig.API_PATH +
      spoonacularConfig.apiUrlExtension +
      diet +
      spoonacularConfig.apiNumberOfResults +
      spoonacularConfig.API_APP_KEY2;
    const data = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const response = await data.json();
    let recipeIds = "";
    for (let i = 0; i < response.recipes.length; i++) {
      const id = response.recipes[i].id;
      if (i < response.recipes.length - 1) {
        recipeIds += `${id},`;
      } else {
        recipeIds += `${id}`;
      }
    }
    return recipeIds;
  } catch (err) {
    console.error(err);
  }
}

// Function to get detailed information about the recipes.
const getRecipes = async diet => {
  try {
    const recipeIds = await getRecipeIds(diet);
    const apiUrl2 =
      spoonacularConfig.API_PATH2 +
      spoonacularConfig.apiUrlExtensionIds +
      recipeIds +
      spoonacularConfig.apiUrlExtension3 +
      spoonacularConfig.API_APP_KEY4;
    const data = await fetch(apiUrl2, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const response = await data.json();
    // Reduce the amount of data in Spoonacular response to data we will use.
    // We want recipe title, image, Spoonacular URL, caloric data.
    const reducedRecipesData = response.map(item => {
      return {
        title: item.title,
        image: item.image || "../assets/broken1.png",
        url: item.spoonacularSourceUrl,
        nutrientsUnit: item.nutrition.nutrients[0].unit,
        nutrientsName: item.nutrition.nutrients[0].name,
        nutrientsAmount: item.nutrition.nutrients[0].amount
      };
    });
    // Return the result so it can be used in html-routes to then populate recipes.handlebars with data.
    return reducedRecipesData;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { getRecipes };
